from flask import Flask, jsonify, request
import logging
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app) 

@app.route("/url", methods=["GET", "POST"])
def getURL():
    try:
        data = request.get_json('http://127.0.0.1:5000/url')

        url = data

        print(data)

        return jsonify({ 
            "sucess": True, 
            "data": url,
            "threat": True
        })
    except: 
        return jsonify({ 
            "sucess": False, 
            "url": "Not Found"
        })


if __name__ == "__main__" : 
    app.run(debug = True)