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
    Cell,
} from "recharts"

interface ChartProps {
    data: any[];
}

export function TeacherAttendanceTrendChart({ data }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    domain={[0, 100]}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                    }}
                />
                <Bar
                    dataKey="rate"
                    fill="#800020"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    name="Attendance %"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.rate < 90 ? '#A0522D' : '#800020'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function TeacherPerformanceOverviewChart({ data }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#800020"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#800020' }}
                    activeDot={{ r: 6 }}
                    name="Class Average"
                />
                <Line
                    type="monotone"
                    dataKey="top"
                    stroke="#A0522D"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#A0522D' }}
                    name="Top Score"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
