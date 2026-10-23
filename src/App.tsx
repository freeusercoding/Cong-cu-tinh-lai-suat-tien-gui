import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  DepositFormState,
  ValidationErrors,
  InterestPaymentMethod
} from './types/deposit';
import {
  calculateDeposit,
  generateSchedule,
  generateTermComparisons
} from './utils/calculator';
import { exportDepositToExcel } from './utils/exportExcel';
import { exportDepositToPdf } from './utils/exportPdf';
import { formatDateISO } from './utils/formatters';

import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultSummary } from './components/ResultSummary';
import { VisualCharts } from './components/VisualCharts';
import { BankRateComparison } from './components/BankRateComparison';
import { CashFlowSchedule } from './components/CashFlowSchedule';
import { SavingsGuideSection } from './components/SavingsGuideSection';
import { SavingsGuideModal } from './components/SavingsGuideModal';
import { PrintReportView } from './components/PrintReportView';

import {
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Initial state with standard 100M VND, 12 months, 5.0% rate
  const [formState, setFormState] = useState<DepositFormState>({
    principal: 100_000_000,
    termMonths: 12,
    termType: 'month',
    interestRate: 5.0,
    startDate: formatDateISO(new Date()),
    paymentMethod: 'end_of_term', // Trả lãi sau (mặc định theo file PDF)
    calculationBasis: 365,
  });

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time validation following the PDF specification
  const errors: ValidationErrors = useMemo(() => {
    const errs: ValidationErrors = {};

    // 1. Số tiền gửi: Bắt buộc nhập, phải là số lớn hơn 0
    if (formState.principal === undefined || formState.principal === null || formState.principal <= 0) {
      errs.principal = 'Vui lòng nhập số tiền gửi hợp lệ.';
    }

    // 2. Kỳ hạn gửi: Bắt buộc chọn, giá trị phải thuộc danh sách hợp lệ
    if (formState.termType === 'month' && (!formState.termMonths || formState.termMonths <= 0)) {
      errs.term = 'Vui lòng chọn kỳ hạn gửi.';
    } else if (formState.termType === 'day' && (!formState.termDays || formState.termDays <= 0)) {
      errs.term = 'Vui lòng chọn kỳ hạn gửi.';
    }

    // 3. Lãi suất: Bắt buộc nhập, phải là số lớn hơn hoặc bằng 0
    if (formState.interestRate === undefined || formState.interestRate === null || formState.interestRate < 0) {
      errs.interestRate = 'Vui lòng nhập lãi suất hợp lệ.';
    }

    return errs;
  }, [formState]);

  // Reactive calculation result
  const result = useMemo(() => {
    return calculateDeposit(formState);
  }, [formState]);

  // Cash flow amortization schedule
  const schedule = useMemo(() => {
    return generateSchedule(formState);
  }, [formState]);

  // Term comparisons for chart
  const termComparisons = useMemo(() => {
    return generateTermComparisons(
      formState.principal,
      formState.termMonths,
      formState.interestRate,
      formState.paymentMethod
    );
  }, [formState.principal, formState.termMonths, formState.interestRate, formState.paymentMethod]);

  // Export to Excel handler
  const handleExportExcel = () => {
    if (errors.principal || errors.term || errors.interestRate) {
      showToast('Vui lòng kiểm tra lại thông tin tiền gửi hợp lệ trước khi xuất file.');
      return;
    }
    try {
      exportDepositToExcel(formState, result, schedule);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      showToast('Đã xuất file Excel (.xlsx) thành công!');
    } catch {
      showToast('Có lỗi xảy ra khi xuất file Excel.');
    }
  };

  // Export to PDF handler
  const handleExportPdf = () => {
    if (errors.principal || errors.term || errors.interestRate) {
      showToast('Vui lòng kiểm tra lại thông tin tiền gửi hợp lệ trước khi xuất file.');
      return;
    }
    try {
      exportDepositToPdf(formState, result, schedule);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      showToast('Đã xuất báo cáo PDF (.pdf) thành công!');
    } catch {
      showToast('Có lỗi xảy ra khi xuất file PDF.');
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Apply bank rate from table
  const handleApplyBankRate = (rate: number, bankName: string) => {
    setFormState(prev => ({
      ...prev,
      interestRate: rate
    }));
    showToast(`Đã áp dụng lãi suất ${rate}%/năm của ${bankName}!`);
  };

  // Apply term from chart
  const handleSelectTermFromChart = (months: number, rate: number) => {
    setFormState(prev => ({
      ...prev,
      termType: 'month',
      termMonths: months,
      termDays: undefined,
      interestRate: rate
    }));
    showToast(`Đã chuyển sang kỳ hạn ${months} tháng (${rate}%/năm)!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Printable template */}
      <PrintReportView
        formState={formState}
        result={result}
        schedule={schedule}
      />

      {/* Screen view (hidden on print) */}
      <div className="no-print flex-1 flex flex-col">
        {/* Top Navigation */}
        <Header
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onOpenGuide={() => setGuideModalOpen(true)}
        />

        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
          {/* Hero Banner / Headline */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1.5">
                <span>CÔNG CỤ TÍNH LÃI TIỀN GỬI NGÂN HÀNG</span>
                <span>·</span>
                <span>THÔNG TƯ 14/2017/TT-NHNN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                Tính lãi suất tiền gửi sản phẩm tiền gửi thông thường trả lãi sau
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                Dễ dàng tính toán lợi nhuận tiền gửi tiết kiệm có kỳ hạn, phân tích tỷ trọng sinh lời bằng biểu đồ trực quan, so sánh lãi suất các ngân hàng và xuất dữ liệu sang Excel / PDF.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Xuất Excel</span>
              </button>
              <button
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Xuất PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs"
                title="In báo cáo"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Calculator Split (matches the PDF layout: Left Form, Right Result) */}
          <div id="calculator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 xl:col-span-7">
              <CalculatorForm
                formState={formState}
                onChange={setFormState}
                errors={errors}
              />
            </div>
            <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24">
              <ResultSummary
                result={result}
                formState={formState}
              />
            </div>
          </div>

          {/* Visual Interactive Charts Section */}
          <VisualCharts
            result={result}
            formState={formState}
            termComparisons={termComparisons}
            onSelectTerm={handleSelectTermFromChart}
          />

          {/* Top Vietnamese Bank Interest Rates Comparison */}
          <BankRateComparison
            principal={formState.principal}
            selectedMonths={formState.termType === 'month' ? formState.termMonths : 1}
            currentRate={formState.interestRate}
            onApplyRate={handleApplyBankRate}
          />

          {/* Detailed Monthly Cash Flow Schedule */}
          <CashFlowSchedule
            schedule={schedule}
            result={result}
          />

          {/* Savings Guide & TikTok Video Feature Section */}
          <SavingsGuideSection />
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">LãiSuấtPro</span>
              <span className="mx-2">·</span>
              <span>Công cụ tính lãi suất tiền gửi sản phẩm tiền gửi thông thường trả lãi sau</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Chuẩn Thông tư 14/2017/TT-NHNN</span>
              <span>·</span>
              <button
                onClick={() => setGuideModalOpen(true)}
                className="hover:text-slate-900 underline"
              >
                Cẩm nang tiết kiệm
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Guide Modal */}
      <SavingsGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
}
