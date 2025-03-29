from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from code_generator import generate_code_from_prompt
from code_generator import generate_code_stream 
import json

app = Flask(__name__)
CORS(app)

@app.route("/generate-code", methods=["POST"])
def generate_code():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    generated_code = generate_code_from_prompt(prompt)
    return jsonify({"generated_code": generated_code})


@app.route("/generate-code-stream", methods=["POST"])
def generate_code_stream_route():
    """Endpoint that streams back partial code as SSE (Server-Sent Events)."""
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    def stream():
        # Each chunk from generate_code_stream() is a partial string (token)
        for token in generate_code_stream(prompt):
            # SSE: "data: <content>\n\n"
            yield f"data: {json.dumps(token)}\n\n"

    return Response(stream(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)