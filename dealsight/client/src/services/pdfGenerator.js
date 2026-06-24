import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateDealReport = (dealData, calculations) => {
  const doc = new jsPDF();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('DealSight Investment Report', 20, 25);

  doc.setDrawColor(245, 158, 11);
  doc.line(20, 30, 60, 30);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(dealData.title, 20, 55);
  doc.setFontSize(10);
  doc.text(dealData.address || '', 20, 62);

  doc.autoTable({
    startY: 75,
    head: [['Metric', 'Value']],
    body: [
      ['Purchase Price', `GBP ${calculations.purchasePrice}`],
      ['Estimated Refurb', `GBP ${calculations.refurbCost}`],
      ['Stamp Duty', `GBP ${calculations.sdlt}`],
      ['Projected ARV', `GBP ${calculations.arv}`],
      ['Net Monthly Cashflow', `GBP ${calculations.cashflow}`],
      ['Return on Investment (ROI)', `${calculations.roi}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [245, 158, 11] },
  });

  doc.save(`DealSight_Report_${dealData.id}.pdf`);
};
