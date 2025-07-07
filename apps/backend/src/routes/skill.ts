import { Router } from 'express';
import { db } from '../../models';
const { Skill } = db;

const router = Router();


router.post('/skills', async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/skills', async (_, res) => {
    const skills = await Skill.findAll();
    res.status(200).json(skills);
});

export default router;
