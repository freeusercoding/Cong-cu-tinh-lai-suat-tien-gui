import React from 'react';
import { ExternalLink, Video, ShieldCheck, Split, Smartphone, AlertTriangle } from 'lucide-react';

export const SavingsGuideSection: React.FC = () => {
  const videoUrl =
    'https://www.tiktok.com/@nguyentrangtkneu/video/7202579533806062875?is_from_webapp=1&sender_device=pc&web_id=7603681770291086866';

  return (
    <div id="savings-guide" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Cẩm nang & Video hướng dẫn gửi tiết kiệm thông minh</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Các nguyên tắc và bí quyết tối ưu hóa tiền lãi gửi ngân hàng an toàn nhất
          </p>
        </div>

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs shrink-0"
        >
          <Video className="w-4 h-4 text-rose-400" />
          <span>Xem Video hướng dẫn (TikTok)</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Video Feature Card */}
        <div className="lg:col-span-5 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">
              <Video className="w-4 h-4" />
              <span>Video thực tế đính kèm</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Bí quyết gửi tiết kiệm sinh lời tối đa & an toàn
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Theo chia sẻ của ThS. Nguyễn Trang (ĐH Kinh tế Quốc dân NEU) về cách tối ưu hóa tiền nhàn rỗi, không bị mất lãi oan khi cần tiền đột xuất.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/80">
            <div className="bg-slate-800/90 rounded-lg p-3 text-xs text-slate-300 mb-3 font-mono">
              tiktok.com/@nguyentrangtkneu/video/7202579533806062875
            </div>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              Mở xem trên TikTok
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Golden Rules */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h5 className="text-sm font-bold text-slate-900">
                Chia nhỏ sổ tiết kiệm
              </h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thay vì gửi toàn bộ vào 1 sổ lớn, hãy chia thành 2-3 sổ có kỳ hạn ngắn và dài. Khi cần tiền gấp, chỉ cần rút 1 sổ nhỏ mà không bị mất lãi của các sổ còn lại.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h5 className="text-sm font-bold text-slate-900">
                Ưu tiên gửi Online
              </h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hầu hết các ngân hàng hiện nay đều cộng thêm từ <strong className="text-indigo-700">+0.2% đến +0.5%/năm</strong> lãi suất khi mở sổ trực tuyến qua Mobile Banking so với giao dịch tại quầy.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h5 className="text-sm font-bold text-slate-900">
                Rút trước hạn từng phần
              </h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo Thông tư 04/2022/TT-NHNN, khách hàng được rút một phần tiền gửi trước hạn (chỉ phần rút chịu lãi không kỳ hạn), phần còn lại vẫn được giữ nguyên lãi suất có kỳ hạn!
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h5 className="text-sm font-bold text-slate-900">
                Bảo hiểm tiền gửi
              </h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hạn mức bảo hiểm tiền gửi tối đa theo Quyết định số 32/2021/QĐ-TTg là <strong className="text-slate-800">125 triệu đồng</strong> cho mỗi người gửi tại một tổ chức tín dụng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
