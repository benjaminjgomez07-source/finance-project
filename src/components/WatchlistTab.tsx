import React from 'react';
import { Plus, Check, Compass } from 'lucide-react';
import { WatchlistStock, Holding } from '../types/portfolio';
import { WATCHLIST_CANDIDATES } from '../data/defaultPortfolio';

interface WatchlistTabProps {
  existingTickers: string[];
  onAddHolding: (holding: Holding) => void;
  onOpenAddModal: () => void;
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({
  existingTickers,
  onAddHolding,
  onOpenAddModal,
}) => {
  const handleAdd = (stock: WatchlistStock) => {
    onAddHolding({
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      allocation: 5,
      price: stock.price,
      targetPrice: stock.targetPrice,
      upside: stock.upside,
      kpeg: stock.kpeg,
      pe: stock.pe,
      marketCap: stock.marketCap,
      sharesOutstanding: stock.sharesOutstanding,
      sharesCountDisplay: stock.sharesCountDisplay,
      thesis: stock.thesis,
      catalysts: stock.catalysts,
      risks: ['Market volatility and macro headwinds']
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c805]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tactical Radar &amp; Watchlist
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] mt-1">
            Curated growth prospects evaluated under Gabriel's 2027 KPEG framework. One-click integration into your portfolio.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold text-black bg-[#00c805] hover:bg-[#00b004] transition-all flex items-center gap-1.5 shadow-lg shadow-[#00c805]/20 self-start sm:self-auto shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Ticker</span>
        </button>
      </div>

      {/* Grid of Watchlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WATCHLIST_CANDIDATES.map((stock) => {
          const isAdded = existingTickers.includes(stock.ticker);
          return (
            <div
              key={stock.ticker}
              className="p-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1015] shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                      {stock.ticker}
                    </span>
                    <h3 className="text-xs font-semibold text-slate-700 dark:text-[#8b949e] mt-0.5">
                      {stock.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">{stock.sector}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#00c805]">
                      +{stock.upside}% Upside
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 my-2.5 border-y border-slate-100 dark:border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">KPEG</span>
                    <span className="font-mono font-bold text-[#00c805]">
                      {stock.kpeg}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Market Cap</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {stock.marketCap}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      ${stock.targetPrice.toFixed(0)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {stock.thesis}
                </p>

                {stock.catalysts && (
                  <div className="space-y-1 text-[11px] text-slate-500 mb-4 bg-slate-50 dark:bg-black p-3 rounded-2xl border border-slate-200/60 dark:border-white/10">
                    <span className="font-bold text-[#00c805] block">Key Catalyst:</span>
                    <span className="text-slate-700 dark:text-slate-300">&bull; {stock.catalysts[0]}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                {isAdded ? (
                  <button
                    disabled
                    className="w-full min-h-[44px] rounded-full border border-[#00c805]/30 bg-[#00c805]/10 text-[#00c805] text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>In Active Portfolio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(stock)}
                    className="w-full min-h-[44px] rounded-full bg-[#00c805] hover:bg-[#00b004] text-black text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00c805]/20 active:scale-98"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Portfolio (5% Allocation)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
