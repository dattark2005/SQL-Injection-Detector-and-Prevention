from flask import Flask, jsonify, request
import logging
import requests
from flask_cors import CORS
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
app = Flask(__name__)

CORS(app) 

model = AutoModelForSequenceClassification.from_pretrained("sqli_model")
tokenizer = AutoTokenizer.from_pretrained("sqli_model")


# sample_input = "SELECT * FROM users WHERE username = 'admin' --"
# inputs = tokenizer(sample_input, return_tensors="pt", truncation=True, padding=True)
# with torch.no_grad():
#     outputs = model(**inputs)
#     logits = outputs.logits
#     predicted_class = torch.argmax(logits, dim=1).item()

# if predicted_class == 1:
#     print("Detected: SQL Injection")
# else:
#     print("Clean Query")


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