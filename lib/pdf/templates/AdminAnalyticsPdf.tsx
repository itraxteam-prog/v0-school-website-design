import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

export interface AttendanceMonthRow { month: string; attendance: number }
export interface GradeDistRow { grade: string; count: number }
export interface EnrollmentRow { year: string; students: number }
export interface SubjectPerfRow { subject: string; avg: number }

export interface AdminAnalyticsPdfProps {
    generatedAt: string;
    stats: {
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        attendanceToday: string;
    };
    attendanceData: AttendanceMonthRow[];
    gradeDistribution: GradeDistRow[];
    enrollmentData: EnrollmentRow[];
    subjectPerformance: SubjectPerfRow[];
}

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e" },
    header: { marginBottom: 20 },
    schoolName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4 },
    reportTitle: { fontSize: 13, color: "#4b5563", marginBottom: 2 },
    meta: { fontSize: 9, color: "#6b7280", marginTop: 4 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 12 },
    statsRow: { flexDirection: "row", marginBottom: 18, gap: 10 },
    statBox: {
        flex: 1,
        padding: 10,
        borderRadius: 4,
        backgroundColor: "#f0fdf4",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1fae5",
    },
    statLabel: { fontSize: 8, color: "#6b7280", marginBottom: 3 },
    statValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#065f46" },
    sectionTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a2e",
        marginBottom: 6,
        marginTop: 10,
    },
    table: { width: "100%", marginBottom: 14 },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#1a1a2e",
        padding: 6,
        borderRadius: 4,
        marginBottom: 2,
    },
    tableRow: {
        flexDirection: "row",
        padding: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    tableRowAlt: {
        flexDirection: "row",
        padding: 6,
        backgroundColor: "#f9fafb",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    colHeader: { color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: 9 },
    col: { fontSize: 9, color: "#374151" },
    col2: { flex: 1 },
    footer: { marginTop: 20, fontSize: 8, color: "#9ca3af", textAlign: "center" },
});

export function AdminAnalyticsPdf({
    generatedAt,
    stats,
    attendanceData,
    gradeDistribution,
    enrollmentData,
    subjectPerformance,
}: AdminAnalyticsPdfProps) {
    return (
        <Document title="Admin Analytics Report" author="Vibe School Management System">
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>Vibe School Management System</Text>
                    <Text style={styles.reportTitle}>Admin Analytics Report</Text>
                    <Text style={styles.meta}>Generated: {generatedAt}</Text>
                </View>
                <View style={styles.divider} />

                {/* Overview Stats */}
                <Text style={styles.sectionTitle}>School Overview</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Students</Text>
                        <Text style={styles.statValue}>{stats.totalStudents}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Teachers</Text>
                        <Text style={styles.statValue}>{stats.totalTeachers}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Classes</Text>
                        <Text style={styles.statValue}>{stats.totalClasses}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Attendance Today</Text>
                        <Text style={styles.statValue}>{stats.attendanceToday}</Text>
                    </View>
                </View>

                {/* Attendance Trend */}
                <Text style={styles.sectionTitle}>Monthly Attendance Rate</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.col2]}>Month</Text>
                        <Text style={[styles.colHeader, styles.col2]}>Attendance Rate (%)</Text>
                    </View>
                    {attendanceData.map((row, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={[styles.col, styles.col2]}>{row.month}</Text>
                            <Text style={[styles.col, styles.col2]}>{row.attendance}%</Text>
                        </View>
                    ))}
                    {attendanceData.length === 0 && (
                        <View style={styles.tableRow}><Text style={styles.col}>No data.</Text></View>
                    )}
                </View>

                {/* Grade Distribution */}
                <Text style={styles.sectionTitle}>Grade Distribution</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.col2]}>Grade</Text>
                        <Text style={[styles.colHeader, styles.col2]}>Count</Text>
                    </View>
                    {gradeDistribution.map((row, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={[styles.col, styles.col2]}>{row.grade}</Text>
                            <Text style={[styles.col, styles.col2]}>{row.count}</Text>
                        </View>
                    ))}
                    {gradeDistribution.length === 0 && (
                        <View style={styles.tableRow}><Text style={styles.col}>No data.</Text></View>
                    )}
                </View>

                {/* Enrollment */}
                <Text style={styles.sectionTitle}>Student Enrollment by Year</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.col2]}>Year</Text>
                        <Text style={[styles.colHeader, styles.col2]}>Students Enrolled</Text>
                    </View>
                    {enrollmentData.map((row, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={[styles.col, styles.col2]}>{row.year}</Text>
                            <Text style={[styles.col, styles.col2]}>{row.students}</Text>
                        </View>
                    ))}
                    {enrollmentData.length === 0 && (
                        <View style={styles.tableRow}><Text style={styles.col}>No data.</Text></View>
                    )}
                </View>

                {/* Subject Performance */}
                <Text style={styles.sectionTitle}>Average Marks by Subject</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.col2]}>Subject</Text>
                        <Text style={[styles.colHeader, styles.col2]}>Average Marks</Text>
                    </View>
                    {subjectPerformance.map((row, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={[styles.col, styles.col2]}>{row.subject}</Text>
                            <Text style={[styles.col, styles.col2]}>{row.avg}/100</Text>
                        </View>
                    ))}
                    {subjectPerformance.length === 0 && (
                        <View style={styles.tableRow}><Text style={styles.col}>No data.</Text></View>
                    )}
                </View>

                <Text style={styles.footer}>
                    This is a system-generated report from Vibe School Management System. Confidential.
                </Text>
            </Page>
        </Document>
    );
}
