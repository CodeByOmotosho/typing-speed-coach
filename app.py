from flask import Flask, render_template, request, jsonify
import cohere
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("COHERE_API_KEY")

app = Flask(__name__)
co = cohere.Client(api_key)

def generate_typing_text(difficulty):
    """Generates a complete sentence for the given difficulty level."""
    
    if difficulty == "easy":
        prompt = "Generate a simple, grammatically correct sentence with 10-15 words."
    elif difficulty == "medium":
        prompt = "Generate a complete and grammatically correct sentence of medium difficulty with 25-30 words."
    elif difficulty == "hard":
        prompt = "Generate a complex, grammatically correct sentence with advanced vocabulary and 30-35 words."
    else:
        prompt = "Generate a medium-level typing challenge, exactly 20 words long."
    
    response = co.generate(model="command", prompt=prompt, max_tokens=100, temperature=0.7)

    # Ensure exactly 20 words
    words = response.generations[0].text.strip().split()
    return " ".join(words[:40])  # ✅ Trim excess words


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_text', methods=['POST'])
def generate_text():
    data = request.get_json()
    difficulty = data.get("difficulty", "medium")  # Default to "medium"
    typing_text = generate_typing_text(difficulty)  # Generate text
    return jsonify({"text": typing_text})

@app.route("/analyze_typing", methods=["POST"])
def analyze_typing():
    data = request.get_json()
    user_input = data["user_input"].strip().lower()
    original_text = data["original_text"].strip().lower()
    time_taken = float(data.get("time_taken", 1))


    correct_chars = sum(1 for c1, c2 in zip(user_input, original_text) if c1 == c2)
    total_chars = len(original_text)
    accuracy = (correct_chars / total_chars) * 100 if total_chars > 0 else 0

    words = len(user_input.split())
    speed = words / (time_taken / 60) if time_taken > 0 else 0  
    feedback = "Good job! Keep practicing." if accuracy > 80 else "Try to focus more on accuracy."
    
    return jsonify({"accuracy": round(accuracy, 2), "speed": round(speed, 2), "feedback": feedback})


if __name__ == '__main__':
    app.run(debug=True)
