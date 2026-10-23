import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, DepositFormState, ScheduleRow } from '../types/deposit';
import { formatDateVN, formatVND, numberToVietnameseWords } from './formatters';

export function exportDepositToPdf(
  form: DepositFormState,
  result: CalculationResult,
  schedule: ScheduleRow[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BANG TINH TOAN LAI SUAT TIEN GUI TIET KIEM', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Cong cu tinh lai suat tien gui san pham tien gui thong thuong tra lai sau', pageWidth / 2, 17, { align: 'center' });

  // Metadata block
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.text(`Ngay xuat bao cao: ${formatDateVN(new Date())}`, 14, 32);

  // Section 1: Thong tin khoan gui
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(14, 36, pageWidth - 28, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('1. THONG TIN KHOAN TIEN GUI', 18, 41);

  const termText = form.termType === 'day' ? `${result.termDays} ngay` : `${result.termMonths} thang`;

  autoTable(doc, {
    startY: 45,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 70 },
      2: { fontStyle: 'bold', cellWidth: 35 },
      3: { cellWidth: 25 }
    },
    body: [
      ['Tong tien gui ban dau:', `${formatVND(result.principal)}`, 'Lai suat ap dung:', `${result.interestRate}%/nam`],
      ['Ky han gui:', termText, 'Hinh thuc tra lai:', form.paymentMethod === 'end_of_term' ? 'Tra lai sau (Cuoi ky)' : form.paymentMethod],
      ['Ngay bat dau gui:', formatDateVN(result.startDate), 'Ngay dao han:', formatDateVN(result.maturityDate)],
      ['So ngay gui thuc te:', `${result.termDays} ngay`, 'Co so tinh ngay:', `${form.calculationBasis} ngay/nam`]
    ]
  });

  // Section 2: Ket qua tien lai
  // @ts-expect-error jspdf-autotable plugin extension
  const afterInfoY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 80;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, afterInfoY, pageWidth - 28, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('2. KET QUA DU TINH TIEN LAI & TONG GIA TRI', 18, afterInfoY + 5);

  autoTable(doc, {
    startY: afterInfoY + 9,
    margin: { left: 14, right: 14 },
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    body: [
      ['Tien lai du tinh nhan duoc', `${formatVND(result.interestEarned)}`],
      ['Tong tien nhan duoc (Goc + Lai)', `${formatVND(result.totalAmount)}`],
      ['Lai binh quan moi thang', `${formatVND(result.monthlyAverageInterest)}`],
      ['Lai binh quan moi ngay', `${formatVND(result.dailyAverageInterest)}`],
      ['Ty suat sinh loi thuc te', `${result.effectiveRate}%`]
    ]
  });

  // Section 3: Lich trinh dong tien
  // @ts-expect-error jspdf-autotable plugin extension
  const afterResultY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 140;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, afterResultY, pageWidth - 28, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('3. LICH TRINH PHAN BO DONG TIEN', 18, afterResultY + 5);

  const scheduleRows = schedule.slice(0, 12).map(r => [
    r.periodLabel,
    r.startDate,
    r.endDate,
    `${r.days} ngay`,
    formatVND(r.beginningBalance),
    formatVND(r.interestEarned),
    formatVND(r.cumulativeInterest),
    formatVND(r.endingBalance)
  ]);

  autoTable(doc, {
    startY: afterResultY + 9,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
    styles: { fontSize: 7.5, cellPadding: 2 },
    head: [['Ky', 'Tu ngay', 'Den ngay', 'So ngay', 'Du goc', 'Lai ky', 'Lai luy ke', 'Du cuoi']],
    body: scheduleRows
  });

  // Footer notes
  // @ts-expect-error jspdf-autotable plugin extension
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 240) + 8;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('* Cong thuc tinh lai ap dung theo Thong tu 14/2017/TT-NHNN cua Ngan hang Nha nuoc Viet Nam.', 14, Math.min(finalY, 280));
  doc.text('* So lieu mang tinh chat tham khao du tinh. So tien thuc te can cu vao bieu lai suat tai thoi diem gui von.', 14, Math.min(finalY + 5, 285));

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Bao_Cao_Lai_Suat_Tien_Gui_${dateStr}.pdf`);
}
