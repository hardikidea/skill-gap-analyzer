# agents.py
import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOllama
from langchain.prompts import ChatPromptTemplate

load_dotenv()

MODEL = os.getenv("MODEL", "mistral")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

llm = ChatOllama(
    model=MODEL,
    base_url=OLLAMA_URL,
    temperature=0
)

skill_prompt = ChatPromptTemplate.from_template("""
You are an expert in analyzing resumes. From the following text, extract:
1. A list of hard skills
2. A list of soft skills

Return in JSON format:
{{
  "hard_skills": [...],
  "soft_skills": [...]
}}

Text:
{text}
""")

# Prompt to extract structured job experience
experience_prompt = ChatPromptTemplate.from_template("""
You are a resume parser. Extract all job experiences from the text.
For each job, return the following fields:

- jobTitle (string)
- company (string)
- startDate (ISO format: "YYYY-MM-DD", or null if unknown or invalid)
- endDate (ISO format: "YYYY-MM-DD", or null if currently working or invalid)
- isCurrent (boolean)
- skills (list of strings)

If a date is missing or not clear, set the field to `null`.

Return the result in JSON format:
[
  {{
    "jobTitle": "...",
    "company": "...",
    "startDate": "...",
    "endDate": "...",
    "isCurrent": true,
    "skills": [...]
  }},
  ...
]

Text:
{text}
""")

# Extract skills
def extract_skills(text: str) -> str:
    chain = skill_prompt | llm
    return chain.invoke({"text": text}).content

# Extract job experience
def extract_experience(text: str) -> str:
    chain = experience_prompt | llm
    return chain.invoke({"text": text}).content
