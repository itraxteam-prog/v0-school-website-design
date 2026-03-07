"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function ClassPerformanceChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/teacher/performance");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to fetch performance data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />;
    }

    if (data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground italic text-sm">
                No class data available.
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="class"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.6 }}
                        dy={5}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.6 }}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            backgroundColor: 'hsl(var(--card))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Bar
                        dataKey="avgScore"
                        fill="#800020"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                        name="Avg Score"
                    />
                    <Bar
                        dataKey="attendance"
                        fill="#A0522D"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                        name="Attendance %"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
