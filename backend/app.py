import os
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get absolute path to the frontend folder
FRONTEND_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend"
)

# Create Flask app
app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path="")
CORS(app)

# DeepSeek API
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"


# --------------------------------------
# Serve FRONTEND (index.html)
# --------------------------------------
@app.route("/")
def index():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


# --------------------------------------
# Serve STATIC FILES (CSS, JS, images)
# --------------------------------------
@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)


# --------------------------------------
# API ENDPOINT: /api/ask
# --------------------------------------
@app.route("/api/ask", methods=["POST"])
def ask_deepseek():
    try:
        data = request.get_json()
        question = data.get("question", "")

        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "deepseek-ai/chat",
            "messages": [{"role": "user", "content": question}]
        }

        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        result = response.json()

        answer = result["choices"][0]["message"]["content"]

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)})


# --------------------------------------
# Run locally (ignored on Vercel)
# --------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
