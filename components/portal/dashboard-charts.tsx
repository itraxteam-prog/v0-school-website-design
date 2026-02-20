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
    Area,
    AreaChart,
} from 'recharts'

// Mock Data
const performanceData = [
    { month: 'Sep', score: 85 },
    { month: 'Oct', score: 88 },
    { month: 'Nov', score: 82 },
    { month: 'Dec', score: 90 },
    { month: 'Jan', score: 94 },
    { month: 'Feb', score: 92 },
]

const subjectData = [
    { subject: 'Math', score: 92 },
    { subject: 'Phys', score: 87 },
    { subject: 'Eng', score: 90 },
    { subject: 'Chem', score: 84 },
    { subject: 'Comp', score: 96 },
    { subject: 'Urdu', score: 88 },
]

export function PerformanceTrendChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#800020" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#800020" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                        domain={[60, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            backgroundColor: 'hsl(var(--card))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#800020"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function SubjectComparisonChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis
                        dataKey="subject"
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
                        hide
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
                        dataKey="score"
                        fill="#800020"
                        radius={[4, 4, 4, 4]}
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
