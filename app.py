from flask import Flask, jsonify, request
import logging
import requests
from flask_cors import CORS
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import os

app = Flask(__name__)

CORS(app) 

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sqli_model", "sqli_model")
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)


@app.route("/url", methods=["GET", "POST"])
def getURL():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
            
        url = data.get('url')
        
        if not url:
            return jsonify({
                "success": False,
                "error": "URL not provided in request"
            }), 400
        
        print(url)

        inputs = tokenizer(url, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predicted_class = torch.argmax(logits, dim=1).item()

        if predicted_class == 1:
            return jsonify({
                "success": True, 
                "data": url, 
                "threat": True
            })
        else:
            return jsonify({ 
                "success": True, 
                "data": url, 
                "threat": False
            })

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({ 
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "_main_" : 
    app.run(debug = True)