export interface ResumeSchema {
    meta: MetaInfo;
    candidate: CandidateInfo;
    skills: SkillSet;
    experience: Experience[];
    projects?: Project[];
    publications?: Publication[];
    portfolio?: PortfolioLink[];
    events?: Event[];
}

interface MetaInfo {
    schema_type: string;
    schema_version: string;
    generated_on: string;
    created_at: string;
    updated_at: string;
    parser: { name: string; version: string };
    original_filename: string;
    language: {
        primary: string;
        detected: string[];
    };
    identifiers: {
        resume_id: string;
        candidate_id: string;
    };
    domain_expertise: string[];
    career_stage: string;
    tech_stack_used: string[];
    availability: string;
    remote_ready: boolean;
    visa_status: string;
}

interface CandidateInfo {
    name: { full: string; first: string; last: string };
    contact: {
        email: string;
        phone: string;
        linkedin: string;
        location: {
            city: string;
            region: string;
            country: string;
        };
    };
    summary: string;
    certifications: Certification[];
    languages: Language[];
    education: Education[];
}

interface SkillSet {
    hard_skills: ProficiencySkill[];
    soft_skills: string[];
}

interface ProficiencySkill {
    name: string;
    proficiency: "Basic" | "Intermediate" | "Advanced" | "Expert";
}

interface Certification {
    name: string;
    authority: string;
    year?: number;
}

interface Language {
    name: string;
    code: string;
    proficiency: string;
}

interface Education {
    degree: string;
    field: string;
    institution: string;
    location: string;
    start_year: number;
    end_year: number;
}

interface Experience {
    company: string;
    title: string;
    location: string;
    start_date: string;
    end_date: string;
    responsibilities: string[];
    skills: {
        hard_skills: string[];
        soft_skills: string[];
    };
}

interface Project {
    name: string;
    description: string;
    technologies: string[];
    role?: string;
}

interface Publication {
    title: string;
    url: string;
    publisher: string;
    year: number;
}

interface PortfolioLink {
    label: string;
    url: string;
}

interface Event {
    title: string;
    event: string;
    year: number;
    location: string;
    type: string;
}
