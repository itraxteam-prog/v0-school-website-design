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

// Mock Data for Teacher Dashboard
const classPerformanceData = [
    { class: 'Grade 10-A', avgScore: 88, attendance: 94 },
    { class: 'Grade 10-B', avgScore: 85, attendance: 91 },
    { class: 'Grade 9-A', avgScore: 90, attendance: 96 },
]

export function ClassPerformanceChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="class"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
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
                        barSize={40}
                        name="Avg Score"
                    />
                    <Bar
                        dataKey="attendance"
                        fill="#A0522D"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        name="Attendance %"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
