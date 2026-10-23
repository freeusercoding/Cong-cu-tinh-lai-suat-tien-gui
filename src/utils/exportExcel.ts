import * as XLSX from 'xlsx';
import { CalculationResult, DepositFormState, ScheduleRow } from '../types/deposit';
import { formatDateVN, formatVND, numberToVietnameseWords } from './formatters';

export function exportDepositToExcel(
  form: DepositFormState,
  result: CalculationResult,
  schedule: ScheduleRow[]
): void {
  const wb = XLSX.utils.book_new();

  // Payment method human label
  const methodLabels: Record<string, string> = {
    end_of_term: 'Trả lãi sau (Cuối kỳ đáo hạn)',
    beginning_of_term: 'Trả lãi trước (Đầu kỳ)',
    monthly: 'Trả lãi định kỳ hàng tháng',
    compound: 'Tái tục lãi nhập gốc (Lãi kép)'
  };

  // Sheet 1: Tổng quan & Chi tiết kết quả
  const overviewData = [
    ['BẢNG TÍNH TOÁN LÃI SUẤT TIỀN GỬI TIẾT KIỆM NGÂN HÀNG'],
    ['Công cụ tính lãi suất sản phẩm tiền gửi thông thường trả lãi sau'],
    ['Ngày xuất báo cáo:', formatDateVN(new Date())],
    [],
    ['1. THÔNG TIN TIỀN GỬI BAN ĐẦU', 'GIÁ TRỊ', 'ĐƠN VỊ TÍNH'],
    ['Số tiền gửi gốc:', result.principal, 'VND'],
    ['Bằng chữ:', numberToVietnameseWords(result.principal), ''],
    ['Kỳ hạn gửi:', form.termType === 'day' ? `${result.termDays} ngày` : `${result.termMonths} tháng`, ''],
    ['Lãi suất áp dụng:', `${result.interestRate}%`, '%/năm'],
    ['Hình thức nhận lãi:', methodLabels[result.paymentMethod] || 'Trả sau', ''],
    ['Ngày bắt đầu gửi:', formatDateVN(result.startDate), ''],
    ['Ngày đáo hạn dự kiến:', formatDateVN(result.maturityDate), ''],
    ['Tổng số ngày gửi thực tế:', result.termDays, 'ngày'],
    ['Cơ sở tính ngày trong năm:', form.calculationBasis, 'ngày/năm'],
    [],
    ['2. KẾT QUẢ TÍNH TOÁN TIỀN LÃI DỰ TÍNH', 'GIÁ TRỊ', 'ĐƠN VỊ TÍNH'],
    ['Tiền lãi dự tính nhận được:', result.interestEarned, 'VND'],
    ['Bằng chữ:', numberToVietnameseWords(result.interestEarned), ''],
    ['Tổng tiền nhận được (Gốc + Lãi):', result.totalAmount, 'VND'],
    ['Bằng chữ:', numberToVietnameseWords(result.totalAmount), ''],
    ['Lãi bình quân mỗi tháng:', result.monthlyAverageInterest, 'VND/tháng'],
    ['Lãi bình quân mỗi ngày:', result.dailyAverageInterest, 'VND/ngày'],
    ['Tỷ suất sinh lời thực tế:', `${result.effectiveRate}%`, '%'],
    [],
    ['* Lưu ý: Công thức tính lãi chuẩn theo Thông tư 14/2017/TT-NHNN của Ngân hàng Nhà nước Việt Nam.'],
    ['  Số tiền lãi = (Số tiền gửi x Lãi suất %/năm x Số ngày gửi thực tế) / 365 ngày']
  ];

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);

  // Column widths for overview
  wsOverview['!cols'] = [
    { wch: 38 },
    { wch: 32 },
    { wch: 20 }
  ];

  XLSX.utils.book_append_sheet(wb, wsOverview, 'Tổng Quan Tiền Gửi');

  // Sheet 2: Bảng lịch trình dòng tiền (Schedule)
  const scheduleHeaders = [
    'Kỳ phân bổ',
    'Từ ngày',
    'Đến ngày',
    'Số ngày',
    'Số dư gốc (VND)',
    'Lãi phát sinh (VND)',
    'Lãi lũy kế (VND)',
    'Số dư cuối kỳ (VND)',
    'Dòng tiền nhận (VND)'
  ];

  const scheduleDataRows = schedule.map(row => [
    row.periodLabel,
    row.startDate,
    row.endDate,
    row.days,
    row.beginningBalance,
    row.interestEarned,
    row.cumulativeInterest,
    row.endingBalance,
    row.cashFlow
  ]);

  const scheduleSheetData = [
    ['LỊCH TRÌNH DÒNG TIỀN VÀ PHÂN BỔ LÃI SUẤT TIỀN GỬI'],
    [`Khoản gửi: ${formatVND(result.principal)} - Lãi suất: ${result.interestRate}%/năm - Kỳ hạn: ${form.termType === 'day' ? `${result.termDays} ngày` : `${result.termMonths} tháng`}`],
    [],
    scheduleHeaders,
    ...scheduleDataRows,
    [],
    [
      'TỔNG CỘNG',
      '',
      '',
      result.termDays,
      '',
      result.interestEarned,
      result.interestEarned,
      result.totalAmount,
      result.totalAmount
    ]
  ];

  const wsSchedule = XLSX.utils.aoa_to_sheet(scheduleSheetData);

  // Column widths for schedule
  wsSchedule['!cols'] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 }
  ];

  XLSX.utils.book_append_sheet(wb, wsSchedule, 'Lịch Trình Dòng Tiền');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Bang_Tinh_Lai_Suat_Tien_Gui_${dateStr}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
