import React from 'react';
import { Radar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend, type ChartOptions,
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface SkillRadarChartProps {
    data: {
        matched: string[];
        missing: string[];
        stats: {
            match_pct: number;
            gap_pct: number;
        };
    };
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
    const allSkills = [...new Set([...data.matched, ...data.missing])];

    const chartData = {
        labels: allSkills,
        datasets: [
            {
                label: 'Matched',
                data: allSkills.map(skill =>
                    data.matched.includes(skill) ? 1 : 0
                ),
                backgroundColor: 'rgba(34,197,94,0.2)',
                borderColor: 'rgba(34,197,94,1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(34,197,94,1)',
            },
            {
                label: 'Missing',
                data: allSkills.map(skill =>
                    data.missing.includes(skill) ? 1 : 0
                ),
                backgroundColor: 'rgba(239,68,68,0.2)',
                borderColor: 'rgba(239,68,68,1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(239,68,68,1)',
            }
        ]
    };

    // const options: ChartOptions<'radar'> = {
    //     responsive: true,
    //     scales: {
    //         r: {
    //             type: 'radialLinear',
    //             beginAtZero: true,
    //             min: 0,
    //             max: 1,
    //             grid: {
    //                 circular: true,
    //             },
    //             ticks: {
    //                 stepSize: 0.2,
    //                 callback: (tickValue: string | number): string => {
    //                     const val = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
    //                     return `${Math.round(val * 100)}%`;
    //                 },
    //             },
    //             pointLabels: {
    //                 font: {
    //                     size: 14,
    //                 },
    //                 color: '#333',
    //             },
    //         },
    //     },
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //     },
    // };

    const options: ChartOptions<'radar'> = {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 0.2,
                    callback: function (tickValue: string | number): string {
                        const num = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
                        return `${Math.round(num * 100)}%`;
                    }

                },
                grid: {
                    circular: true, // ✅ Make it a circular radar grid
                },
                pointLabels: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                },
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-10">
            <h2 className="text-xl font-semibold mb-4 text-center">Skill Radar Chart</h2>
            <Radar data={chartData} options={options} />
            <div className="text-center mt-4">
                <p>✅ Match: { data.stats ? data.stats?.match_pct?.toFixed(1) : 0}%</p>
                <p>❌ Gap: { data.stats ? data.stats.gap_pct?.toFixed(1) : 0 }%</p>
            </div>
        </div>
    );
};

export default SkillRadarChart;
