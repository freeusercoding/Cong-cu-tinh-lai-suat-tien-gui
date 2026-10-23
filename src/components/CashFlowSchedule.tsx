import React, { useState } from 'react';
import { ScheduleRow, CalculationResult } from '../types/deposit';
import { formatVND } from '../utils/formatters';
import { Table, Calendar, ArrowDownCircle } from 'lucide-react';

interface CashFlowScheduleProps {
  schedule: ScheduleRow[];
  result: CalculationResult;
}

export const CashFlowSchedule: React.FC<CashFlowScheduleProps> = ({
  schedule,
  result
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(schedule.length / itemsPerPage);
  const paginatedRows = schedule.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div id="cashflow-schedule" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600" />
            <span>Lịch trình dòng tiền chi tiết</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bảng phân bổ tiền lãi phát sinh, lãi lũy kế và thời điểm chi trả theo từng kỳ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Tổng số kỳ: <strong className="text-slate-800">{schedule.length}</strong></span>
          <span>·</span>
          <span>Tổng ngày thực gửi: <strong className="text-slate-800">{result.termDays} ngày</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                Kỳ phân bổ
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                Khoảng thời gian
              </th>
              <th scope="col" className="px-3 py-3 text-center whitespace-nowrap">
                Số ngày
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Dư nợ gốc
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Lãi phát sinh
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Lãi lũy kế
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Số dư cuối kỳ
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap text-emerald-700 bg-emerald-50/50">
                Thực nhận kỳ này
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedRows.map((row) => (
              <tr key={row.period} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                  {row.periodLabel}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  <span className="font-mono">{row.startDate}</span>
                  <span className="mx-1 text-slate-400">→</span>
                  <span className="font-mono">{row.endDate}</span>
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-600 whitespace-nowrap">
                  {row.days}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                  {formatVND(row.beginningBalance)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600 tabular-nums whitespace-nowrap">
                  +{formatVND(row.interestEarned)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                  {formatVND(row.cumulativeInterest)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                  {formatVND(row.endingBalance)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30 tabular-nums whitespace-nowrap">
                  {row.cashFlow > 0 ? (
                    <span className="flex items-center justify-end gap-1">
                      <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                      {formatVND(row.cashFlow)}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">0 VND</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-200">
            <tr>
              <td colSpan={2} className="px-4 py-3 text-slate-900">
                TỔNG CỘNG
              </td>
              <td className="px-3 py-3 text-center font-mono">
                {result.termDays}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatVND(result.principal)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-emerald-700">
                +{formatVND(result.interestEarned)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-emerald-700">
                {formatVND(result.interestEarned)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {formatVND(result.totalAmount)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-emerald-800 bg-emerald-100/60">
                {formatVND(result.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination controls if needed */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2">
          <div className="text-xs text-slate-500">
            Hiển thị trang {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
