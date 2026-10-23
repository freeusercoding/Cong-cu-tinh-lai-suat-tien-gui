import React from 'react';
import { Landmark, FileSpreadsheet, FileText, Printer, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportExcel,
  onExportPdf,
  onPrint,
  onOpenGuide
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                LãiSuất<span className="text-emerald-600">Pro</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2">
                · Chuẩn Ngân Hàng
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#calculator-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Tính Lãi Tiết Kiệm
            </a>
            <a href="#visual-charts" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Biểu Đồ Trực Quan
            </a>
            <a href="#bank-rates" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              So Sánh Ngân Hàng
            </a>
            <a href="#cashflow-schedule" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Lịch Dòng Tiền
            </a>
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-slate-600"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Cẩm Nang & Video</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
              title="Xuất file Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất</span> Excel
            </button>
            <button
              onClick={onExportPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
              title="Xuất file PDF (.pdf)"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Xuất</span> PDF
            </button>
            <button
              onClick={onPrint}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
              title="In báo cáo"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
