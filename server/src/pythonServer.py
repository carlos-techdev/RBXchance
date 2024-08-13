from flask import Flask, request, jsonify
import pymongo
import hashlib
import time
import random
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

flask_api_prefix = '/flask-api'

app = Flask(__name__, root_path=flask_api_prefix)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB (adjust as needed)

client = pymongo.MongoClient("mongodb+srv://flip:F6prJNuIZ0WiSYSp@icebet.guzdpb3.mongodb.net/?retryWrites=true&w=majority")  # Modify the connection URL as needed
db = client["test"] 
user_database = db["users"]  
mm2withdrawals_database = db["mm2Withdrawals"]  
item_values = {} 

## print(user_database.find_one({"robloxUsername": "flipped"}))

config_dir = os.path.join(os.path.dirname(__file__), 'config')

items_json_path = os.path.join(config_dir, 'items.json')

with open(items_json_path, 'r') as items_file:
    item_values = json.load(items_file)

@app.route("/", methods=['GET'])
def respondToBaisc():
    return {"isFlaskActive": True}, 500    

@app.route("/ValidateUser", methods=['POST'])
def checkplayer():
    try:
        userid = request.json['Data']['UserId']
        if user_database.find_one({"robloxUsername": userid}):
            return {"Valid": True}, 200
        else:
            return {"Valid": False}, 200
    except:
        return {"Valid": False}, 500

@app.route("/GetUserData", methods=['POST'])
def GetUserData():
    try:
        userid = request.json['Data']['UserId']
        userdata = user_database.find_one({"robloxUsername": userid})
        if userdata:
            return {"Exists": True, "Valid": True, "Blacklisted": False, "Blacklist": False }, 200
        else:
            return {"Exists": False}, 200
    except:
        return {"Valid": False}, 500

@app.route("/MurderMystery2/Trading/Withdraw/GetSession", methods=['POST'])
def getsession():
    userid = request.json['Data']['UserId']
    withdrawals = mm2withdrawals_database.find_one({"robloxUsername": userid})
    if withdrawals:
        withdrawal = {}
        for item in withdrawals['items']:
            if item not in withdrawal:
                withdrawal[item] = 1
            else:
                withdrawal[item] = withdrawal[item] + 1
        return {"Exists": True, "Items": withdrawal}, 200
    else:
        return {"Exists": False, "Items": {}}, 200

@app.route("/MurderMystery2/Trading/Withdraw/ConfirmSession", methods=['POST'])
def confirm():
    userid = request.json['Data']['UserId']
    withdrawals = mm2withdrawals_database.find_one({"robloxUsername": userid})
    if withdrawals:
        try:
            mm2withdrawals_database.delete_many({"robloxUsername": userid})
            return {}, 200
        except:
            return {}, 500
    else:
        return {}, 500

@app.route("/MurderMystery2/Trading/Withdraw/CancelSession", methods=['POST'])
def CancelSession():
    userid = request.json['Data']['UserId']
    withdrawals = mm2withdrawals_database.find_one({"robloxUsername": userid})
    if withdrawals:
        try:
            torefund = []
            mm2withdrawals_database.delete_many({"robloxUsername": userid})
            for item in withdrawals['items']:
                if item in item_values:
                    value = item_values[item]['value']
                    thumbnail = item_values[item]['thumbnail']
                    display_name = item_values[item]['display_name']
                else:
                    value = 0
                    thumbnail = 'https://www.seekpng.com/png/full/149-1490962_10kib-420x420-chill-face.png'
                    display_name = item
                
                torefund.append({"game_name": item, "uid": hashlib.md5(f"{item}{time.time()}{random.random()}".encode()).hexdigest(), "value": value, "thumbnail": thumbnail, "display_name": display_name})
            user_database.update_one({"userid": int(userid)}, {"$push": {"inventory": {"$each": torefund}}})
            return [], 200
        except:
            return [], 500
    else:
        return [], 500

@app.route("/MurderMystery2/Trading/Deposit", methods=['POST'])
def deposit():
    try:
        data = request.json['Data']
        userid = data['UserId']
        items = data['Items'] # [{"name": "Swirly Gun"}, {"name": "Swirly Gun"}]
        hashdeposit = request.json['SecurityKey'] #generate uid for item
    except:
        return {"ResponseMessage": "Invalid body", "ReponseCode": 4}, 500
    
    hashsecurity = hashlib.md5(f"!".encode()).hexdigest()
    if str(hashdeposit) == str(hashsecurity):
        newitems = []
        total = 0
        for item in items:
            for _ in range(data['Items'][item]):
                if item in item_values:
                    value = item_values[item]['value']
                    total = total + item_values[item]['value']
                    thumbnail = item_values[item]['thumbnail']
                    display_name = item_values[item]['display_name']
                else:
                    value = 0
                    thumbnail = 'https://www.seekpng.com/png/full/149-1490962_10kib-420x420-chill-face.png'
                    display_name = item
                
                # newitems.append({"game_name": item, "uid": hashlib.md5(f"{item}{time.time()}{random.random()}".encode()).hexdigest(), "value": value, "status": {"withdrawable": True, "locked": False},"thumbnail": thumbnail, "display_name": display_name})
        try:
            user_database.update_one({"robloxUsername": userid}, {"$inc": {"wallet": total}})
            return {}, 200
        except:
            return {}, 500
    else:
        return {}, 403
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)