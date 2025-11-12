from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai 
from google.genai.errors import APIError 

app = Flask(__name__)
CORS(app) 

API_KEY = "AIzaSyCyT-lrYpU587ogr_xknbwsFEGLUB5Zr6U" 
MODEL = "gemini-2.5-flash"


try:
    client = genai.Client(api_key=API_KEY)
except Exception as e:
    print(f"❌ Gemini client initialization error: {e}")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    print(f"📩 Message received: {user_message}")

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=user_message,
        )

        ai_text = response.text 
        
        if ai_text:
            return jsonify({"reply": ai_text})
        else:
            return jsonify({"error": "Gemini did not return text (possibly blocked by filters).", "details": str(response)}), 500

    except APIError as e:
        print(f"❌ Gemini API error: {e}")
        return jsonify({"error": "Gemini API error", "details": str(e)}), 500
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return jsonify({"error": "Unexpected server error", "details": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Flask server running at http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1')