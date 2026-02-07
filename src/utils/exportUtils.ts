// Export utilities for generating PDF, CSV, and Excel reports

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface EmissionData {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

export interface ExportOptions {
  totalEmissions: number;
  emissionData: EmissionData[];
  companyName?: string;
  reportDate?: string;
}

export class ExportManager {
  // Export to PDF - Enhanced Professional Report
  static async exportToPDF(options: ExportOptions): Promise<void> {
    const { totalEmissions, emissionData, companyName = 'Organization', reportDate = new Date().toISOString().split('T')[0] } = options;

    const doc = new jsPDF();
    let currentY = 20;
    
    // Professional Header with Logo Area
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('RANTAI 3C', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Professional Carbon Footprint Analysis Report', 105, 30, { align: 'center' });
    
    currentY = 50;
    
    // Company Information Box
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(15, currentY, 180, 25, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Organization: ${companyName}`, 20, currentY + 8);
    doc.text(`Report Date: ${reportDate}`, 20, currentY + 15);
    doc.text(`Generated: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`, 20, currentY + 22);
    
    currentY += 35;
    
    // Executive Summary Section
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text('Executive Summary', 20, currentY);
    
    currentY += 10;
    
    // Key Metrics in Boxes
    const boxWidth = 85;
    const boxHeight = 25;
    const gap = 10;
    
    // Total Emissions Box
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(15, currentY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Carbon Emissions', 20, currentY + 8);
    doc.setFontSize(18);
    doc.setTextColor(220, 38, 38);
    doc.text(`${totalEmissions.toFixed(2)} kg CO₂`, 20, currentY + 18);
    
    // Categories Box
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(15 + boxWidth + gap, currentY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Emission Categories', 15 + boxWidth + gap + 5, currentY + 8);
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text(`${emissionData.length}`, 15 + boxWidth + gap + 5, currentY + 18);
    
    currentY += boxHeight + 10;
    
    // Average per Category Box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(15, currentY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Average per Category', 20, currentY + 8);
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text(`${(totalEmissions / emissionData.length).toFixed(2)} kg`, 20, currentY + 18);
    
    // Highest Emitter Box
    const topEmitter = emissionData.reduce((max, item) => item.value > max.value ? item : max, emissionData[0]);
    doc.setFillColor(254, 249, 195);
    doc.roundedRect(15 + boxWidth + gap, currentY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Highest Contributor', 15 + boxWidth + gap + 5, currentY + 8);
    doc.setFontSize(12);
    doc.setTextColor(217, 119, 6);
    const emitterText = `${topEmitter.category} (${topEmitter.percentage}%)`;
    doc.text(emitterText, 15 + boxWidth + gap + 5, currentY + 18);
    
    currentY += boxHeight + 15;
    
    // Key Insights Section
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text('Key Insights', 20, currentY);
    
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    const lowEmitters = emissionData.filter(item => item.percentage < 10).length;
    const highEmitters = emissionData.filter(item => item.percentage > 30).length;
    
    const insights = [
      `• ${topEmitter.category} contributes ${topEmitter.percentage}% of total emissions, making it the primary focus area`,
      `• ${highEmitters} ${highEmitters === 1 ? 'category requires' : 'categories require'} immediate attention (>30% contribution)`,
      `• ${lowEmitters} ${lowEmitters === 1 ? 'category shows' : 'categories show'} good efficiency (<10% contribution)`,
      `• Average carbon intensity: ${(totalEmissions / emissionData.length).toFixed(2)} kg CO₂ per category`,
    ];
    
    insights.forEach((insight: string) => {
      const lines = doc.splitTextToSize(insight, 170);
      doc.text(lines, 20, currentY);
      currentY += lines.length * 5;
    });
    
    currentY += 10;
    
    // Recommendations Section
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text('Recommended Actions', 20, currentY);
    
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    const recommendations = [
      `1. Prioritize ${topEmitter.category} for immediate carbon reduction initiatives`,
      '2. Implement energy-efficient technologies and renewable energy sources',
      '3. Conduct regular carbon audits to track progress and identify trends',
      '4. Consider carbon offset programs to achieve net-zero targets',
      '5. Engage stakeholders in sustainability goals and reporting',
    ];
    
    recommendations.forEach((rec: string) => {
      const lines = doc.splitTextToSize(rec, 170);
      doc.text(lines, 20, currentY);
      currentY += lines.length * 5;
    });
    
    // Add new page for detailed breakdown
    doc.addPage();
    currentY = 20;
    
    // Detailed Emissions Breakdown
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text('Detailed Emissions Breakdown', 20, currentY);
    
    currentY += 10;
    
    const tableData = emissionData
      .sort((a, b) => b.value - a.value)
      .map((item, index) => [
        (index + 1).toString(),
        item.category,
        `${item.value.toFixed(2)}`,
        `${item.percentage}%`,
        item.percentage > 30 ? 'High Priority' : item.percentage > 15 ? 'Medium' : 'Low Impact',
      ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Rank', 'Category', 'Emissions (kg CO₂)', 'Share (%)', 'Priority']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 40, halign: 'center' },
      },
    });
    
    // Footer on all pages
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by RANTAI 3C Carbon Footprint Management System', 105, 285, { align: 'center' });
      doc.text('https://rantai.elpeef.com | info@rantai.elpeef.com', 105, 290, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
    }
    
    // Save
    doc.save(`RANTAI-3C-Professional-Report-${reportDate}.pdf`);
  }

  // Export to CSV
  static exportToCSV(options: ExportOptions): void {
    const { totalEmissions, emissionData, reportDate = new Date().toISOString().split('T')[0] } = options;
    
    let csvContent = 'RANTAI 3C Carbon Footprint Analysis Report\n';
    csvContent += `Report Date,${reportDate}\n`;
    csvContent += `Generated,${new Date().toLocaleString()}\n`;
    csvContent += `\n`;
    csvContent += `Total Emissions (kg CO₂),${totalEmissions.toFixed(2)}\n`;
    csvContent += `Number of Categories,${emissionData.length}\n`;
    csvContent += `Average per Category (kg CO₂),${(totalEmissions / emissionData.length).toFixed(2)}\n`;
    csvContent += `\n`;
    csvContent += `Rank,Category,Emissions (kg CO₂),Percentage (%)\n`;
    
    emissionData
      .sort((a, b) => b.value - a.value)
      .forEach((item, index) => {
        csvContent += `${index + 1},${item.category},${item.value.toFixed(2)},${item.percentage}\n`;
      });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RANTAI-3C-Report-${reportDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export to Excel
  static exportToExcel(options: ExportOptions): void {
    const { totalEmissions, emissionData, companyName = 'Organization', reportDate = new Date().toISOString().split('T')[0] } = options;
    
    // Summary sheet
    const summaryData = [
      ['RANTAI 3C Carbon Footprint Analysis Report'],
      [],
      ['Company', companyName],
      ['Report Date', reportDate],
      ['Generated', new Date().toLocaleString()],
      [],
      ['Total Emissions (kg CO₂)', totalEmissions.toFixed(2)],
      ['Number of Categories', emissionData.length],
      ['Average per Category (kg CO₂)', (totalEmissions / emissionData.length).toFixed(2)],
    ];
    
    // Emissions data sheet
    const emissionsData = [
      ['Rank', 'Category', 'Emissions (kg CO₂)', 'Percentage (%)'],
      ...emissionData
        .sort((a, b) => b.value - a.value)
        .map((item, index) => [
          index + 1,
          item.category,
          parseFloat(item.value.toFixed(2)),
          item.percentage,
        ]),
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    const wsEmissions = XLSX.utils.aoa_to_sheet(emissionsData);
    XLSX.utils.book_append_sheet(wb, wsEmissions, 'Emissions Breakdown');
    
    // Save
    XLSX.writeFile(wb, `RANTAI-3C-Report-${reportDate}.xlsx`);
  }

  // Export all formats
  static async exportAll(options: ExportOptions): Promise<void> {
    await this.exportToPDF(options);
    this.exportToCSV(options);
    this.exportToExcel(options);
  }
}
