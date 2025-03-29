import os
from openai import OpenAI
from dotenv import load_dotenv
import openai

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def generate_code_from_prompt(prompt: str) -> str:
    """
    Non-streaming version: returns the full generated code in one piece.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI that generates complete, standalone code. "
                        "Do not include explanations or disclaimers. "
                        "Return code enclosed in triple backticks if possible."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            max_tokens=2048,
            temperature=0.2,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error generating code: {e}")
        return f"Error: {e}"


def generate_code_stream(prompt: str):
    """
    Streaming version: yields partial code tokens from the OpenAI API.
    Yields strings (tokens or partial tokens).
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI that generates complete, standalone code. "
                        "Do not include explanations or disclaimers. "
                        "Return code enclosed in triple backticks if possible."
                        "Use https://picsum.photos/{random_number} for placeholder images."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            max_tokens=2048,
            temperature=0.2,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stream=True,
        )
        for chunk in response:
            delta_obj = chunk.choices[0].delta
            if hasattr(delta_obj, "content") and delta_obj.content:
                yield delta_obj.content
    except Exception as e:
        yield f"Error: {e}"