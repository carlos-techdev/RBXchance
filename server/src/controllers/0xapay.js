// Require Dependencies
const axios = require("axios");
const config = require("../config");

async function makeReq(coin) {
  let add;
      
  const header = {
    "Content-Type": "application/json"
  };
  
  await axios.post(`https://api.oxapay.com/merchants/request/staticaddress`, 
    {
      "merchant": config.authentication.oaxpay.merchant_id,
      "currency": coin,
      "callbackUrl": config.authentication.oaxpay.callback_url
    }, { headers: header}).then(response => {
        add = response.data.address;
      }).catch(error => {
        console.error('Error:', error);
      });

  return add
}

async function createDepositAddress() {
  try { 
    return {
      btc: await makeReq("BTC"),
      ltc: await makeReq("LTC"),
      eth: await makeReq("ETH"),
      doge: await makeReq("DOGE"),
      usdt: await makeReq("USDT"),
      usdc: await makeReq("USDC"),
    }
  } catch (error) {
    console.log(error);
  }
}


async function createWithdrawTransaction() {
  try {

  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createDepositAddress,
  createWithdrawTransaction,
};
