import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

export interface StudentGradeRow {
    subject: string;
    className: string | null | undefined;
    term: string;
    marks: string;
    grade: string;
}

export interface StudentGradesPdfProps {
    studentName: string;
    studentEmail: string;
    generatedAt: string;
    rows: StudentGradeRow[];
}

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e" },
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
    colSubject: { flex: 3 },
    colClass: { flex: 2 },
    colTerm: { flex: 2 },
    colMarks: { flex: 2 },
    colGrade: { flex: 1.5 },
    footer: { marginTop: 20, fontSize: 8, color: "#9ca3af", textAlign: "center" },
    gradeGood: { color: "#065f46", fontFamily: "Helvetica-Bold" },
    gradeAverage: { color: "#92400e", fontFamily: "Helvetica-Bold" },
    gradeFail: { color: "#991b1b", fontFamily: "Helvetica-Bold" },
});

function getGradeStyle(grade: string) {
    if (["A+", "A", "A-", "B+", "B"].includes(grade)) return styles.gradeGood;
    if (grade === "F") return styles.gradeFail;
    return styles.gradeAverage;
}

export function StudentGradesPdf({ studentName, studentEmail, generatedAt, rows }: StudentGradesPdfProps) {
    return (
        <Document title={`Grades Report – ${studentName}`} author="Vibe School Management System">
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>Vibe School Management System</Text>
                    <Text style={styles.reportTitle}>Student Grades Report</Text>
                    <Text style={styles.meta}>
                        Student: {studentName} ({studentEmail})
                    </Text>
                    <Text style={styles.meta}>Generated: {generatedAt}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.colSubject]}>Subject</Text>
                        <Text style={[styles.colHeader, styles.colClass]}>Class</Text>
                        <Text style={[styles.colHeader, styles.colTerm]}>Term</Text>
                        <Text style={[styles.colHeader, styles.colMarks]}>Marks</Text>
                        <Text style={[styles.colHeader, styles.colGrade]}>Grade</Text>
                    </View>

                    {/* Rows */}
                    {rows.map((row, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                            <Text style={[styles.col, styles.colSubject]}>{row.subject}</Text>
                            <Text style={[styles.col, styles.colClass]}>{row.className ?? "—"}</Text>
                            <Text style={[styles.col, styles.colTerm]}>{row.term}</Text>
                            <Text style={[styles.col, styles.colMarks]}>{row.marks}</Text>
                            <Text style={[styles.col, styles.colGrade, getGradeStyle(row.grade)]}>{row.grade}</Text>
                        </View>
                    ))}

                    {rows.length === 0 && (
                        <View style={styles.tableRow}>
                            <Text style={styles.col}>No grade records found.</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.footer}>
                    This is a system-generated report from Vibe School Management System. Confidential.
                </Text>
            </Page>
        </Document>
    );
}
