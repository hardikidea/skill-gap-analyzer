from langgraph.graph import StateGraph
from langgraph.graph.runner import GraphRunner
from ollama_client import ask_ollama
from prompt_templates import *

def extract_name_node(state):
    return {"full_name": ask_ollama(state["text"], extract_name_prompt)}

def extract_contact_node(state):
    return {"contact": ask_ollama(state["text"], extract_contact_prompt)}

def extract_skills_node(state):
    return ask_ollama(state["text"], extract_skills_prompt)

def extract_experience_node(state):
    return {"experience": ask_ollama(state["text"], extract_experience_prompt)}

def extract_projects_node(state):
    return {"projects": ask_ollama(state["text"], extract_projects_prompt)}

def extract_languages_node(state):
    return {"languages": ask_ollama(state["text"], extract_languages_prompt)}

def extract_education_node(state):
    return {"education": ask_ollama(state["text"], extract_education_prompt)}

def extract_certifications_node(state):
    return {"certifications": ask_ollama(state["text"], extract_certifications_prompt)}
