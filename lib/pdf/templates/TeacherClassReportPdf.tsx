import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

export interface ClassReportGradeRow {
    studentName: string;
    marks: number;
    grade: string;
    term: string;
}

export interface ClassReportAttendanceRow {
    studentName: string;
    date: string;
    status: string;
}

export interface TeacherClassReportPdfProps {
    teacherName: string;
    schoolName: string;
    userEmail: string;
    className: string;
    subject: string;
    generatedAt: string;
    reportType: "grades" | "attendance";
    grades?: ClassReportGradeRow[];
    attendance?: ClassReportAttendanceRow[];
}

const STATUS_COLOR: Record<string, string> = {
    PRESENT: "#065f46",
    ABSENT: "#991b1b",
    LATE: "#92400e",
    EXCUSED: "#1e40af",
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingHorizontal: 40,
        paddingBottom: 60,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1a1a2e"
    },
    header: { marginBottom: 20 },
    schoolName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4 },
    reportTitle: { fontSize: 13, color: "#4b5563", marginBottom: 2 },
    meta: { fontSize: 9, color: "#6b7280", marginTop: 4 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 12 },
    table: { width: "100%" },
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
    colStudent: { flex: 3 },
    colTerm: { flex: 2 },
    colMarks: { flex: 2 },
    colGrade: { flex: 1.5 },
    colDate: { flex: 2.5 },
    colStatus: { flex: 2 },
    footer: { marginTop: 20, fontSize: 8, color: "#9ca3af", textAlign: "center" },
    watermark: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        fontSize: 8,
        color: "#9ca3af",
        textAlign: "center",
    }
});

export function TeacherClassReportPdf({
    teacherName,
    schoolName,
    userEmail,
    className,
    subject,
    generatedAt,
    reportType,
    grades,
    attendance,
}: TeacherClassReportPdfProps) {
    const timestamp = new Date().toISOString();
    return (
        <Document
            title={`${reportType === "grades" ? "Grades" : "Attendance"} Report – ${className}`}
            author={schoolName}
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>{schoolName}</Text>
                    <Text style={styles.reportTitle}>
                        {reportType === "grades" ? "Class Grades Report" : "Class Attendance Report"}
                    </Text>
                    <Text style={styles.meta}>Teacher: {teacherName}</Text>
                    <Text style={styles.meta}>Class: {className}  |  Subject: {subject}</Text>
                    <Text style={styles.meta}>Generated: {generatedAt}</Text>
                </View>
                <View style={styles.divider} />

                {reportType === "grades" && (
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.colHeader, styles.colStudent]}>Student</Text>
                            <Text style={[styles.colHeader, styles.colTerm]}>Term</Text>
                            <Text style={[styles.colHeader, styles.colMarks]}>Marks</Text>
                            <Text style={[styles.colHeader, styles.colGrade]}>Grade</Text>
                        </View>
                        {(grades ?? []).map((row, i) => (
                            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                <Text style={[styles.col, styles.colStudent]}>{row.studentName}</Text>
                                <Text style={[styles.col, styles.colTerm]}>{row.term}</Text>
                                <Text style={[styles.col, styles.colMarks]}>{row.marks}/100</Text>
                                <Text style={[styles.col, styles.colGrade, { fontFamily: "Helvetica-Bold" }]}>{row.grade}</Text>
                            </View>
                        ))}
                        {(grades ?? []).length === 0 && (
                            <View style={styles.tableRow}>
                                <Text style={styles.col}>No grade records found.</Text>
                            </View>
                        )}
                    </View>
                )}

                {reportType === "attendance" && (
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.colHeader, styles.colStudent]}>Student</Text>
                            <Text style={[styles.colHeader, styles.colDate]}>Date</Text>
                            <Text style={[styles.colHeader, styles.colStatus]}>Status</Text>
                        </View>
                        {(attendance ?? []).map((row, i) => {
                            const statusKey = row.status.toUpperCase();
                            const statusColor = STATUS_COLOR[statusKey] ?? "#374151";
                            return (
                                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                    <Text style={[styles.col, styles.colStudent]}>{row.studentName}</Text>
                                    <Text style={[styles.col, styles.colDate]}>{row.date}</Text>
                                    <Text style={[styles.col, styles.colStatus, { color: statusColor, fontFamily: "Helvetica-Bold" }]}>
                                        {statusKey}
                                    </Text>
                                </View>
                            );
                        })}
                        {(attendance ?? []).length === 0 && (
                            <View style={styles.tableRow}>
                                <Text style={styles.col}>No attendance records found.</Text>
                            </View>
                        )}
                    </View>
                )}

                <Text style={styles.footer}>
                    This is a system-generated report from {schoolName}. Confidential.
                </Text>

                <Text
                    style={styles.watermark}
                    fixed
                >
                    Generated by {schoolName} • Exported by {userEmail} • {timestamp}
                </Text>
            </Page>
        </Document>
    );
}

