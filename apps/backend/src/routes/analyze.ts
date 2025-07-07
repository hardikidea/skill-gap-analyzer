
import { Router } from 'express';
import axios from 'axios';
const router = Router();
import { db } from '../../models';
const { Skill } = db;

router.post('/analyze', async (req, res) => {
    try {
        const { text, source } = req.body;

        // 🔁 Call Python LangGraph API
        const response = await axios.post(`${process.env.LANGGRAPH_URL}/analyze`, { text });

        const skills = response.data.skills;

        // 💾 Store skills in DB
        const created = await Promise.all(
            skills.map((name: string) =>
                Skill.create({ name, type: 'hard', source, mapped_ESCO: name })
            )
        );

        res.json({ stored: created });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: 'LangGraph or DB error' });
    }
});

export default router;
