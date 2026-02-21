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

interface ChartProps {
    data: any[];
    config: any;
}

export function AttendanceTrendChart({ data, config }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={config.gridStroke} />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                    domain={[80, 100]}
                />
                <Tooltip contentStyle={config.tooltipStyle} />
                <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke={config.primaryColor}
                    strokeWidth={3}
                    dot={{ r: 4, fill: config.primaryColor, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function GradeDistributionChart({ data, config }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={config.gridStroke} />
                <XAxis
                    dataKey="grade"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                    dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: config.tickColor }} />
                <Tooltip
                    cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                    contentStyle={config.tooltipStyle}
                />
                <Bar
                    dataKey="count"
                    fill={config.primaryColor}
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function EnrollmentStatsChart({ data, config }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={config.primaryGradient} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.primaryColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={config.primaryColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={config.gridStroke} />
                <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                    dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: config.tickColor }} />
                <Tooltip contentStyle={config.tooltipStyle} />
                <Area
                    type="monotone"
                    dataKey="students"
                    stroke={config.primaryColor}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#${config.primaryGradient})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function SubjectPerformanceChart({ data, config }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={config.gridStroke} />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                />
                <YAxis
                    dataKey="subject"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: config.tickColor }}
                    width={80}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(128, 0, 32, 0.05)' }}
                    contentStyle={config.tooltipStyle}
                />
                <Bar
                    dataKey="avg"
                    fill={config.primaryColor}
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
