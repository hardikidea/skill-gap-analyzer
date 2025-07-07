import FileUpload from './components/FileUpload';
import SkillRadarChart from './components/SkillRadarChart';
import { useEffect, useState } from 'react';

function App() {
    const sessionId = 'abc123';
    const [gapData, setGapData] = useState<any>(null);

    const fetchData = async () => {
        const res = await fetch(`http://localhost:8000/api/gap/${sessionId}`);
        const data = await res.json();
        setGapData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">📊 Skill Gap Analyzer</h1>

            <FileUpload sessionId={sessionId} onUploadSuccess={fetchData} />

            {gapData && (
                <div className="mt-8">
                    <SkillRadarChart data={gapData} />
                </div>
            )}
        </div>
    );
}

export default App;
