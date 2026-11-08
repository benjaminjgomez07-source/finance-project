import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdings: Holding[];
  weightedKPEG: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  holdings,
  weightedKPEG,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const generateMarkdownSummary = () => {
    let text = `# Gabriel's Portfolio - Tactical 2027 Growth & KPEG Analytics\n`;
    text += `Weighted KPEG Average: ${weightedKPEG}\n`;
    text += `Total Assets: ${holdings.length} | Allocation: ${holdings.reduce((s, h) => s + h.allocation, 0)}%\n\n`;
    text += `| Ticker | Company | Sector | Weight | Price | Est. Upside | KPEG |\n`;
    text += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    holdings.forEach((h) => {
      text += `| **${h.ticker}** | ${h.name} | ${h.sector} | ${h.allocation}% | $${h.price.toFixed(2)} | ${h.upside >= 0 ? '+' : ''}${h.upside}% | ${h.kpeg} |\n`;
    });
    text += `\n## Core Theses Summary:\n`;
    holdings.forEach((h) => {
      text += `\n### ${h.ticker} (${h.name}) - ${h.allocation}% Weight | KPEG: ${h.kpeg}\n`;
      text += `${h.thesis}\n`;
    });
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(holdings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gabriels_portfolio_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#0c1015] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c805]" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Export &amp; Share Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-500 dark:text-[#8b949e]">
            Preview formatted markdown summary of Gabriel's Portfolio allocations, upside metrics, and investment theses.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto whitespace-pre leading-relaxed">
            {generateMarkdownSummary()}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold border border-slate-300 dark:border-white/15 bg-white dark:bg-black text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#00c805] stroke-[2.5]" />
                  <span className="text-[#00c805] font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold bg-[#00c805] hover:bg-[#00b004] text-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00c805]/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
