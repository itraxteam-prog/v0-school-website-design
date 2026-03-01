import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

export interface AttendanceRow {
    date: string;
    className: string | null | undefined;
    status: string;
    remarks: string | null | undefined;
}

export interface StudentAttendancePdfProps {
    studentName: string;
    studentEmail: string;
    generatedAt: string;
    rows: AttendanceRow[];
    summary: {
        total: number;
        present: number;
        absent: number;
        late: number;
    };
}

const STATUS_COLOR: Record<string, string> = {
    PRESENT: "#065f46",
    ABSENT: "#991b1b",
    LATE: "#92400e",
    EXCUSED: "#1e40af",
};

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e" },
    header: { marginBottom: 20 },
    schoolName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a2e", marginBottom: 4 },
    reportTitle: { fontSize: 13, color: "#4b5563", marginBottom: 2 },
    meta: { fontSize: 9, color: "#6b7280", marginTop: 4 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 12 },
    summaryRow: { flexDirection: "row", marginBottom: 14, gap: 12 },
    summaryBox: {
        flex: 1,
        padding: 8,
        borderRadius: 4,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
    },
    summaryLabel: { fontSize: 8, color: "#6b7280", marginBottom: 2 },
    summaryValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
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
    colDate: { flex: 2.5 },
    colClass: { flex: 2.5 },
    colStatus: { flex: 2 },
    colRemarks: { flex: 3 },
    footer: { marginTop: 20, fontSize: 8, color: "#9ca3af", textAlign: "center" },
});

export function StudentAttendancePdf({
    studentName,
    studentEmail,
    generatedAt,
    rows,
    summary,
}: StudentAttendancePdfProps) {
    const rate = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0;

    return (
        <Document title={`Attendance Report – ${studentName}`} author="Vibe School Management System">
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>Vibe School Management System</Text>
                    <Text style={styles.reportTitle}>Student Attendance Report</Text>
                    <Text style={styles.meta}>
                        Student: {studentName} ({studentEmail})
                    </Text>
                    <Text style={styles.meta}>Generated: {generatedAt}</Text>
                </View>
                <View style={styles.divider} />

                {/* Summary boxes */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>Attendance Rate</Text>
                        <Text style={styles.summaryValue}>{rate}%</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>Total Days</Text>
                        <Text style={styles.summaryValue}>{summary.total}</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>Present</Text>
                        <Text style={[styles.summaryValue, { color: "#065f46" }]}>{summary.present}</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>Absent</Text>
                        <Text style={[styles.summaryValue, { color: "#991b1b" }]}>{summary.absent}</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>Late</Text>
                        <Text style={[styles.summaryValue, { color: "#92400e" }]}>{summary.late}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colHeader, styles.colDate]}>Date</Text>
                        <Text style={[styles.colHeader, styles.colClass]}>Class</Text>
                        <Text style={[styles.colHeader, styles.colStatus]}>Status</Text>
                        <Text style={[styles.colHeader, styles.colRemarks]}>Remarks</Text>
                    </View>

                    {rows.map((row, i) => {
                        const statusKey = row.status.toUpperCase();
                        const statusColor = STATUS_COLOR[statusKey] ?? "#374151";
                        return (
                            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                <Text style={[styles.col, styles.colDate]}>{row.date}</Text>
                                <Text style={[styles.col, styles.colClass]}>{row.className ?? "—"}</Text>
                                <Text style={[styles.col, styles.colStatus, { color: statusColor, fontFamily: "Helvetica-Bold" }]}>
                                    {statusKey}
                                </Text>
                                <Text style={[styles.col, styles.colRemarks]}>{row.remarks ?? "—"}</Text>
                            </View>
                        );
                    })}

                    {rows.length === 0 && (
                        <View style={styles.tableRow}>
                            <Text style={styles.col}>No attendance records found.</Text>
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
