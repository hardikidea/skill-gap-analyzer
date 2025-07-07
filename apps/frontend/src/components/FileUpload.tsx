import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';

interface Props {
    sessionId: string;
    onUploadSuccess: () => void;
}

export default function FileUpload({ sessionId, onUploadSuccess }: Props) {
    const [source, setSource] = useState<'resume' | 'jd'>('resume');
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('source', source);
            formData.append('sessionId', sessionId);
            formData.append('userId', 'sample'); // Replace with actual user ID logic
            formData.append('type', 'resume');



            const res = await fetch('http://localhost:8000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                onUploadSuccess();
            }

            setUploading(false);
        },
        [source, sessionId, onUploadSuccess]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-sm bg-white">

            <div className="mb-2 text-sm font-medium">Upload Type:</div>
            <select
                value={source}
                onChange={e => setSource(e.target.value as any)}
                className="mb-4 w-full border p-2"
            >
                <option value="resume">Resume</option>
                <option value="jd">Job Description</option>
            </select>

            <div
                {...getRootProps()}
                className="p-6 border-2 border-dashed rounded text-center cursor-pointer hover:bg-gray-50"
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p>Uploading...</p>
                ) : (
                    <p>Drag & drop or click to upload PDF/DOCX</p>
                )}
            </div>
        </div>
    );
}
