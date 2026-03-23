import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface PdfReportData {
    title: string;
    subtitle: string;
    summary: { label: string, value: string | number }[];
    tableRows: (string | number)[][];
    tableHead: string[];
    fileName: string;
}

/**
 * Generic PDF Generator for Tax Reports
 */
export async function generateTaxPDF(data: PdfReportData) {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(22)
    doc.text(data.title, 20, 20)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28)
    doc.text(data.subtitle, 20, 33)

    // Summary Section
    let currentY = 45;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Key Summary Metrics", 20, currentY);
    currentY += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    data.summary.forEach(item => {
        doc.text(`${item.label}: ${item.value}`, 20, currentY);
        currentY += 6;
    });

    // Main Data Table
    autoTable(doc, {
        startY: currentY + 10,
        head: [data.tableHead],
        body: data.tableRows,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 }
    })

    const finalY = (doc as any).lastAutoTable.finalY || 200;

    // Legal Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Disclaimer: This report is an estimation based on New Income-tax Act 2025. Not for filing.", 20, finalY + 10);

    doc.save(data.fileName)
}
