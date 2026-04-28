import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { drawHeader, drawFooter, PDF_COLORS } from './pdf-generator';

interface GradeRow {
    subject: string;
    className: string | null | undefined;
    term: string;
    marks: string;
    grade: string;
}

interface ExportGradesOptions {
    studentName: string;
    studentEmail: string;
    schoolName: string;
    userEmail: string;
    logoUrl: string;
    rows: GradeRow[];
}

export async function exportGradesToPdf({
    studentName,
    studentEmail,
    schoolName,
    userEmail,
    logoUrl,
    rows
}: ExportGradesOptions) {
    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

    // Draw Header
    await drawHeader(
        doc,
        schoolName,
        "Student Grades Report",
        logoUrl,
        [
            `Student: ${studentName} (${studentEmail})`,
            `Generated: ${generatedAt}`
        ]
    );

    // Prepare Table Data
    const tableData = rows.map(row => [
        row.subject,
        row.className || '—',
        row.term,
        row.marks,
        row.grade
    ]);

    // Draw Table
    autoTable(doc, {
        startY: 65,
        head: [['Subject', 'Class', 'Assessment Period', 'Marks', 'Grade']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: PDF_COLORS.PRIMARY,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [55, 65, 81], // #374151
        },
        alternateRowStyles: {
            fillColor: PDF_COLORS.STRIPE
        },
        columnStyles: {
            0: { cellWidth: 50 }, // Subject
            1: { cellWidth: 35 }, // Class
            2: { cellWidth: 45 }, // Term
            3: { cellWidth: 30 }, // Marks
            4: { cellWidth: 20 }, // Grade
        },
        margin: { left: 15, right: 15 },
        didParseCell: (data) => {
            // Apply conditional colors for grades (Optional but nice for fidelity)
            if (data.section === 'body' && data.column.index === 4) {
                const grade = data.cell.raw as string;
                if (['A+', 'A', 'A-', 'B+', 'B'].includes(grade)) {
                    data.cell.styles.textColor = [6, 95, 70]; // #065f46 (Green)
                    data.cell.styles.fontStyle = 'bold';
                } else if (grade === 'F') {
                    data.cell.styles.textColor = [153, 27, 27]; // #991b1b (Red)
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    // Draw Footer
    drawFooter(doc, schoolName, userEmail);

    // Save PDF
    const filename = `grades_${studentName.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    doc.save(filename);
}
