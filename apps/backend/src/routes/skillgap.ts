import { Router } from 'express';
const router = Router();
import { db } from '../../models';
const { Skill } = db;

router.get('/gap/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    const resumeSkills = await Skill.findAll({ where: { source: 'resume' } });
    const jdSkills = await Skill.findAll({ where: { source: 'jd' } });

    const resumeSet = new Set(resumeSkills.map((s: any) => s.mapped_ESCO.toLowerCase()));
    const jdSet = new Set(jdSkills.map((s: any) => s.mapped_ESCO.toLowerCase()));

    const matched: string[] = [];
    const missing: string[] = [];

    for (const skill of jdSet) {
        if (resumeSet.has(skill)) {
            matched.push(skill as string);
        } else {
            missing.push(skill as string);
        }
    }

    res.json({
        matched,
        missing,
        stats: {
            total_jd: jdSet.size,
            total_resume: resumeSet.size,
            match_pct: (matched.length / jdSet.size) * 100,
            gap_pct: (missing.length / jdSet.size) * 100
        }
    });
});

export default router;
