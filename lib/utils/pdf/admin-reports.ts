import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { drawHeader, drawFooter, PDF_COLORS, getBaseTableOptions } from './pdf-generator';

interface ExportAdminOptions {
    type: string;
    schoolName: string;
    logoUrl: string;
    userEmail: string;
    data: any;
    filters: any;
}

export async function exportAdminReportToPdf({
    type,
    schoolName,
    logoUrl,
    userEmail,
    data,
    filters
}: ExportAdminOptions) {
    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";
    
    let reportTitle = "Institutional Report";
    switch (type) {
        case "student-performance": reportTitle = "Student Performance Report"; break;
        case "attendance-report": reportTitle = "Attendance Trend Report"; break;
        case "class-summary": reportTitle = "Class Summary Report"; break;
        case "teacher-performance": reportTitle = "Teacher Performance Report"; break;
    }

    // Header Metadata
    const metadata = [`Generated: ${generatedAt}`];
    if (filters.term) metadata.push(`Term: ${filters.term}`);
    if (filters.classId && filters.classId !== 'all') metadata.push(`Class ID: ${filters.classId}`);

    await drawHeader(doc, schoolName, reportTitle, logoUrl, metadata);

    const baseOptions = getBaseTableOptions(doc, schoolName, userEmail);

    if (type === "student-performance") {
        autoTable(doc, {
            ...baseOptions,
            startY: 65,
            head: [['Roll No', 'Name', 'Attendance', 'Avg Grade', 'Remarks']],
            body: data.studentPerformance.map((s: any) => [s.rollNo, s.name, s.attendance, s.grade, s.remarks]),
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 45 },
                2: { cellWidth: 30 },
                3: { cellWidth: 25 },
                4: { cellWidth: 'auto' },
            }
        });
    } else if (type === "teacher-performance") {
        autoTable(doc, {
            ...baseOptions,
            startY: 65,
            head: [['Teacher Name', 'Classes', 'Avg Class Grade', 'Attendance Rate']],
            body: data.teacherPerformance.map((t: any) => [t.name, t.classes, t.grade, t.attendance]),
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 30 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40, halign: 'right' },
            }
        });
    } else if (type === "attendance-report") {
        // Summary Stats first
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("School Overview", 15, 65);
        
        // Simple boxes for stats (simulating the design)
        const stats = [
            { label: "Overall Attendance", value: data.summary?.overallAttendance || "N/A" },
            { label: "Total Students", value: data.summary?.totalStudents || "N/A" },
            { label: "Absentee Rate", value: data.summary?.absenteeRate || "N/A" }
        ];
        
        stats.forEach((s, i) => {
            const x = 15 + (i * 60);
            doc.setDrawColor(251, 207, 232); // #FBCFE8
            doc.setFillColor(253, 242, 244); // #FDF2F4
            doc.roundedRect(x, 70, 55, 20, 2, 2, 'FD');
            
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.setFont('helvetica', 'normal');
            doc.text(s.label, x + 27.5, 77, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setTextColor(128, 0, 32);
            doc.setFont('helvetica', 'bold');
            doc.text(String(s.value), x + 27.5, 85, { align: 'center' });
        });

        doc.setTextColor(26, 26, 46);
        doc.setFontSize(11);
        doc.text("Monthly Attendance Rate", 15, 105);

        autoTable(doc, {
            ...baseOptions,
            startY: 110,
            head: [['Month', 'Attendance Rate (%)']],
            body: data.attendanceChart.map((row: any) => [row.day || row.month, `${row.attendance}%`]),
        });
    }

    drawFooter(doc, schoolName, userEmail);
    doc.save(`${type}_report_${Date.now()}.pdf`);
}
