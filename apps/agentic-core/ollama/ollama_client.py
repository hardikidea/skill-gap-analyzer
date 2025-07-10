import requests

def ask_ollama(text: str, prompt: str) -> dict:
    full_prompt = prompt + "\n\nResume:\n" + text.strip()
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": full_prompt}
    )
    return response.json()["response"]
