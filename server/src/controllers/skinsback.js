// Require Dependencies
const config = require("../config");

const SkinsBack = require("skinsback-sdk").API;

const sbTransaction = require("../models/sbTransaction");
const sbWithdrawTransaction = require("../models/sbWithdrawTransaction");
const User = require("../models/User");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");

const options = {
    shop_id: config.authentication.skinsback.shop_id,
    secret_key: config.authentication.skinsback.secret_key,
};

const API = new SkinsBack(options);

var ShopItemsCSGO = [];
var ShopItemsRUST = [];
var ShopItemsDOTA2 = [];

const WITHDRAW_COMMISSION = config.authentication.skinsback.withdrawFee;

const main = async () => {
    let status = await API.serverStatus();
    return status;
};

const create_order = async (order_id, user_id) => {
    try {
        let findPending = await sbTransaction.findOne({ user_id, status: 0 });
        let isExpired = 60000 * 50; // 50 minutes till skinsback link expires
        if (findPending && findPending.unixtime + isExpired < Date.now()) {
            findPending.status = 3;
            await findPending.save();
            return await createOrder(order_id, user_id);
        }
        if (!findPending) return await createOrder(order_id, user_id);
        return findPending.hash;
    } catch (e) {
        console.error(`SkinsBack API error - create_order func -`, e.toString());
    }
};

/**
 * @description createOrder API & add into database
 */
const createOrder = async (order_id, user_id) => {
    try {
        let order = await API.createOrder(order_id);
        if (order.status == "success") {
            let hash = order.url.split("?hash=")[1];
            let transaction = new sbTransaction({
                user_id,
                order_id,
                tid: order.transaction_id,
                hash,
            });
            await transaction.save();
            return hash;
        }
        console.error(order);
        throw new Error(`Status failed`, order);
    } catch (e) {
        console.error(`SkinsBack API error - create order -`, e.toString());
    }
};

const result = async body => {
    try {
        let { status, transaction_id, order_id, amount, user_amount } = body;
        let findTransaction = await sbTransaction.findOne({
            order_id,
            tid: transaction_id,
        });

        if (status == "fail") {
            findTransaction.status = 2;
            await findTransaction.save();
            return;
        }

        if (status == "pending")
            return console.error(
                `[SKINSBACK] Order ID ${order_id} is still in Pending...`
            );

        if (!findTransaction) {
            throw new Error(`Could not find the transaction in the database.`);
        }

        findTransaction.status = 1;
        findTransaction.amount = amount;
        findTransaction.user_amount = user_amount;

        await findTransaction.save();

        let user = await User.findOne({ _id: findTransaction.user_id });

        // Update user document
        await User.updateOne(
            { _id: user.id },
            {
                $inc: {
                    wallet: user_amount,
                    totalDeposited: user_amount,
                    wagerNeededForWithdraw:
                        user.wagerNeededForWithdraw < 0
                            ? Math.abs(user.wagerNeededForWithdraw) + user_amount
                            : user_amount,
                },
            }
        );
        await insertNewWalletTransaction(user.id, user_amount, "Skinsback Deposit");

        return { success };
    } catch (e) {
        console.error(`SkinsBack API error - result -`, e.toString());
    }
};

const check_order_statues = async () => {
    try {
        // get all withdraw transactions with state 0 ( just added into database )
        let withdrawTransactions = await sbWithdrawTransaction.find({ state: 0 });

        // if empty, stop
        if (!withdrawTransactions) return;

        for (let x in withdrawTransactions) {
            try {
                await checkOrderStatusByID(withdrawTransactions[x]);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const checkOrderStatusByID = async tr => {
    try {
        let { order_id, user_id, amount } = tr;

        let resp = await API.getOrderStatusByOrderId(order_id);

        if (resp && resp.data) {
            let { status } = resp.data;

            if (status === "pending") {
                console.error(
                    `[SKINSBACK ORDER CHECK] Order ID ${order_id} is still in Pending state!`
                );
            }

            if (status === "fail") {
                // if fail update in DB state > 2 == FAILED/ERROR
                await sbWithdrawTransaction.updateOne(
                    {
                        order_id
                    },
                    {
                        $set: {
                            state: 2
                        }
                    }
                );
                // credit the user the amount back
                await User.updateOne({ _id: user_id }, { $inc: { wallet: amount } });
                console.error(
                    `[SKINSBACK CHECK ORDER] Order ID ${order_id} failed, user ${user_id} got refunded back ${amount}!`
                );
                return;
            }

            if (status === "success") {
                // if success just update in db with state 1 == SUCCESS
                await sbWithdrawTransaction.updateOne(
                    {
                        order_id
                    },
                    {
                        $set: {
                            state: 1
                        }
                    }
                );
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const withdraw_itemsCSGO = async (user_id, items, tradelink) => {
    try {
        if (items.length == 0)
            return res.json({
                success: false,
                error: `You need to select at least one item to withdraw!`,
            });

        if (items.length > 5)
            return res.json({
                success: false,
                error: `You can withdraw maximum 5 items at once!`,
            });

        if (!(tradelink.includes("partner=") && tradelink.includes("token=")))
            return res.json({
                success: false,
                error: `Invalid tradelink!`,
            });

        let responses_data = [];
        let deduct_balance = 0;
        let items_value = 0;

        // tokens[0] = partner
        // tokens[1] = token
        let [partner, token] = tradelink.split("partner=")[1].split("&token=");

        let item_error_price = false;

        for (let d in items) {
            let item_price = ShopItemsCSGO.filter(i => {
                return i.name == items[d];
            }).map(i => {
                return i.price;
            });
            if (item_price.length == 0) {
                item_error_price = true;
                continue;
            }
            items_value = parseFloat(items_value) + parseFloat(item_price[0]);
        }

        if (item_error_price)
            return {
                success: false,
                error: `An error ocurred getting item's price, please refresh the withdraw inventory!`,
            };

        let dbUser = await User.findOne({ _id: user_id });
        if (dbUser.wallet < items_value)
            return {
                success: false,
                error: `You don't have enough balance to withdraw these items!`,
            };

        // Check that user has wagered atleast 100% of his deposited amount    
        if (dbUser.wagerNeededForWithdraw > 0)
            return {
                success: false,
                error: `You must wager atleast $${dbUser.wagerNeededForWithdraw.toFixed(2)} before withdrawing!`,
            };

        const createResponseReq = async item => {
            try {
                let item_price = ShopItemsCSGO.filter(i => {
                    return i.name == item;
                });
                let resp = await API.buyItemByNameAndSendToUser({
                    partner,
                    token,
                    name: item,
                    max_price: item_price[0].price || 0,
                    game: "csgo",
                });

                if (resp.data && resp.data.offer_status) {
                    let valid_offer_statues = [
                        "creating_trade",
                        "waiting_accept",
                        "accepted",
                    ];

                    if (valid_offer_statues.indexOf(resp.data.offer_status) >= 0) {
                        deduct_balance =
                            parseFloat(deduct_balance) + parseFloat(item_price);
                    }
                }

                responses_data.push(resp.data);
            } catch (e) {
                console.error(e);
                responses_data.push({ error: true });
            }
        };

        for (let x in items) {
            createResponseReq(items[x]);
        }

        return new Promise(async resolve => {
            let int = setInterval(async () => {
                if (responses_data.length == items.length) {
                    clearInterval(int);

                    console.log(responses_data);

                    await User.updateOne(
                        { _id: user_id },
                        { $inc: { wallet: -deduct_balance } }
                    );

                    let errors_lengt = 0;
                    for (let x in responses_data) {
                        if (responses_data[x].error) errors_lengt++;
                        else {
                            let { buy_id, offer_status, item, balance_debited_sum } =
                                responses_data[x];
                            let amount = ShopItemsCSGO.filter(i => {
                                return i.name == item.name;
                            }).map(i => {
                                return i.price;
                            })[0];
                            let tr = new sbWithdrawTransaction({
                                user_id,
                                buy_id,
                                offer_status,
                                item,
                                amount,
                                balance_debited_sum,
                            });

                            await tr.save();
                        }
                    }

                    let msg = `You have successfully withdraw ${items.length}. If by any chance you don't get an item, we handle the refund automatically!`;
                    if (errors_lengt < items.length)
                        msg = `${errors_lengt} items were not found anymore, we sent ${items.length} instead. If by any chance you don't get an item, we handle the refund automatically!`;
                    else if (errors_lengt == items.length)
                        return resolve({
                            success: false,
                            error: `An error occurred with the game items you were trying to withdraw, try refreshing the withdrawal inventory or contact support!`,
                        });

                    console.log(`responses_data`, responses_data);
                    return resolve({ success: true, msg });
                }
            }, 250);
        });
    } catch (e) {
        console.error(e);
        return { success: false, error: e.toString() };
    }
};

const withdraw_itemsRUST = async (user_id, items, tradelink) => {
    try {
        if (items.length == 0)
            return res.json({
                success: false,
                error: `You need to select at least one item to withdraw!`,
            });

        if (items.length > 5)
            return res.json({
                success: false,
                error: `You can withdraw maximum 5 items at once!`,
            });

        if (!(tradelink.includes("partner=") && tradelink.includes("token=")))
            return res.json({
                success: false,
                error: `Invalid tradelink!`,
            });

        let responses_data = [];
        let deduct_balance = 0;
        let items_value = 0;

        // tokens[0] = partner
        // tokens[1] = token
        let [partner, token] = tradelink.split("partner=")[1].split("&token=");

        let item_error_price = false;

        for (let d in items) {
            let item_price = ShopItemsRUST.filter(i => {
                return i.name == items[d];
            }).map(i => {
                return i.price;
            });
            if (item_price.length == 0) {
                item_error_price = true;
                continue;
            }
            items_value = parseFloat(items_value) + parseFloat(item_price[0]);
        }

        if (item_error_price)
            return {
                success: false,
                error: `An error ocurred getting item's price, please refresh the withdraw inventory!`,
            };

        let dbUser = await User.findOne({ _id: user_id });
        if (dbUser.wallet < items_value)
            return {
                success: false,
                error: `You don't have enough balance to withdraw these items!`,
            };

        // Check that user has wagered atleast 100% of his deposited amount    
        if (dbUser.wagerNeededForWithdraw > 0)
            return {
                success: false,
                error: `You must wager atleast $${dbUser.wagerNeededForWithdraw.toFixed(2)} before withdrawing!`,
            };

        const createResponseReq = async item => {
            try {
                let item_price = ShopItemsRUST.filter(i => {
                    return i.name == item;
                });
                let resp = await API.buyItemByNameAndSendToUser({
                    partner,
                    token,
                    name: item,
                    max_price: item_price[0].price || 0,
                    game: "rust",
                });

                if (resp.data && resp.data.offer_status) {
                    let valid_offer_statues = [
                        "creating_trade",
                        "waiting_accept",
                        "accepted",
                    ];

                    if (valid_offer_statues.indexOf(resp.data.offer_status) >= 0) {
                        deduct_balance =
                            parseFloat(deduct_balance) + parseFloat(item_price);
                    }
                }

                responses_data.push(resp.data);
            } catch (e) {
                console.error(e);
                responses_data.push({ error: true });
            }
        };

        for (let x in items) {
            createResponseReq(items[x]);
        }

        return new Promise(async resolve => {
            let int = setInterval(async () => {
                if (responses_data.length == items.length) {
                    clearInterval(int);

                    console.log(responses_data);

                    await User.updateOne(
                        { _id: user_id },
                        { $inc: { wallet: -deduct_balance } }
                    );

                    let errors_lengt = 0;
                    for (let x in responses_data) {
                        if (responses_data[x].error) errors_lengt++;
                        else {
                            let { buy_id, offer_status, item, balance_debited_sum } =
                                responses_data[x];
                            let amount = ShopItemsRUST.filter(i => {
                                return i.name == item.name;
                            }).map(i => {
                                return i.price;
                            })[0];
                            let tr = new sbWithdrawTransaction({
                                user_id,
                                buy_id,
                                offer_status,
                                item,
                                amount,
                                balance_debited_sum,
                            });

                            await tr.save();
                        }
                    }

                    let msg = `You have successfully withdraw ${items.length}. If by any chance you don't get an item, we handle the refund automatically!`;
                    if (errors_lengt < items.length)
                        msg = `${errors_lengt} items were not found anymore, we sent ${items.length} instead. If by any chance you don't get an item, we handle the refund automatically!`;
                    else if (errors_lengt == items.length)
                        return resolve({
                            success: false,
                            error: `An error occurred with the game items you were trying to withdraw, try refreshing the withdrawal inventory or contact support!`,
                        });

                    console.log(`responses_data`, responses_data);
                    return resolve({ success: true, msg });
                }
            }, 250);
        });
    } catch (e) {
        console.error(e);
        return { success: false, error: e.toString() };
    }
};

const withdraw_itemsDOTA2 = async (user_id, items, tradelink) => {
    try {
        if (items.length == 0)
            return res.json({
                success: false,
                error: `You need to select at least one item to withdraw!`,
            });

        if (items.length > 5)
            return res.json({
                success: false,
                error: `You can withdraw maximum 5 items at once!`,
            });

        if (!(tradelink.includes("partner=") && tradelink.includes("token=")))
            return res.json({
                success: false,
                error: `Invalid tradelink!`,
            });

        let responses_data = [];
        let deduct_balance = 0;
        let items_value = 0;

        // tokens[0] = partner
        // tokens[1] = token
        let [partner, token] = tradelink.split("partner=")[1].split("&token=");

        let item_error_price = false;

        for (let d in items) {
            let item_price = ShopItemsDOTA2.filter(i => {
                return i.name == items[d];
            }).map(i => {
                return i.price;
            });
            if (item_price.length == 0) {
                item_error_price = true;
                continue;
            }
            items_value = parseFloat(items_value) + parseFloat(item_price[0]);
        }

        if (item_error_price)
            return {
                success: false,
                error: `An error ocurred getting item's price, please refresh the withdraw inventory!`,
            };

        let dbUser = await User.findOne({ _id: user_id });
        if (dbUser.wallet < items_value)
            return {
                success: false,
                error: `You don't have enough balance to withdraw these items!`,
            };

        // Check that user has wagered atleast 100% of his deposited amount    
        if (dbUser.wagerNeededForWithdraw > 0)
            return {
                success: false,
                error: `You must wager atleast $${dbUser.wagerNeededForWithdraw.toFixed(2)} before withdrawing!`,
            };

        const createResponseReq = async item => {
            try {
                let item_price = ShopItemsDOTA2.filter(i => {
                    return i.name == item;
                });
                let resp = await API.buyItemByNameAndSendToUser({
                    partner,
                    token,
                    name: item,
                    max_price: item_price[0].price || 0,
                    game: "dota2",
                });

                if (resp.data && resp.data.offer_status) {
                    let valid_offer_statues = [
                        "creating_trade",
                        "waiting_accept",
                        "accepted",
                    ];

                    if (valid_offer_statues.indexOf(resp.data.offer_status) >= 0) {
                        deduct_balance =
                            parseFloat(deduct_balance) + parseFloat(item_price);
                    }
                }

                responses_data.push(resp.data);
            } catch (e) {
                console.error(e);
                responses_data.push({ error: true });
            }
        };

        for (let x in items) {
            createResponseReq(items[x]);
        }

        return new Promise(async resolve => {
            let int = setInterval(async () => {
                if (responses_data.length == items.length) {
                    clearInterval(int);

                    console.log(responses_data);

                    await User.updateOne(
                        { _id: user_id },
                        { $inc: { wallet: -deduct_balance } }
                    );

                    let errors_lengt = 0;
                    for (let x in responses_data) {
                        if (responses_data[x].error) errors_lengt++;
                        else {
                            let { buy_id, offer_status, item, balance_debited_sum } =
                                responses_data[x];
                            let amount = ShopItemsDOTA2.filter(i => {
                                return i.name == item.name;
                            }).map(i => {
                                return i.price;
                            })[0];
                            let tr = new sbWithdrawTransaction({
                                user_id,
                                buy_id,
                                offer_status,
                                item,
                                amount,
                                balance_debited_sum,
                            });

                            await tr.save();
                        }
                    }

                    let msg = `You have successfully withdraw ${items.length}. If by any chance you don't get an item, we handle the refund automatically!`;
                    if (errors_lengt < items.length)
                        msg = `${errors_lengt} items were not found anymore, we sent ${items.length} instead. If by any chance you don't get an item, we handle the refund automatically!`;
                    else if (errors_lengt == items.length)
                        return resolve({
                            success: false,
                            error: `An error occurred with the game items you were trying to withdraw, try refreshing the withdrawal inventory or contact support!`,
                        });

                    console.log(`responses_data`, responses_data);
                    return resolve({ success: true, msg });
                }
            }, 250);
        });
    } catch (e) {
        console.error(e);
        return { success: false, error: e.toString() };
    }
};

const load_market_items_CSGO = async user_id => {
    try {
        let res = await API.getMarketPriceList("csgo");
        let items_filtered = res.items
            .filter(i => {
                return i.count > 0 && i.price > config.authentication.skinsback.withdrawMinItemPrice;
            })
            .map(i => {
                // commission for items in withdraw
                let better_price = WITHDRAW_COMMISSION;
                let price = parseFloat(parseFloat(i.price + i.price * (better_price / 100)).toFixed(2));

                return {
                    name: i.name,
                    price,
                    image: `https://steamcommunity-a.akamaihd.net/economy/image/class/730/${i.classid}/300fx300f`,  // set null, when testing
                };
            });
        console.log(`[SKINSBACK SHOP] Loaded ${items_filtered.length} CS:GO items from the API for user ${user_id}.`);
        ShopItemsCSGO = items_filtered;
        return items_filtered;
    } catch (e) {
        console.error(`SkinsBack API error`, e.toString());
    }
};

const load_market_items_RUST = async user_id => {
    try {
        let res = await API.getMarketPriceList("rust");
        let items_filtered = res.items
            .filter(i => {
                return i.count > 0 && i.price > config.authentication.skinsback.withdrawMinItemPrice;
            })
            .map(i => {
                // commission for items in withdraw
                let better_price = WITHDRAW_COMMISSION;
                let price = parseFloat(parseFloat(i.price + i.price * (better_price / 100)).toFixed(2));

                return {
                    name: i.name,
                    price,
                    image: `https://steamcommunity-a.akamaihd.net/economy/image/class/252490/${i.classid}/300fx300f`,  // set null, when testing
                };
            });
        console.log(`[SKINSBACK SHOP] Loaded ${items_filtered.length} RUST items from the API for user ${user_id}.`);
        ShopItemsRUST = items_filtered;
        return items_filtered;
    } catch (e) {
        console.error(`SkinsBack API error`, e.toString());
    }
};

const load_market_items_DOTA2 = async user_id => {
    try {
        let res = await API.getMarketPriceList("dota2");
        let items_filtered = res.items
            .filter(i => {
                return i.count > 0 && i.price > config.authentication.skinsback.withdrawMinItemPrice;
            })
            .map(i => {
                // commission for items in withdraw
                let better_price = WITHDRAW_COMMISSION;
                let price = parseFloat(parseFloat(i.price + i.price * (better_price / 100)).toFixed(2));

                return {
                    name: i.name,
                    price,
                    image: `https://steamcommunity-a.akamaihd.net/economy/image/class/570/${i.classid}/300fx300f`,  // set null, when testing
                };
            });
        console.log(`[SKINSBACK SHOP] Loaded ${items_filtered.length} DOTA2 items from the API for user ${user_id}.`);
        ShopItemsDOTA2 = items_filtered;
        return items_filtered;
    } catch (e) {
        console.error(`SkinsBack API error`, e.toString());
    }
};

setInterval(() => {
    check_order_statues();
}, 40000);

module.exports = {
    main,
    create_order,
    result,
    load_market_items_CSGO,
    load_market_items_RUST,
    load_market_items_DOTA2,
    withdraw_itemsCSGO,
    withdraw_itemsRUST,
    withdraw_itemsDOTA2,
};