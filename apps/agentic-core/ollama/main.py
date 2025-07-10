from resume_pipeline import pipeline

with open("sample_resume.txt", "r") as file:
    resume_text = file.read()

state = { "text": resume_text }

result = pipeline.invoke(state)
print(result)
