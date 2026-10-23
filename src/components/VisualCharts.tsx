import React, { useState } from 'react';
import { CalculationResult, DepositFormState, TermComparisonItem } from '../types/deposit';
import { formatVND, formatVNDShort, formatPercent } from '../utils/formatters';
import { PieChart, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

interface VisualChartsProps {
  result: CalculationResult;
  formState: DepositFormState;
  termComparisons: TermComparisonItem[];
  onSelectTerm: (months: number, rate: number) => void;
}

export const VisualCharts: React.FC<VisualChartsProps> = ({
  result,
  formState,
  termComparisons,
  onSelectTerm
}) => {
  const [activeTab, setActiveTab] = useState<'donut' | 'bars' | 'timeline'>('donut');
  const [hoveredTerm, setHoveredTerm] = useState<number | null>(null);

  const principal = result.principal || 0;
  const interest = result.interestEarned || 0;
  const total = principal + interest;

  const principalPercent = total > 0 ? (principal / total) * 100 : 100;
  const interestPercent = total > 0 ? (interest / total) * 100 : 0;

  // Donut SVG circumference math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const interestStrokeDash = (interestPercent / 100) * circumference;
  const principalStrokeDash = circumference - interestStrokeDash;

  // Find max interest in comparisons for bar chart scaling
  const maxBarInterest = Math.max(...termComparisons.map(t => t.interestEarned), 1);

  return (
    <div id="visual-charts" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Section Header with Segmented Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Biểu đồ trực quan</span>
            <span className="text-xs font-normal text-slate-500">
              · Phân tích dòng tiền & sinh lời
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Trực quan hóa tỷ trọng lãi suất, so sánh kỳ hạn và đường cong tích lũy
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'donut'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Tỷ trọng Gốc & Lãi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bars')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'bars'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="whitespace-nowrap">So sánh các kỳ hạn</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span className="whitespace-nowrap">Tiến trình tích lũy</span>
          </button>
        </div>
      </div>

      {/* View 1: Donut breakdown */}
      {activeTab === 'donut' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2">
          {/* SVG Donut Circle */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="24"
                  fill="transparent"
                />
                {/* Principal Segment */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-slate-800 transition-all duration-700 ease-out"
                  strokeWidth="24"
                  strokeDasharray={`${principalStrokeDash} ${circumference}`}
                  strokeDashoffset="0"
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Interest Segment */}
                {interest > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    className="stroke-emerald-500 transition-all duration-700 ease-out"
                    strokeWidth="24"
                    strokeDasharray={`${interestStrokeDash} ${circumference}`}
                    strokeDashoffset={-principalStrokeDash}
                    fill="transparent"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Center Metrics text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tổng nhận được
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {formatVNDShort(result.totalAmount)}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Lãi +{formatPercent(result.effectiveRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Legend and Analysis */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Tiền gửi gốc ban đầu</span>
                </div>
                <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  {formatPercent(principalPercent, 1)}
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900 ml-5 tabular-nums">
                {formatVND(principal)}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-950">Tiền lãi dự tính sinh ra</span>
                </div>
                <span className="text-sm font-bold font-mono text-emerald-700 tabular-nums">
                  {formatPercent(interestPercent, 1)}
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-emerald-700 ml-5 tabular-nums">
                +{formatVND(interest)}
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Với số tiền <strong className="text-slate-800">{formatVNDShort(principal)}</strong> gửi kỳ hạn{' '}
                <strong className="text-slate-800">
                  {formState.termType === 'day' ? `${result.termDays} ngày` : `${result.termMonths} tháng`}
                </strong>, bạn thu về thêm khoản sinh lời{' '}
                <strong className="text-emerald-700">{formatVND(interest)}</strong> mà không chịu rủi ro mất vốn.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Bar Comparison across terms */}
      {activeTab === 'bars' && (
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Bấm vào cột bất kỳ để áp dụng ngay kỳ hạn đó vào bảng tính</span>
            <span>Đơn vị: Tiền lãi (VND)</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 items-end pt-8 pb-3 min-h-[260px] border-b border-slate-100">
            {termComparisons.map((item) => {
              const isSelected = formState.termType === 'month' && formState.termMonths === item.termMonths;
              const heightPercent = Math.max(8, Math.round((item.interestEarned / maxBarInterest) * 100));

              return (
                <div
                  key={item.termMonths}
                  className="flex flex-col items-center group cursor-pointer relative"
                  onClick={() => onSelectTerm(item.termMonths, item.interestRate)}
                  onMouseEnter={() => setHoveredTerm(item.termMonths)}
                  onMouseLeave={() => setHoveredTerm(null)}
                >
                  {/* Tooltip on hover */}
                  {hoveredTerm === item.termMonths && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
                      <div>Lãi: {formatVND(item.interestEarned)}</div>
                      <div className="text-slate-400 font-mono text-[10px]">Lãi suất: {item.interestRate}%/năm</div>
                    </div>
                  )}

                  {/* Value label above bar */}
                  <span className={`text-[10px] font-mono font-semibold mb-1 transition-colors ${
                    isSelected ? 'text-emerald-700 font-bold' : 'text-slate-500'
                  }`}>
                    {formatVNDShort(item.interestEarned)}
                  </span>

                  {/* The bar itself */}
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-44 flex items-end overflow-hidden p-0.5">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isSelected
                          ? 'bg-emerald-600 shadow-sm'
                          : 'bg-indigo-500/80 group-hover:bg-indigo-600'
                      }`}
                    />
                  </div>

                  {/* Term label */}
                  <div className="mt-2 text-center">
                    <span className={`text-xs block font-medium ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-600'
                    }`}>
                      {item.termMonths}T
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {item.interestRate}%
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Kỳ hạn đang chọn ({formState.termMonths} tháng)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
                <span>Các kỳ hạn khác</span>
              </span>
            </div>
            <span className="text-slate-400 italic">
              * Lãi suất ước tính dựa trên biểu lãi suất bình quân các kỳ hạn
            </span>
          </div>
        </div>
      )}

      {/* View 3: Timeline growth progression */}
      {activeTab === 'timeline' && (
        <div className="py-3 space-y-4">
          <div className="text-xs text-slate-600 mb-2">
            Đường cong tích lũy dòng tiền từ thời điểm gửi đến ngày đáo hạn ({result.termDays} ngày)
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Thời điểm mở sổ
                </span>
                <span className="text-sm font-bold font-mono text-slate-800">
                  {formatVND(principal)}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Tiến độ 50% thời gian
                </span>
                <span className="text-sm font-bold font-mono text-slate-800">
                  {formatVND(principal + Math.round(interest / 2))}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Ngày đáo hạn dự kiến
                </span>
                <span className="text-sm font-bold font-mono text-emerald-700">
                  {formatVND(result.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Lợi nhuận ròng
                </span>
                <span className="text-sm font-bold font-mono text-emerald-600">
                  +{formatVND(interest)}
                </span>
              </div>
            </div>

            {/* Progress bar visual */}
            <div className="relative pt-2 pb-6">
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-slate-800 via-indigo-600 to-emerald-500 rounded-full w-full" />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
                <span>0 ngày (Vốn gốc)</span>
                <span>{Math.round(result.termDays / 2)} ngày</span>
                <span className="font-bold text-emerald-700">{result.termDays} ngày (Tất toán)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
