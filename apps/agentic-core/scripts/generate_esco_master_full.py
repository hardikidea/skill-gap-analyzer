import os
import json
import re
from collections import defaultdict

INPUT_DIR = os.path.join(os.path.dirname(__file__), '../esco/v1/json')
OUTPUT_DIR = os.path.join(os.path.join(os.path.dirname(__file__), '../esco/v1'), 'esco_master_full.json')

def generate_esco_master_json(json_dir, output_file="esco_master_full.json"):
    def load_json_file(match):
        for root, _, files in os.walk(json_dir):
            for file in files:
                if match in file and file.endswith(".json") and not file.startswith("._"):
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        return json.load(f)
        return []

    def normalize(val):
        if not val:
            return []
        return [s.strip() for s in re.split(r'[\n|]', val) if s.strip()]

    def normalize_scheme(val):
        if not val:
            return []
        if isinstance(val, str):
            return [v.strip() for v in val.split(",")]
        return [v.strip() for v in val]

    def classify_skill(skill):
        label = skill.get("preferredLabel", "").lower()
        alt = " ".join(normalize(skill.get("altLabels", ""))).lower()
        uri = skill.get("conceptUri", "")
        if "language" in label or "language" in alt:
            return "Language Skill"
        elif uri in green_skill_uris:
            return "Green Skill"
        elif any(w in label for w in ["communicat", "team", "empathy", "collaborat"]):
            return "Soft Skill"
        elif any(w in label for w in ["programming", "technical", "mathematics"]):
            return "Hard Skill"
        return "Other"

    # Load all files
    skills = load_json_file("skills_en.json")
    occupations = load_json_file("occupations_en.json")
    relations = load_json_file("occupationSkillRelations_en.json")
    green_skills = load_json_file("greenSkillsCollection_en.json")
    concept_schemes = load_json_file("conceptSchemes_en.json")
    digital_skills = load_json_file("digitalSkillsCollection_en.json")
    digcomp_skills = load_json_file("digCompSkillsCollection_en.json")
    research_skills = load_json_file("researchSkillsCollection_en.json")
    transversal_skills = load_json_file("transversalSkillsCollection_en.json")
    language_skills = load_json_file("languageSkillsCollection_en.json")
    research_occupations = load_json_file("researchOccupationsCollection_en.json")
    skill_groups = load_json_file("skillGroups_en.json")
    skill_hierarchy = load_json_file("skillsHierarchy_en.json")
    skill_skill_relations = load_json_file("skillSkillRelations_en.json")
    occupation_hierarchy = load_json_file("broaderRelationsOccPillar_en.json")
    skill_hierarchy_pillar = load_json_file("broaderRelationsSkillPillar_en.json")
    isco_groups = load_json_file("ISCOGroups_en.json")

    # Lookup tables
    green_skill_uris = {s.get("conceptUri") for s in green_skills}
    digital_skill_uris = {s.get("conceptUri") for s in digital_skills + digcomp_skills}
    research_skill_uris = {s.get("conceptUri") for s in research_skills}
    transversal_skill_uris = {s.get("conceptUri") for s in transversal_skills}
    language_skill_uris = {s.get("conceptUri") for s in language_skills}
    research_occupation_uris = {o.get("conceptUri") for o in research_occupations}
    occupation_lookup = {o["conceptUri"]: o for o in occupations if "conceptUri" in o}
    scheme_label_lookup = {c["conceptUri"]: c.get("preferredLabel", "") for c in concept_schemes if "conceptUri" in c}

    skill_to_occupations = defaultdict(list)
    for rel in relations:
        occ_uri = rel.get("occupationUri")
        if occ_uri not in occupation_lookup:
            continue
        full_occ = occupation_lookup[occ_uri]
        occupation_entry = {
            "occupationUri": occ_uri,
            "relationType": rel.get("relationType"),
            "relationSkillType": rel.get("skillType"),
            **full_occ
        }
        skill_to_occupations[rel["skillUri"]].append(occupation_entry)

    broader_skills = defaultdict(list)
    narrower_skills = defaultdict(list)
    for link in skill_hierarchy:
        broader_skills[link.get("narrowerSkillUri")].append(link.get("broaderSkillUri"))
        narrower_skills[link.get("broaderSkillUri")].append(link.get("narrowerSkillUri"))

    related_skills = defaultdict(list)
    for rel in skill_skill_relations:
        source = rel.get("sourceConceptUri")
        target = rel.get("targetConceptUri")
        if source and target:
            related_skills[source].append(target)

    skill_group_map = defaultdict(list)
    for sg in skill_groups:
        for skill_uri in sg.get("hasTopConcept", []):
            skill_group_map[skill_uri].append({
                "groupId": sg.get("conceptUri"),
                "groupLabel": sg.get("preferredLabel")
            })

    # Build final structure
    final_data = []
    for skill in skills:
        uri = skill.get("conceptUri")
        in_scheme = normalize_scheme(skill.get("inScheme", []))
        scheme_labels = [scheme_label_lookup.get(u) for u in in_scheme if u in scheme_label_lookup]

        enriched = {
            **skill,
            "altLabels": normalize(skill.get("altLabels", "")),
            "hiddenLabels": normalize(skill.get("hiddenLabels", "")),
            "inScheme": in_scheme,
            "isGreenSkill": uri in green_skill_uris,
            "isDigitalSkill": uri in digital_skill_uris,
            "isResearchSkill": uri in research_skill_uris,
            "isTransversalSkill": uri in transversal_skill_uris,
            "isLanguageSkill": uri in language_skill_uris,
            "category": classify_skill(skill),
            "inConceptSchemes": list(filter(None, scheme_labels)),
            "relatedSkills": related_skills.get(uri, []),
            "hierarchy": {
                "broaderSkills": broader_skills.get(uri, []),
                "narrowerSkills": narrower_skills.get(uri, [])
            },
            "skillGroups": skill_group_map.get(uri, [])
        }

        occupations_for_skill = skill_to_occupations.get(uri, [])
        for occ in occupations_for_skill:
            occ["altLabels"] = normalize(occ.get("altLabels", ""))
            occ["hiddenLabels"] = normalize(occ.get("hiddenLabels", ""))
            occ["inScheme"] = normalize_scheme(occ.get("inScheme", []))
            occ["isResearchOccupation"] = occ.get("conceptUri") in research_occupation_uris

        final_data.append({
            "Skill": enriched,
            "Occupations": occupations_for_skill
        })

    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"✅ ESCO master JSON created: {output_file}")


from generate_esco_master_full import generate_esco_master_json
generate_esco_master_json(INPUT_DIR, OUTPUT_DIR)
