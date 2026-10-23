export type InterestPaymentMethod = 'end_of_term' | 'monthly' | 'beginning_of_term' | 'compound';

export interface DepositFormState {
  principal: number; // Số tiền gửi (VND)
  termMonths: number; // Kỳ hạn (tháng)
  termDays?: number; // Hoặc kỳ hạn theo ngày (nếu là kỳ hạn tuần / ngày)
  termType: 'month' | 'day';
  interestRate: number; // Lãi suất (%/năm)
  startDate: string; // YYYY-MM-DD
  paymentMethod: InterestPaymentMethod; // Phương thức trả lãi
  calculationBasis: 365 | 360; // Cơ sở tính ngày trong năm theo quy định NHNN
  compoundingFrequency?: 'monthly' | 'quarterly' | 'yearly'; // Nếu tái tục
}

export interface ValidationErrors {
  principal?: string;
  term?: string;
  interestRate?: string;
}

export interface CalculationResult {
  principal: number;
  termMonths: number;
  termDays: number;
  interestRate: number;
  interestEarned: number; // Tiền lãi dự tính
  totalAmount: number; // Tổng tiền (gốc + lãi)
  startDate: Date;
  maturityDate: Date; // Ngày đáo hạn
  monthlyAverageInterest: number; // Lãi bình quân/tháng
  dailyAverageInterest: number; // Lãi bình quân/ngày
  effectiveRate: number; // Tỷ suất sinh lời thực tế trên vốn ban đầu
  paymentMethod: InterestPaymentMethod;
  interestPrepaidAmount?: number; // Tiền lãi nhận trước (nếu chọn trả lãi trước)
  actualDepositAmount?: number; // Số tiền thực gửi nếu nhận lãi trước
}

export interface ScheduleRow {
  period: number;
  periodLabel: string;
  startDate: string;
  endDate: string;
  days: number;
  beginningBalance: number;
  interestEarned: number;
  cumulativeInterest: number;
  endingBalance: number;
  cashFlow: number; // Số tiền khách nhận được trong kỳ
}

export interface TermComparisonItem {
  termMonths: number;
  termLabel: string;
  interestRate: number;
  interestEarned: number;
  totalAmount: number;
  differenceWithSelected: number;
}

export interface BankRateInfo {
  code: string;
  name: string;
  shortName: string;
  logoText: string;
  color: string;
  rates: {
    [key: string]: number; // e.g. "1": 3.0, "3": 3.3, "6": 4.5, "12": 5.2, "24": 5.4
  };
}
