import React, { useState, useEffect } from 'react';
import {
  DepositFormState,
  InterestPaymentMethod,
  ValidationErrors
} from '../types/deposit';
import {
  formatVND,
  formatVNDShort,
  numberToVietnameseWords,
  parseNumberInput
} from '../utils/formatters';
import { SBV_REGULATIONS } from '../utils/bankRates';
import {
  AlertCircle,
  HelpCircle,
  Calendar,
  Settings2,
  Percent,
  Coins,
  ChevronDown
} from 'lucide-react';

interface CalculatorFormProps {
  formState: DepositFormState;
  onChange: (newState: DepositFormState) => void;
  errors: ValidationErrors;
}

const TERM_OPTIONS = [
  { value: 'day-7', label: '1 tuần (7 ngày)', type: 'day', days: 7, months: 0 },
  { value: 'day-14', label: '2 tuần (14 ngày)', type: 'day', days: 14, months: 0 },
  { value: 'day-21', label: '3 tuần (21 ngày)', type: 'day', days: 21, months: 0 },
  { value: 'month-1', label: '1 tháng', type: 'month', days: 30, months: 1 },
  { value: 'month-2', label: '2 tháng', type: 'month', days: 60, months: 2 },
  { value: 'month-3', label: '3 tháng', type: 'month', days: 90, months: 3 },
  { value: 'month-6', label: '6 tháng', type: 'month', days: 180, months: 6 },
  { value: 'month-9', label: '9 tháng', type: 'month', days: 270, months: 9 },
  { value: 'month-12', label: '12 tháng (1 năm)', type: 'month', days: 365, months: 12 },
  { value: 'month-18', label: '18 tháng (1.5 năm)', type: 'month', days: 545, months: 18 },
  { value: 'month-24', label: '24 tháng (2 năm)', type: 'month', days: 730, months: 24 },
  { value: 'month-36', label: '36 tháng (3 năm)', type: 'month', days: 1095, months: 36 },
];

const PRESET_AMOUNTS = [
  { label: '+10 triệu', add: 10_000_000 },
  { label: '+50 triệu', add: 50_000_000 },
  { label: '+100 triệu', add: 100_000_000 },
  { label: '+500 triệu', add: 500_000_000 },
  { label: '1 tỷ', set: 1_000_000_000 },
  { label: '2 tỷ', set: 2_000_000_000 },
];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formState,
  onChange,
  errors
}) => {
  const [displayPrincipal, setDisplayPrincipal] = useState<string>(
    formState.principal > 0 ? formState.principal.toLocaleString('vi-VN') : ''
  );
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync internal display when external principal changes (e.g. from presets or bank apply)
  useEffect(() => {
    setDisplayPrincipal(formState.principal > 0 ? formState.principal.toLocaleString('vi-VN') : '');
  }, [formState.principal]);

  // Handle principal typing (restrict to digits only)
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strip non-digits
    const cleanDigits = rawVal.replace(/\D/g, '');
    const num = cleanDigits ? parseInt(cleanDigits, 10) : 0;

    setDisplayPrincipal(num > 0 ? num.toLocaleString('vi-VN') : cleanDigits);
    onChange({
      ...formState,
      principal: num
    });
  };

  // Add / set preset amount
  const handleApplyPreset = (preset: { label: string; add?: number; set?: number }) => {
    let newAmount = 0;
    if (preset.set !== undefined) {
      newAmount = preset.set;
    } else if (preset.add !== undefined) {
      newAmount = (formState.principal || 0) + preset.add;
    }
    onChange({
      ...formState,
      principal: newAmount
    });
  };

  // Term selection
  const currentTermKey = formState.termType === 'day'
    ? `day-${formState.termDays || 7}`
    : `month-${formState.termMonths}`;

  const handleTermSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TERM_OPTIONS.find(opt => opt.value === e.target.value);
    if (!selected) return;

    if (selected.type === 'day') {
      onChange({
        ...formState,
        termType: 'day',
        termDays: selected.days,
        termMonths: 0
      });
    } else {
      onChange({
        ...formState,
        termType: 'month',
        termMonths: selected.months,
        termDays: undefined
      });
    }
  };

  // Interest rate change
  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange({
      ...formState,
      interestRate: isNaN(val) ? 0 : val
    });
  };

  // Check SBV ceiling warnings
  const isUnder6Months = formState.termType === 'day' || (formState.termType === 'month' && formState.termMonths < 6);
  const isShortTerm = formState.termType === 'day' && (formState.termDays || 0) < 30;
  const hasCeilingWarning =
    (isShortTerm && formState.interestRate > SBV_REGULATIONS.demandDepositCeiling) ||
    (isUnder6Months && !isShortTerm && formState.interestRate > SBV_REGULATIONS.under6MonthsCeiling);
  const isTooHighWarning = formState.interestRate > 15;

  // Minimum deposit warning
  const isBelowMinimum = formState.principal > 0 && formState.principal < SBV_REGULATIONS.minimumStandardDeposit;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Title as in PDF */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tiền gửi dự tính
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Nhập các thông số để tính lãi suất tiền gửi thông thường trả lãi sau theo quy định
        </p>
      </div>

      <div className="space-y-6">
        {/* Field 1: Tổng tiền gửi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="principal-input" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span>Tổng tiền gửi</span>
              <span className="text-rose-500" title="Bắt buộc nhập">*</span>
            </label>
            {formState.principal > 0 && (
              <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ≈ {formatVNDShort(formState.principal)}
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Coins className="w-5 h-5" />
            </div>
            <input
              id="principal-input"
              type="text"
              inputMode="numeric"
              value={displayPrincipal}
              onChange={handlePrincipalChange}
              placeholder="0"
              className={`w-full pl-11 pr-16 py-3 text-lg font-mono font-semibold rounded-xl border transition-all duration-200 tabular-nums focus:outline-none focus:ring-2 ${
                errors.principal
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500/30'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-600 focus:ring-emerald-500/20'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-sm font-bold text-slate-500">VND</span>
            </div>
          </div>

          {/* Real-time word conversion / errors / minimum warning */}
          {errors.principal ? (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.principal}</span>
            </p>
          ) : isBelowMinimum ? (
            <p className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Cảnh báo: Số tiền nhỏ hơn mức tiền gửi tiết kiệm tối thiểu thông thường của các ngân hàng (1.000.000 VND).
              </span>
            </p>
          ) : formState.principal > 0 ? (
            <p className="mt-2 text-xs text-slate-500 italic">
              Bằng chữ: <span className="text-slate-700 font-medium">{numberToVietnameseWords(formState.principal)}</span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-400">
              Chỉ nhập ký tự số, hệ thống tự động định dạng hàng nghìn
            </p>
          )}

          {/* Quick preset buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PRESET_AMOUNTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
            {formState.principal > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...formState, principal: 0 })}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors ml-auto cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Field 2: Kỳ hạn */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="term-select" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span>Kỳ hạn</span>
              <span className="text-rose-500" title="Bắt buộc chọn">*</span>
            </label>
            <span className="text-xs text-slate-500">
              {formState.termType === 'day' ? `${formState.termDays} ngày` : `${formState.termMonths} tháng`}
            </span>
          </div>

          <div className="relative">
            <select
              id="term-select"
              value={currentTermKey}
              onChange={handleTermSelect}
              className={`w-full appearance-none pl-4 pr-10 py-3 text-base font-medium rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.term
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500/30'
                  : 'border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-500/20'
              }`}
            >
              <option value="" disabled>
                Chọn kỳ hạn
              </option>
              <optgroup label="Kỳ hạn ngắn (ngày / tuần)">
                {TERM_OPTIONS.filter(o => o.type === 'day').map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Kỳ hạn theo tháng (thông dụng)">
                {TERM_OPTIONS.filter(o => o.type === 'month').map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          {errors.term && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.term}</span>
            </p>
          )}

          {/* Quick term selector pills/buttons */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[1, 3, 6, 12, 24].map((m) => {
              const isSelected = formState.termType === 'month' && formState.termMonths === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ ...formState, termType: 'month', termMonths: m, termDays: undefined })}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m} tháng
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 3: Lãi suất */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="rate-input" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span>Lãi suất</span>
              <span className="text-rose-500" title="Bắt buộc nhập">*</span>
            </label>
            <span className="text-xs text-slate-500">
              Tỷ lệ phần trăm tính theo năm
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Percent className="w-4 h-4" />
            </div>
            <input
              id="rate-input"
              type="number"
              step="0.05"
              min="0"
              max="30"
              value={formState.interestRate === 0 ? '' : formState.interestRate}
              onChange={handleInterestRateChange}
              placeholder="0"
              className={`w-full pl-10 pr-20 py-3 text-lg font-mono font-semibold rounded-xl border transition-all duration-200 tabular-nums focus:outline-none focus:ring-2 ${
                errors.interestRate
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500/30'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-600 focus:ring-emerald-500/20'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-sm font-bold text-slate-500">%/năm</span>
            </div>
          </div>

          {errors.interestRate ? (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.interestRate}</span>
            </p>
          ) : hasCeilingWarning ? (
            <p className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Lưu ý: Trần lãi suất NHNN cho kỳ hạn dưới 6 tháng là{' '}
                {isShortTerm ? '0.5%/năm' : '4.75%/năm'}. Mức này đang vượt quy định trần.
              </span>
            </p>
          ) : isTooHighWarning ? (
            <p className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Cảnh báo: Lãi suất trên 15%/năm là mức rất cao so với mặt bằng tiền gửi ngân hàng.</span>
            </p>
          ) : (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Gợi ý tham khảo:</span>
              <button
                type="button"
                onClick={() => onChange({ ...formState, interestRate: 4.7 })}
                className="hover:underline text-slate-700 font-mono"
              >
                4.7%
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChange({ ...formState, interestRate: 5.0 })}
                className="hover:underline text-slate-700 font-mono"
              >
                5.0%
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChange({ ...formState, interestRate: 5.5 })}
                className="hover:underline text-slate-700 font-mono"
              >
                5.5%
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onChange({ ...formState, interestRate: 5.8 })}
                className="hover:underline text-slate-700 font-mono"
              >
                5.8%
              </button>
            </div>
          )}
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              Tùy chọn nâng cao (Phương thức trả lãi, Ngày gửi, Chuẩn 365 ngày)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-200/70">
              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hình thức lĩnh lãi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'end_of_term', label: 'Trả lãi sau (Cuối kỳ)', desc: 'Phổ biến nhất, nhận toàn bộ khi đáo hạn' },
                    { id: 'monthly', label: 'Trả lãi hàng tháng', desc: 'Nhận lãi đều đặn mỗi tháng' },
                    { id: 'beginning_of_term', label: 'Trả lãi trước', desc: 'Nhận lãi ngay khi mở sổ' },
                    { id: 'compound', label: 'Tái tục lãi nhập gốc', desc: 'Lãi kép quay vòng tự động' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onChange({ ...formState, paymentMethod: m.id as InterestPaymentMethod })}
                      className={`text-left p-2.5 rounded-lg border transition-all ${
                        formState.paymentMethod === m.id
                          ? 'border-emerald-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-900">{m.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date & Calculation Basis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ngày bắt đầu gửi
                  </label>
                  <div className="relative">
                    <input
                      id="start-date-input"
                      type="date"
                      value={formState.startDate}
                      onChange={(e) => onChange({ ...formState, startDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="basis-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quy ước tính ngày trong năm
                  </label>
                  <select
                    id="basis-select"
                    value={formState.calculationBasis}
                    onChange={(e) => onChange({ ...formState, calculationBasis: Number(e.target.value) as 365 | 360 })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value={365}>365 ngày (Chuẩn TT 14/2017/TT-NHNN)</option>
                    <option value={360}>360 ngày (Quy ước tài chính quốc tế)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
