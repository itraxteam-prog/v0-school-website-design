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
    PieChart,
    Pie,
    Cell,
    Legend,
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
                        domain={[60, 100]}
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

export function SubjectComparisonChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="subject"
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
                        hide
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

// Attendance Distribution Chart (Pie + Bar hybrid)
interface AttendanceStats {
    present: number
    absent: number
    late: number
}

export function AttendanceDistributionChart({ data }: { data: AttendanceStats }) {
    const chartData = [
        { name: 'Present', value: data.present, color: '#16a34a' },
        { name: 'Late', value: data.late, color: '#d97706' },
        { name: 'Absent', value: data.absent, color: '#dc2626' },
    ]

    const barData = [
        { status: 'Present', count: data.present },
        { status: 'Late', count: data.late },
        { status: 'Absent', count: data.absent },
    ]

    const COLORS = ['#16a34a', '#d97706', '#dc2626']

    const total = data.present + data.absent + data.late
    const presentPercentage = total > 0 ? ((data.present / total) * 100).toFixed(1) : '0'

    return (
        <div className="flex flex-col gap-6">
            {/* Pie Chart */}
            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Attendance Rate</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{presentPercentage}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full bg-green-600 transition-all dark:bg-green-400"
                        style={{ width: `${presentPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
