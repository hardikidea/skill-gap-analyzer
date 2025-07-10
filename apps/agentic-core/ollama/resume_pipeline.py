from langgraph import StateGraph
from langgraph_nodes import *

graph = StateGraph()

graph.add_node("extract_name", extract_name_node)
graph.add_node("extract_contact", extract_contact_node)
graph.add_node("extract_skills", extract_skills_node)
graph.add_node("extract_experience", extract_experience_node)
graph.add_node("extract_projects", extract_projects_node)
graph.add_node("extract_languages", extract_languages_node)
graph.add_node("extract_education", extract_education_node)
graph.add_node("extract_certifications", extract_certifications_node)

graph.set_entry_point("extract_name")
graph.add_edge("extract_name", "extract_contact")
graph.add_edge("extract_contact", "extract_skills")
graph.add_edge("extract_skills", "extract_experience")
graph.add_edge("extract_experience", "extract_projects")
graph.add_edge("extract_projects", "extract_languages")
graph.add_edge("extract_languages", "extract_education")
graph.add_edge("extract_education", "extract_certifications")

pipeline = graph.compile()
