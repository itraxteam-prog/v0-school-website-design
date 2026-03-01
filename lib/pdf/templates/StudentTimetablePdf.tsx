import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

export interface TimetableRow {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subjectName: string;
    className: string | null | undefined;
    room: string | null | undefined;
}

export interface StudentTimetablePdfProps {
    studentName: string;
    studentEmail: string;
    generatedAt: string;
    term: string | null | undefined;
    academicYear: string | null | undefined;
    rows: TimetableRow[];
}

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e" },
    header: { marginBottom: 20 },
    schoolName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4 },
    reportTitle: { fontSize: 13, color: "#4b5563", marginBottom: 2 },
    meta: { fontSize: 9, color: "#6b7280", marginTop: 4 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 12 },
    daySection: { marginBottom: 12 },
    dayTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        backgroundColor: "#4f46e5",
        padding: "4 8",
        borderRadius: 3,
        marginBottom: 4,
    },
    table: { width: "100%" },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#e0e7ff",
        padding: 5,
        borderRadius: 2,
        marginBottom: 2,
    },
    tableRow: {
        flexDirection: "row",
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    tableRowAlt: {
        flexDirection: "row",
        padding: 5,
        backgroundColor: "#f9fafb",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    colHeader: { color: "#3730a3", fontFamily: "Helvetica-Bold", fontSize: 8 },
    col: { fontSize: 9, color: "#374151" },
    colTime: { flex: 2 },
    colSubject: { flex: 3 },
    colClass: { flex: 2.5 },
    colRoom: { flex: 1.5 },
    footer: { marginTop: 20, fontSize: 8, color: "#9ca3af", textAlign: "center" },
});

export function StudentTimetablePdf({
    studentName,
    studentEmail,
    generatedAt,
    term,
    academicYear,
    rows,
}: StudentTimetablePdfProps) {
    // Group rows by day
    const grouped: Record<string, TimetableRow[]> = {};
    for (const row of rows) {
        const day = row.dayOfWeek.toUpperCase();
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(row);
    }
    const days = DAY_ORDER.filter((d) => grouped[d]);

    return (
        <Document title={`Timetable – ${studentName}`} author="Vibe School Management System">
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>Vibe School Management System</Text>
                    <Text style={styles.reportTitle}>Student Timetable</Text>
                    <Text style={styles.meta}>
                        Student: {studentName} ({studentEmail})
                    </Text>
                    {(term || academicYear) && (
                        <Text style={styles.meta}>
                            {term ? `Term: ${term}` : ""}{term && academicYear ? "  |  " : ""}{academicYear ? `Academic Year: ${academicYear}` : ""}
                        </Text>
                    )}
                    <Text style={styles.meta}>Generated: {generatedAt}</Text>
                </View>
                <View style={styles.divider} />

                {days.length === 0 && (
                    <Text style={{ fontSize: 10, color: "#6b7280" }}>No timetable records found.</Text>
                )}

                {days.map((day) => (
                    <View key={day} style={styles.daySection} wrap={false}>
                        <Text style={styles.dayTitle}>{day}</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.colHeader, styles.colTime]}>Time</Text>
                                <Text style={[styles.colHeader, styles.colSubject]}>Subject</Text>
                                <Text style={[styles.colHeader, styles.colClass]}>Class</Text>
                                <Text style={[styles.colHeader, styles.colRoom]}>Room</Text>
                            </View>
                            {grouped[day].map((row, i) => (
                                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                    <Text style={[styles.col, styles.colTime]}>
                                        {row.startTime} – {row.endTime}
                                    </Text>
                                    <Text style={[styles.col, styles.colSubject]}>{row.subjectName}</Text>
                                    <Text style={[styles.col, styles.colClass]}>{row.className ?? "—"}</Text>
                                    <Text style={[styles.col, styles.colRoom]}>{row.room ?? "—"}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={styles.footer}>
                    This is a system-generated report from Vibe School Management System. Confidential.
                </Text>
            </Page>
        </Document>
    );
}
