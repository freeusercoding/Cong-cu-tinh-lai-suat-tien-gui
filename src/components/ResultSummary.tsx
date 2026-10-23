import React, { useState } from 'react';
import { CalculationResult, DepositFormState } from '../types/deposit';
import {
  formatVND,
  formatPercent,
  formatDateVN,
  numberToVietnameseWords
} from '../utils/formatters';
import {
  TrendingUp,
  Wallet,
  CalendarCheck,
  Calculator,
  Copy,
  Check,
  ArrowRight,
  Info
} from 'lucide-react';

interface ResultSummaryProps {
  result: CalculationResult;
  formState: DepositFormState;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  formState
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `KẾT QUẢ TÍNH LÃI SUẤT TIẾT KIỆM:
- Tiền gửi gốc: ${formatVND(result.principal)}
- Kỳ hạn: ${formState.termType === 'day' ? `${result.termDays} ngày` : `${result.termMonths} tháng`}
- Lãi suất: ${result.interestRate}%/năm
- Tiền lãi dự tính: ${formatVND(result.interestEarned)}
- Tổng tiền nhận được: ${formatVND(result.totalAmount)}
- Ngày gửi: ${formatDateVN(result.startDate)}
- Ngày đáo hạn: ${formatDateVN(result.maturityDate)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCalculation = result.principal > 0 && result.interestRate > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col justify-between">
      <div>
        {/* Header matching PDF */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tiền lãi dự tính
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ước tính lợi nhuận thực nhận khi đến ngày đáo hạn
            </p>
          </div>

          {hasCalculation && (
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Sao chép tóm tắt kết quả"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Primary Result 1: Số tiền lãi */}
        <div className="mb-5 p-5 rounded-xl bg-slate-50 border border-slate-200/60 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Số tiền lãi
            </span>
            <span className="text-emerald-600 font-mono font-medium lowercase">
              +{formatPercent(result.effectiveRate)}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums tracking-tight">
            {formatVND(result.interestEarned, false)}
            <span className="text-lg font-bold text-slate-600 ml-2">VND</span>
          </div>

          {result.interestEarned > 0 && (
            <div className="text-xs text-slate-600 mt-2 italic line-clamp-2">
              Bằng chữ: <span className="text-slate-800 font-medium">{numberToVietnameseWords(result.interestEarned)}</span>
            </div>
          )}
        </div>

        {/* Primary Result 2: Tổng tiền */}
        <div className="mb-6 p-5 rounded-xl bg-slate-900 text-white shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Tổng tiền (Gốc + Lãi)
            </span>
            <span className="text-slate-400 text-[11px] font-normal">
              Đáo hạn
            </span>
          </div>

          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
            {formatVND(result.totalAmount, false)}
            <span className="text-lg font-bold text-slate-400 ml-2">VND</span>
          </div>

          {result.totalAmount > 0 && (
            <div className="text-xs text-slate-300 mt-2 italic line-clamp-2">
              Bằng chữ: <span className="text-white font-medium">{numberToVietnameseWords(result.totalAmount)}</span>
            </div>
          )}
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="text-xs font-medium text-slate-500 mb-1">
              Lãi bình quân/tháng
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-800 tabular-nums">
              {formatVND(result.monthlyAverageInterest)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="text-xs font-medium text-slate-500 mb-1">
              Lãi bình quân/ngày
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-800 tabular-nums">
              {formatVND(result.dailyAverageInterest)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="text-xs font-medium text-slate-500 mb-1">
              Ngày bắt đầu gửi
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-800 tabular-nums">
              {formatDateVN(result.startDate)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ngày đáo hạn</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-emerald-700 tabular-nums">
              {formatDateVN(result.maturityDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Applied Formula Callout */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1.5">
          <Calculator className="w-4 h-4 text-slate-600" />
          <span>Công thức tính áp dụng (Thông tư 14/2017/TT-NHNN):</span>
        </div>
        <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 text-[11px] overflow-x-auto whitespace-nowrap">
          Tiền lãi = (Số tiền gửi × Lãi suất %/năm × Số ngày gửi) / {formState.calculationBasis}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
          <span>{formatVND(result.principal)}</span>
          <span>×</span>
          <span>{result.interestRate}%</span>
          <span>×</span>
          <span>{result.termDays} ngày</span>
          <span>÷</span>
          <span>{formState.calculationBasis}</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
          <span className="font-bold text-slate-800 font-mono">{formatVND(result.interestEarned)}</span>
        </div>
      </div>
    </div>
  );
};
