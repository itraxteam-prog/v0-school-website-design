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
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const attendanceData = [
    { month: 'Sep', attendance: 95 },
    { month: 'Oct', attendance: 92 },
    { month: 'Nov', attendance: 97 },
    { month: 'Dec', attendance: 88 },
    { month: 'Jan', attendance: 94 },
    { month: 'Feb', attendance: 96 },
]

const performanceData = [
    { month: 'Term 1', score: 82 },
    { month: 'Quiz 1', score: 88 },
    { month: 'Midterm', score: 85 },
    { month: 'Quiz 2', score: 92 },
    { month: 'Term 2', score: 90 },
]

const colors = ['#800020', '#A52A2A', '#4D0013', '#66001a']

export function AttendanceChart() {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
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
                        dataKey="attendance"
                        fill="url(#burgundyGradient)"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    <defs>
                        <linearGradient id="burgundyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#800020" />
                            <stop offset="100%" stopColor="#4D0013" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export function PerformanceChart() {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#800020" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#800020" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
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
