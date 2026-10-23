import React from 'react';
import { CalculationResult, DepositFormState, ScheduleRow } from '../types/deposit';
import { formatVND, formatDateVN, numberToVietnameseWords } from '../utils/formatters';

interface PrintReportViewProps {
  formState: DepositFormState;
  result: CalculationResult;
  schedule: ScheduleRow[];
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  formState,
  result,
  schedule
}) => {
  return (
    <div className="hidden print:block text-black bg-white p-8 max-w-4xl mx-auto">
      {/* Print Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">
              BẢNG TÍNH TOÁN LÃI SUẤT TIỀN GỬI TIẾT KIỆM
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Sản phẩm tiền gửi thông thường trả lãi sau theo Thông tư 14/2017/TT-NHNN
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Ngày lập: {formatDateVN(new Date())}</div>
            <div>Mã tham chiếu: #{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>
      </div>

      {/* 1. Deposit details */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3">
          1. Thông tin khoản tiền gửi
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Tổng tiền gửi gốc:</span>
            <span className="font-bold font-mono">{formatVND(result.principal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Lãi suất áp dụng:</span>
            <span className="font-bold font-mono">{result.interestRate}%/năm</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Kỳ hạn gửi:</span>
            <span className="font-bold font-mono">
              {formState.termType === 'day' ? `${result.termDays} ngày` : `${result.termMonths} tháng`}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Hình thức trả lãi:</span>
            <span className="font-bold">Trả sau (Cuối kỳ đáo hạn)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Ngày bắt đầu gửi:</span>
            <span className="font-bold font-mono">{formatDateVN(result.startDate)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Ngày đáo hạn:</span>
            <span className="font-bold font-mono">{formatDateVN(result.maturityDate)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Số ngày gửi thực tế:</span>
            <span className="font-bold font-mono">{result.termDays} ngày</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Quy ước tính ngày:</span>
            <span className="font-bold font-mono">{formState.calculationBasis} ngày/năm</span>
          </div>
        </div>
        <div className="text-xs text-slate-700 italic mt-2">
          Bằng chữ tiền gửi gốc: {numberToVietnameseWords(result.principal)}
        </div>
      </div>

      {/* 2. Calculation summary */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-emerald-700 mb-3">
          2. Kết quả tiền lãi dự tính
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
          <div className="p-3 border border-slate-300 rounded">
            <div className="text-slate-600 text-[11px] mb-1">Tiền lãi dự tính nhận được:</div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              {formatVND(result.interestEarned)}
            </div>
            <div className="text-[10px] text-slate-500 italic mt-1">
              Bằng chữ: {numberToVietnameseWords(result.interestEarned)}
            </div>
          </div>
          <div className="p-3 border border-slate-300 rounded bg-slate-50">
            <div className="text-slate-600 text-[11px] mb-1">Tổng tiền nhận được (Gốc + Lãi):</div>
            <div className="text-lg font-bold font-mono text-slate-900">
              {formatVND(result.totalAmount)}
            </div>
            <div className="text-[10px] text-slate-500 italic mt-1">
              Bằng chữ: {numberToVietnameseWords(result.totalAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Schedule Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-700 mb-3">
          3. Lịch trình phân bổ dòng tiền
        </h2>
        <table className="w-full text-left text-[11px] border border-slate-300">
          <thead className="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th className="p-1.5 border-r border-slate-300">Kỳ</th>
              <th className="p-1.5 border-r border-slate-300">Khoảng thời gian</th>
              <th className="p-1.5 border-r border-slate-300 text-center">Số ngày</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Dư gốc</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Lãi phát sinh</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Lãi lũy kế</th>
              <th className="p-1.5 text-right">Dòng tiền nhận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {schedule.slice(0, 18).map((r) => (
              <tr key={r.period}>
                <td className="p-1.5 border-r border-slate-300 font-medium">{r.periodLabel}</td>
                <td className="p-1.5 border-r border-slate-300 font-mono">{r.startDate} - {r.endDate}</td>
                <td className="p-1.5 border-r border-slate-300 text-center font-mono">{r.days}</td>
                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{formatVND(r.beginningBalance)}</td>
                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{formatVND(r.interestEarned)}</td>
                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{formatVND(r.cumulativeInterest)}</td>
                <td className="p-1.5 text-right font-mono font-semibold">{formatVND(r.cashFlow)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature block */}
      <div className="pt-8 grid grid-cols-2 text-center text-xs">
        <div>
          <div className="font-bold">NGƯỜI LẬP BIỂU</div>
          <div className="text-slate-400 text-[10px] italic mt-1">(Ký và ghi rõ họ tên)</div>
          <div className="h-16" />
        </div>
        <div>
          <div className="font-bold">KHÁCH HÀNG XÁC NHẬN</div>
          <div className="text-slate-400 text-[10px] italic mt-1">(Ký và ghi rõ họ tên)</div>
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
};
