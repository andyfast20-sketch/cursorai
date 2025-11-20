from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import json

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Enable CORS for all routes

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

@app.route("/")
def index():
    """Serve the frontend index.html"""
    return send_from_directory('../frontend', 'index.html')

@app.route("/<path:filename>")
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory('../frontend', filename)

@app.route("/api/ask", methods=["POST"])
def ask_deepseek():
    """Handle questions and forward them to DeepSeek API"""
    try:
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({"error": "Question is required"}), 400
        
        question = data['question'].strip()
        
        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400
        
        if not DEEPSEEK_API_KEY:
            return jsonify({"error": "DeepSeek API key not configured"}), 500
        
        # Prepare the request to DeepSeek API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        # Make request to DeepSeek API
        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            error_msg = response.text
            return jsonify({
                "error": f"DeepSeek API error: {error_msg}",
                "status_code": response.status_code
            }), response.status_code
        
        result = response.json()
        
        # Extract the answer from DeepSeek response
        if 'choices' in result and len(result['choices']) > 0:
            answer = result['choices'][0]['message']['content']
            return jsonify({
                "answer": answer,
                "success": True
            })
        else:
            return jsonify({"error": "Unexpected response format from DeepSeek"}), 500
            
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request to DeepSeek API timed out"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Network error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "api_key_configured": DEEPSEEK_API_KEY is not None
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
