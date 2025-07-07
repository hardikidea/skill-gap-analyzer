import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import skillRoutes from './routes/skill';
import analyzeRoutes from './routes/analyze';
import gapRoutes from './routes/skillgap';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
app.use(cors({
    origin: ([process.env.FRONTEND_URL, process.env.LANGGRAPH_URL].filter(Boolean) as string[]).length > 0
        ? ([process.env.FRONTEND_URL, process.env.LANGGRAPH_URL].filter(Boolean) as string[])
        : '*',
    credentials: true,
}));
app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
    res.send("OK 👋");
});

app.use('/api', skillRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', gapRoutes);
app.use('/api', uploadRoutes);


app.listen(8000, () => console.log("API running at http://localhost:8000"));

app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('Unexpected Error:', err);
    res.status(500).send('Internal Server Error');
});