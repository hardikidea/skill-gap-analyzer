import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { db } from '../../models/index';
import { v4 as uuidv4 } from 'uuid';
const { Resume, Skill, JobExperience, JobExperienceSkill } = db;

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
    try {
        let { userId, type } = req.body; // type: 'resume' | 'jd'
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return
        }

        // 1. Extract text from file
        let text = '';
        if (file.mimetype === 'application/pdf') {
            const data = await pdfParse(file.buffer);
            text = data.text;
        } else if (
            file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const data = await mammoth.extractRawText({ buffer: file.buffer });
            text = data.value;
        } else {
            res.status(400).json({ error: 'Unsupported file type' });
            return
        }

        // 2. Call agentic-core /analyze
        const response = await axios.post(`${process.env.LANGGRAPH_URL}/analyze`, { text });
        const { hard_skills = [], soft_skills = [], job_experience = [] } = response.data;
        console.log('----------------------------------------');
        console.log('Extracted skills:', hard_skills, soft_skills);
        console.log('----------------------------------------');
        console.log('Extracted job experience:', job_experience);
        console.log('----------------------------------------');


        userId = uuidv4(); // TODO: Replace with actual user ID logic
        // 3. Create Resume entry
        const resume = await Resume.create({
            userId,
            fileName: file.originalname,
            type,
            extractedText: text
        });

        // 4. Insert Skills
        const allSkills = [
            ...hard_skills.map((name: string) => ({ name, type: 'hard' })),
            ...soft_skills.map((name: string) => ({ name, type: 'soft' }))
        ];

        const skillRecords = await Promise.all(
            allSkills.map(({ name, type }) =>
                Skill.create({
                    name,
                    type,
                    source: type,
                    mapped_ESCO: name,
                    resumeId: resume.id,
                    userId
                })
            )
        );

        // 5. Insert JobExperience + JobExperienceSkill
        for (const job of job_experience) {
            const jobRecord = await JobExperience.create({
                resumeId: resume.id,
                jobTitle: job.jobTitle,
                company: job.company,
                startDate: (!job.startDate || isNaN(Date.parse(job.startDate))) ? undefined : job.startDate,
                endDate: (!job.endDate || isNaN(Date.parse(job.endDate))) ? undefined : job.endDate,
                isCurrent: job.isCurrent,
                skills: job.skills?.join(', ') || ''
            });

            const matchedSkillIds = skillRecords
                .filter((s) => job.skills?.includes(s.name))
                .map((s) => s.id);

            await Promise.all(
                matchedSkillIds.map((skillId) =>
                    JobExperienceSkill.create({
                        jobExperienceId: jobRecord.id,
                        skillId
                    })
                )
            );
        }

        res.json({
            resumeId: resume.id,
            skillCount: skillRecords.length,
            experienceCount: job_experience.length
        });
    } catch (err: any) {
        console.error('Upload failed:', err.message);
        res.status(500).json({ error: 'Upload and analysis failed' });
    }
});

export default router;
