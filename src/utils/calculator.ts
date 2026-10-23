import {
  DepositFormState,
  CalculationResult,
  ScheduleRow,
  TermComparisonItem,
  InterestPaymentMethod
} from '../types/deposit';
import { formatDateVN } from './formatters';

/**
 * Add months to a Date, preserving the day of month or clapping to end of month
 */
export function addMonthsToDate(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const expectedMonth = result.getMonth() + months;
  result.setMonth(expectedMonth);
  // Handle edge cases like Jan 31 -> Feb 28
  if (result.getMonth() !== (expectedMonth % 12 + 12) % 12) {
    result.setDate(0); // Set to last day of previous month
  }
  return result;
}

/**
 * Calculate exact difference in days between two dates
 */
export function getDaysDifference(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endUtc = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.max(0, Math.round((endUtc - startUtc) / msPerDay));
}

/**
 * Primary Deposit Interest Calculator
 * Compliant with State Bank of Vietnam (NHNN Circular 14/2017/TT-NHNN)
 */
export function calculateDeposit(form: DepositFormState): CalculationResult {
  const {
    principal,
    termMonths,
    termDays: customTermDays,
    termType,
    interestRate,
    startDate: startDateStr,
    paymentMethod,
    calculationBasis = 365
  } = form;

  const startDate = new Date(startDateStr);
  let maturityDate: Date;
  let termDays: number;

  if (termType === 'day' && customTermDays && customTermDays > 0) {
    termDays = customTermDays;
    maturityDate = new Date(startDate.getTime());
    maturityDate.setDate(maturityDate.getDate() + termDays);
  } else {
    maturityDate = addMonthsToDate(startDate, termMonths);
    termDays = getDaysDifference(startDate, maturityDate);
  }

  const rateDecimal = interestRate / 100;
  let interestEarned = 0;
  let totalAmount = principal;
  let interestPrepaidAmount = 0;
  let actualDepositAmount = principal;

  // Calculation by method
  switch (paymentMethod) {
    case 'end_of_term': {
      // Standard regular term deposit with interest paid at maturity
      // Formula: (Principal * Rate% * Days) / 365
      interestEarned = (principal * rateDecimal * termDays) / calculationBasis;
      totalAmount = principal + interestEarned;
      break;
    }
    case 'beginning_of_term': {
      // Interest paid upfront
      interestPrepaidAmount = (principal * rateDecimal * termDays) / (calculationBasis + rateDecimal * termDays);
      actualDepositAmount = principal - interestPrepaidAmount;
      interestEarned = interestPrepaidAmount;
      totalAmount = principal; // At maturity, receives full nominal principal
      break;
    }
    case 'monthly': {
      // Periodic monthly interest
      if (termType === 'month' && termMonths > 0) {
        const monthlyRate = rateDecimal / 12;
        interestEarned = principal * monthlyRate * termMonths;
      } else {
        interestEarned = (principal * rateDecimal * termDays) / calculationBasis;
      }
      totalAmount = principal + interestEarned;
      break;
    }
    case 'compound': {
      // Interest compounded periodically into principal (Lãi nhập gốc)
      if (termType === 'month' && termMonths > 0) {
        const monthlyRate = rateDecimal / 12;
        totalAmount = principal * Math.pow(1 + monthlyRate, termMonths);
        interestEarned = totalAmount - principal;
      } else {
        interestEarned = (principal * rateDecimal * termDays) / calculationBasis;
        totalAmount = principal + interestEarned;
      }
      break;
    }
  }

  // Monthly and daily averages
  const durationInMonths = termType === 'month' ? termMonths : Math.max(1, termDays / 30.4167);
  const monthlyAverageInterest = durationInMonths > 0 ? interestEarned / durationInMonths : interestEarned;
  const dailyAverageInterest = termDays > 0 ? interestEarned / termDays : 0;

  // Effective annual yield or return
  const effectiveRate = principal > 0 ? (interestEarned / principal) * 100 : 0;

  return {
    principal,
    termMonths,
    termDays,
    interestRate,
    interestEarned: Math.round(interestEarned),
    totalAmount: Math.round(totalAmount),
    startDate,
    maturityDate,
    monthlyAverageInterest: Math.round(monthlyAverageInterest),
    dailyAverageInterest: Math.round(dailyAverageInterest),
    effectiveRate: Number(effectiveRate.toFixed(2)),
    paymentMethod,
    interestPrepaidAmount: Math.round(interestPrepaidAmount),
    actualDepositAmount: Math.round(actualDepositAmount)
  };
}

/**
 * Generate step-by-step cash flow schedule
 */
export function generateSchedule(form: DepositFormState): ScheduleRow[] {
  const { principal, termMonths, interestRate, startDate: startDateStr, paymentMethod, calculationBasis = 365, termType, termDays: customTermDays } = form;
  const startDate = new Date(startDateStr);
  const rateDecimal = interestRate / 100;
  const rows: ScheduleRow[] = [];

  const totalPeriods = termType === 'day' ? 1 : Math.max(1, termMonths);

  if (termType === 'day' || termMonths <= 1) {
    // Single period
    let endDate: Date;
    let days: number;
    if (termType === 'day' && customTermDays) {
      days = customTermDays;
      endDate = new Date(startDate.getTime());
      endDate.setDate(endDate.getDate() + days);
    } else {
      endDate = addMonthsToDate(startDate, 1);
      days = getDaysDifference(startDate, endDate);
    }

    const interest = Math.round((principal * rateDecimal * days) / calculationBasis);

    rows.push({
      period: 1,
      periodLabel: termType === 'day' ? `${customTermDays} ngày` : 'Tháng 1',
      startDate: formatDateVN(startDate),
      endDate: formatDateVN(endDate),
      days,
      beginningBalance: principal,
      interestEarned: interest,
      cumulativeInterest: interest,
      endingBalance: principal + interest,
      cashFlow: paymentMethod === 'beginning_of_term' ? interest : (principal + interest)
    });
    return rows;
  }

  // Multi-month schedule
  let currentStart = new Date(startDate.getTime());
  let currentBalance = principal;
  let cumulativeInterest = 0;

  for (let i = 1; i <= totalPeriods; i++) {
    const currentEnd = addMonthsToDate(startDate, i);
    const daysInPeriod = getDaysDifference(currentStart, currentEnd);
    let periodInterest = 0;
    let cashFlow = 0;

    if (paymentMethod === 'compound') {
      // Compounded monthly
      periodInterest = Math.round((currentBalance * rateDecimal * daysInPeriod) / calculationBasis);
      cumulativeInterest += periodInterest;
      currentBalance += periodInterest;
      cashFlow = i === totalPeriods ? currentBalance : 0;
    } else if (paymentMethod === 'monthly') {
      periodInterest = Math.round((principal * rateDecimal * daysInPeriod) / calculationBasis);
      cumulativeInterest += periodInterest;
      cashFlow = i === totalPeriods ? (periodInterest + principal) : periodInterest;
    } else if (paymentMethod === 'beginning_of_term') {
      periodInterest = Math.round((principal * rateDecimal * daysInPeriod) / calculationBasis);
      cumulativeInterest += periodInterest;
      cashFlow = i === 1 ? cumulativeInterest : (i === totalPeriods ? principal : 0);
    } else {
      // end_of_term (trả sau)
      periodInterest = Math.round((principal * rateDecimal * daysInPeriod) / calculationBasis);
      cumulativeInterest += periodInterest;
      cashFlow = i === totalPeriods ? (principal + cumulativeInterest) : 0;
    }

    rows.push({
      period: i,
      periodLabel: `Tháng ${i}`,
      startDate: formatDateVN(currentStart),
      endDate: formatDateVN(currentEnd),
      days: daysInPeriod,
      beginningBalance: paymentMethod === 'compound' ? (currentBalance - periodInterest) : principal,
      interestEarned: periodInterest,
      cumulativeInterest,
      endingBalance: paymentMethod === 'compound' ? currentBalance : (principal + cumulativeInterest),
      cashFlow
    });

    currentStart = new Date(currentEnd.getTime());
  }

  return rows;
}

/**
 * Generate comparison across common terms (1T, 2T, 3T, 6T, 9T, 12T, 18T, 24T, 36T)
 */
export function generateTermComparisons(
  principal: number,
  selectedTermMonths: number,
  baseRate: number,
  paymentMethod: InterestPaymentMethod = 'end_of_term'
): TermComparisonItem[] {
  // Approximate standard market yield curve for Vietnamese banks
  const termDefinitions = [
    { months: 1, label: '1 tháng', rateModifier: -1.4 },
    { months: 2, label: '2 tháng', rateModifier: -1.2 },
    { months: 3, label: '3 tháng', rateModifier: -0.9 },
    { months: 6, label: '6 tháng', rateModifier: -0.2 },
    { months: 9, label: '9 tháng', rateModifier: 0.0 },
    { months: 12, label: '12 tháng (1 năm)', rateModifier: 0.4 },
    { months: 18, label: '18 tháng', rateModifier: 0.6 },
    { months: 24, label: '24 tháng (2 năm)', rateModifier: 0.8 },
    { months: 36, label: '36 tháng (3 năm)', rateModifier: 0.9 },
  ];

  const now = new Date();
  const selectedResult = calculateDeposit({
    principal,
    termMonths: selectedTermMonths,
    termType: 'month',
    interestRate: baseRate,
    startDate: now.toISOString().split('T')[0],
    paymentMethod,
    calculationBasis: 365
  });

  return termDefinitions.map(t => {
    // If it's the selected term, use exact baseRate
    let applicableRate = baseRate;
    if (t.months !== selectedTermMonths) {
      // Reasonable simulated curve relative to selected
      applicableRate = Math.max(0.2, Number((baseRate + t.rateModifier).toFixed(2)));
    }

    const res = calculateDeposit({
      principal,
      termMonths: t.months,
      termType: 'month',
      interestRate: applicableRate,
      startDate: now.toISOString().split('T')[0],
      paymentMethod,
      calculationBasis: 365
    });

    return {
      termMonths: t.months,
      termLabel: t.label,
      interestRate: applicableRate,
      interestEarned: res.interestEarned,
      totalAmount: res.totalAmount,
      differenceWithSelected: res.interestEarned - selectedResult.interestEarned
    };
  });
}
