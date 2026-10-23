import React, { useState } from 'react';
import { POPULAR_VIETNAMESE_BANKS } from '../utils/bankRates';
import { formatVND, formatPercent } from '../utils/formatters';
import { Landmark, ArrowUpRight, Check } from 'lucide-react';

interface BankRateComparisonProps {
  principal: number;
  selectedMonths: number;
  currentRate: number;
  onApplyRate: (rate: number, bankName: string) => void;
}

export const BankRateComparison: React.FC<BankRateComparisonProps> = ({
  principal,
  selectedMonths,
  currentRate,
  onApplyRate
}) => {
  const [filterType, setFilterType] = useState<'all' | 'big4' | 'private'>('all');
  const [appliedBank, setAppliedBank] = useState<string | null>(null);

  // Approximate target month key
  let lookupKey = '12';
  if (selectedMonths <= 1) lookupKey = '1';
  else if (selectedMonths <= 2) lookupKey = '2';
  else if (selectedMonths <= 3) lookupKey = '3';
  else if (selectedMonths <= 6) lookupKey = '6';
  else if (selectedMonths <= 9) lookupKey = '9';
  else if (selectedMonths <= 12) lookupKey = '12';
  else if (selectedMonths <= 18) lookupKey = '18';
  else if (selectedMonths <= 24) lookupKey = '24';
  else lookupKey = '36';

  const big4Codes = ['VCB', 'BIDV', 'CTG', 'AGR'];

  const filteredBanks = POPULAR_VIETNAMESE_BANKS.filter(bank => {
    if (filterType === 'big4') return big4Codes.includes(bank.code);
    if (filterType === 'private') return !big4Codes.includes(bank.code);
    return true;
  });

  const handleSelect = (rate: number, name: string) => {
    onApplyRate(rate, name);
    setAppliedBank(name);
    setTimeout(() => setAppliedBank(null), 2500);
  };

  return (
    <div id="bank-rates" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <span>So sánh lãi suất các ngân hàng</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tham khảo biểu lãi suất tiền gửi thông thường kỳ hạn {lookupKey} tháng và áp dụng nhanh
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({POPULAR_VIETNAMESE_BANKS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('big4')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'big4'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Big 4 Nhà Nước
          </button>
          <button
            type="button"
            onClick={() => setFilterType('private')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'private'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ngân hàng TMCP
          </button>
        </div>
      </div>

      {/* Grid of Bank Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBanks.map((bank) => {
          const rate = bank.rates[lookupKey] ?? 4.8;
          const monthsNum = parseInt(lookupKey, 10);
          const estInterest = Math.round((principal * (rate / 100) * monthsNum) / 12);
          const isCurrent = Math.abs(currentRate - rate) < 0.01;
          const isJustApplied = appliedBank === bank.shortName;

          return (
            <div
              key={bank.code}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isJustApplied
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                  : isCurrent
                  ? 'border-slate-800 bg-slate-50/70 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.logoText}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">
                        {bank.shortName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {big4Codes.includes(bank.code) ? 'Nhóm Big 4' : 'TMCP lớn'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-emerald-600 tabular-nums">
                      {formatPercent(rate)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/năm</span>
                  </div>
                </div>

                {principal > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 mb-3 text-xs flex items-center justify-between">
                    <span className="text-slate-500">Ước tính lãi nhận:</span>
                    <span className="font-bold font-mono text-slate-800 tabular-nums">
                      {formatVND(estInterest)}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSelect(rate, bank.shortName)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isJustApplied
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                {isJustApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã áp dụng</span>
                  </>
                ) : isCurrent ? (
                  <span>Đang áp dụng</span>
                ) : (
                  <>
                    <span>Áp dụng lãi suất này</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>* Lãi suất tiền gửi tại quầy/online mang tính tham khảo cập nhật mới nhất từ website chính thức của các ngân hàng.</span>
        <span>Có thể thay đổi theo từng chi nhánh và chính sách ưu đãi.</span>
      </div>
    </div>
  );
};
