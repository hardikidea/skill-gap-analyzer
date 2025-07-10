from pydantic import BaseModel
from typing import List, Optional, Literal

class ContactInfo(BaseModel):
    email: str
    phone: Optional[str]
    linkedin: Optional[str]
    location: Optional[str]

class Language(BaseModel):
    name: str
    code: Optional[str]
    proficiency: Optional[str]

class Certification(BaseModel):
    name: str
    authority: Optional[str]
    year: Optional[int]

class Education(BaseModel):
    degree: str
    field: str
    institution: str
    location: Optional[str]
    start_year: Optional[int]
    end_year: Optional[int]

class ProficiencySkill(BaseModel):
    name: str
    proficiency: Literal["Basic", "Intermediate", "Advanced", "Expert"]

class Experience(BaseModel):
    company: str
    title: str
    location: Optional[str]
    start_date: str
    end_date: str
    responsibilities: List[str]
    skills: dict

class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]
    role: Optional[str]

class Event(BaseModel):
    title: str
    event: str
    year: int
    location: Optional[str]
    type: Optional[str]

class Resume(BaseModel):
    full_name: str
    contact: ContactInfo
    summary: Optional[str]
    certifications: List[Certification]
    languages: List[Language]
    education: List[Education]
    hard_skills: List[ProficiencySkill]
    soft_skills: List[str]
    experience: List[Experience]
    projects: Optional[List[Project]]
    publications: Optional[List[str]]
    portfolio: Optional[List[str]]
    events: Optional[List[Event]]
