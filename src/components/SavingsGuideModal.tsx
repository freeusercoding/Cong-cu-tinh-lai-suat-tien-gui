import React from 'react';
import { X, ExternalLink, Video, CheckCircle2, AlertCircle } from 'lucide-react';

interface SavingsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsGuideModal: React.FC<SavingsGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const videoUrl =
    'https://www.tiktok.com/@nguyentrangtkneu/video/7202579533806062875?is_from_webapp=1&sender_device=pc&web_id=7603681770291086866';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Video className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Hướng Dẫn Gửi Tiết Kiệm & Video Đính Kèm
            </h3>
            <p className="text-xs text-slate-500">
              Trích xuất từ tài liệu cấu phần 2 cung cấp thông tin lãi tiền gửi
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6 text-sm text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Link video hướng dẫn gửi tiết kiệm (TikTok):</span>
            </div>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-mono break-all inline-flex items-center gap-1.5 underline mt-1"
            >
              <span>{videoUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Lưu ý quan trọng từ Thông tư NHNN:
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Cơ sở tính lãi:</strong> Thông tư 14/2017/TT-NHNN quy định thời hạn tính lãi là 365 ngày (thay vì 360 ngày như trước đây), số ngày gửi thực tế tính từ ngày nhận tiền gửi đến hết ngày liền kề trước ngày thanh toán.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Quy định rút trước hạn:</strong> Theo Thông tư 04/2022/TT-NHNN, khi rút trước hạn một phần tiền gửi, chỉ phần tiền rút mới tính lãi suất không kỳ hạn (thường 0.1% - 0.5%/năm), phần còn lại tiếp tục hưởng nguyên lãi suất cam kết ban đầu.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tự động tái tục:</strong> Vào ngày đáo hạn, nếu khách hàng không làm thủ tục tất toán, hầu hết ngân hàng sẽ tự động nhập lãi vào gốc và tái tục sang kỳ hạn mới tương đương theo lãi suất hiện hành.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span>Mở video trên TikTok</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
