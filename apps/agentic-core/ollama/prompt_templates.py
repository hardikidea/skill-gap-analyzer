extract_name_prompt = """
Extract the full name of the candidate from the resume text. Return just the name, nothing else.
"""

extract_contact_prompt = """
Extract contact information: email, phone, LinkedIn URL, and location (city, country if possible).
Return JSON: { "email": ..., "phone": ..., "linkedin": ..., "location": ... }
"""

extract_skills_prompt = """
From the resume, identify and separate:
1. Hard skills (tech, tools, programming)
2. Soft skills (communication, teamwork)
Return JSON:
{
  "hard_skills": [{ "name": "React.js", "proficiency": "Expert" }, ...],
  "soft_skills": ["Team Leadership", ...]
}
"""

extract_experience_prompt = """
Extract work experience blocks.
For each role, return:
- Company
- Title
- Location
- Dates (start & end)
- Responsibilities
- Hard and soft skills used

Return as a list of objects.
"""

extract_projects_prompt = """
Extract any personal or professional projects.
Return JSON with project name, description, tech stack, and role if mentioned.
"""

extract_languages_prompt = """
List languages the candidate knows and their proficiencies. Use ISO 639-1 codes if detectable.
"""

extract_education_prompt = """
Return education history with degree, field, institution, location, and years.
"""

extract_certifications_prompt = """
List certifications with name, authority, and year if available.
"""
