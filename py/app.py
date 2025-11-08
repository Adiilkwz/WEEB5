from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai 
from google.genai.errors import APIError # <-- Для лучшей обработки ошибок

app = Flask(__name__)
CORS(app) # Инициализируем CORS, чтобы избежать проблем с браузером

# --- Конфигурация ---
API_KEY = "AIzaSyCyT-lrYpU587ogr_xknbwsFEGLUB5Zr6U"  # 🚨 Вставьте сюда свой API-ключ
MODEL = "gemini-2.5-flash"

# Инициализация клиента Gemini
# Клиент автоматически использует API_KEY
try:
    client = genai.Client(api_key=API_KEY)
except Exception as e:
    print(f"❌ Ошибка инициализации клиента Gemini: {e}")
    # Можно выйти или продолжить с ошибкой, если ключ недействителен


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    print(f"📩 Получено сообщение: {user_message}")

    if not user_message:
        return jsonify({"error": "Пустое сообщение"}), 400

    try:
        # ИСПОЛЬЗУЕМ SDK для генерации контента
        response = client.models.generate_content(
            model=MODEL,
            contents=user_message,
        )

        # SDK автоматически извлекает сгенерированный текст (response.text)
        ai_text = response.text 
        
        if ai_text:
            # Возвращаем ответ с ключом 'reply', который ожидает ваш фронтенд
            return jsonify({"reply": ai_text})
        else:
            # Случай, если ответ был заблокирован фильтрами безопасности Google
            return jsonify({"error": "Gemini не вернул текст (возможно, заблокировано фильтрами).", "details": str(response)}), 500

    except APIError as e:
        # Обработка ошибок, специфичных для Gemini API (например, неверный ключ, проблема с квотой)
        print(f"❌ Ошибка API Gemini: {e}")
        return jsonify({"error": "Ошибка API Gemini", "details": str(e)}), 500
        
    except Exception as e:
        # Общие ошибки
        print(f"❌ Непредвиденная ошибка: {e}")
        return jsonify({"error": "Непредвиденная ошибка сервера", "details": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Flask сервер запущен на http://127.0.0.1:5000")
    # Запускаем на 127.0.0.1, чтобы избежать проблем с доступом
    app.run(debug=True, host='127.0.0.1')