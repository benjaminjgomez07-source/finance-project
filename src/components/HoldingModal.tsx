import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Trash2, ArrowUpRight, ShieldAlert, Sparkles, Activity, Check } from 'lucide-react';
import { Holding } from '../types/portfolio';
import { Sparkline } from './Sparkline';

interface HoldingModalProps {
  holding: Holding | null;
  onClose: () => void;
  onUpdateAllocation: (ticker: string, newAllocation: number) => void;
  onDeleteHolding: (ticker: string) => void;
}

export const HoldingModal: React.FC<HoldingModalProps> = ({
  holding,
  onClose,
  onUpdateAllocation,
  onDeleteHolding,
}) => {
  if (!holding) return null;

  const [alloc, setAlloc] = useState(holding.allocation);
  const isPositiveDay = (holding.dayChangePercent ?? 0) >= 0;
  const themeColor = isPositiveDay ? '#00c805' : '#ff5000';
  const isPositiveUpside = holding.upside >= 0;

  const handleSaveAlloc = () => {
    onUpdateAllocation(holding.ticker, alloc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c1015] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Robinhood Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {holding.ticker}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {holding.sector}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
              {holding.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Big Live Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                ${holding.price.toFixed(2)}
              </span>
              <Sparkline data={holding.priceHistory} width={90} height={28} />
            </div>

            <div className="flex items-center gap-2 text-sm font-bold">
              <span 
                className="flex items-center gap-1 font-mono tabular-nums"
                style={{ color: themeColor }}
              >
                {isPositiveDay ? (
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>
                  {isPositiveDay ? '+' : ''}${Math.abs(holding.dayChange ?? 0).toFixed(2)}
                </span>
                <span>
                  ({isPositiveDay ? '+' : ''}{(holding.dayChangePercent ?? 0).toFixed(2)}%)
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Today</span>
            </div>
          </div>

          {/* Key Statistics Grid (Robinhood Style) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Key Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Market Cap</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white block mt-0.5">
                  {holding.marketCap || 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500 truncate block">
                  {holding.sharesCountDisplay || 'Shares N/A'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Est. Upside</span>
                <span className={`font-mono text-base font-bold block mt-0.5 ${isPositiveUpside ? 'text-[#00c805]' : 'text-[#ff5000]'}`}>
                  {isPositiveUpside ? `+${holding.upside}%` : `${holding.upside}%`}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Tgt: ${holding.targetPrice?.toFixed(0) || 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">KPEG Ratio</span>
                <span className="font-mono text-base font-bold text-[#00c805] block mt-0.5">
                  {holding.kpeg}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {holding.kpeg < 0.8 ? '★ Undervalued' : 'Normal Multiple'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">P/E Multiple</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white block mt-0.5">
                  {holding.pe ? holding.pe.toFixed(1) : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Fwd: {holding.forwardPe ? holding.forwardPe.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Allocation Slider (Robinhood Position Order Card) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Your Portfolio Allocation
                </span>
                <span className="text-[11px] text-slate-500">
                  Target weight in Gabriel's Strategy
                </span>
              </div>
              <span className="font-mono text-base font-black text-[#00c805]">
                {alloc}%
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="50"
              value={alloc}
              onChange={(e) => setAlloc(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c805]"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1% (Light)</span>
              <span>15% (Core)</span>
              <span>30% (High Conviction)</span>
              <span>50%</span>
            </div>
          </div>

          {/* About / Investment Thesis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              About &amp; Investment Thesis
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
              {holding.thesis}
            </p>
          </div>

          {/* Catalysts List */}
          {holding.catalysts && holding.catalysts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00c805]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026–2027 Key Catalysts</span>
              </div>
              <ul className="space-y-2">
                {holding.catalysts.map((cat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#00c805] shrink-0 mt-0.5" />
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks List */}
          {holding.risks && holding.risks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff5000]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Downside Risks</span>
              </div>
              <ul className="space-y-2">
                {holding.risks.map((risk, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000] shrink-0 mt-2" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions (Robinhood Action Sheet) */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0c1015] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm(`Remove ${holding.ticker} from portfolio?`)) {
                onDeleteHolding(holding.ticker);
                onClose();
              }
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAlloc}
              className="min-h-[44px] px-6 py-2 rounded-full text-xs font-bold text-black bg-[#00c805] hover:bg-[#00b004] transition-all shadow-md shadow-[#00c805]/30 active:scale-95"
            >
              Update Allocation ({alloc}%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
