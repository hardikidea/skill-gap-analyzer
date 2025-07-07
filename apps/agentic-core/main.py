from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agents import extract_skills, extract_experience
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    text = data.get("text", "")

    try:
        skills_response = extract_skills(text)
        experience_response = extract_experience(text)

        # Attempt to parse both JSON responses
        skills = json.loads(skills_response)
        experience = json.loads(experience_response)

        return {
            "hard_skills": skills.get("hard_skills", []),
            "soft_skills": skills.get("soft_skills", []),
            "job_experience": experience
        }

    except Exception as e:
        return {
            "error": str(e),
            "hard_skills": [],
            "soft_skills": [],
            "job_experience": []
        }
