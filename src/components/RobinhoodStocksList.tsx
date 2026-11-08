import React, { useState } from 'react';
import { MoreHorizontal, Plus, ArrowUpRight, Check, Compass } from 'lucide-react';
import { Holding, WatchlistStock } from '../types/portfolio';
import { Sparkline } from './Sparkline';
import { WATCHLIST_CANDIDATES } from '../data/defaultPortfolio';

interface RobinhoodStocksListProps {
  holdings: Holding[];
  onSelectHolding: (holding: Holding) => void;
  onOpenAddModal: () => void;
  onAddHolding: (holding: Holding) => void;
}

export const RobinhoodStocksList: React.FC<RobinhoodStocksListProps> = ({
  holdings,
  onSelectHolding,
  onOpenAddModal,
  onAddHolding,
}) => {
  // Toggle between percent change (+2.4%) and dollar change (+$4.20) on pill click
  const [badgeMode, setBadgeMode] = useState<'percent' | 'dollar'>('percent');

  const existingTickers = holdings.map((h) => h.ticker);
  const watchlistPreview = WATCHLIST_CANDIDATES.slice(0, 5);

  const toggleBadgeMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBadgeMode((prev) => (prev === 'percent' ? 'dollar' : 'percent'));
  };

  return (
    <div className="space-y-6">
      {/* Stocks / Holdings List */}
      <div className="border border-slate-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#0c1015] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Stocks
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              {holdings.length}
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Add stock"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {holdings.map((h) => {
            const isUp = (h.dayChangePercent ?? 0) >= 0;
            const badgeBg = isUp ? 'bg-[#00c805] text-black' : 'bg-[#ff5000] text-white';

            return (
              <div
                key={h.ticker}
                onClick={() => onSelectHolding(h)}
                className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
              >
                {/* Left: Ticker & Allocation */}
                <div className="min-w-0">
                  <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white block group-hover:text-[#00c805] transition-colors">
                    {h.ticker}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                    {h.allocation}% weight &middot; {h.marketCap || 'N/A'}
                  </span>
                </div>

                {/* Center: Sparkline */}
                <div className="hidden sm:block shrink-0">
                  <Sparkline data={h.priceHistory} width={64} height={20} />
                </div>

                {/* Right: Price & Robinhood signature badge */}
                <div className="flex items-center gap-2.5 shrink-0 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      ${h.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Target: ${h.targetPrice ? h.targetPrice.toFixed(0) : 'N/A'}
                    </span>
                  </div>

                  {/* The famous Robinhood badge: click to toggle between % and $ */}
                  <button
                    onClick={toggleBadgeMode}
                    className={`min-w-[62px] min-h-[28px] px-2 py-1 rounded-md text-[11px] font-mono font-bold flex items-center justify-center transition-transform active:scale-95 shadow-sm ${badgeBg}`}
                    title="Click to toggle between percentage and dollar gain"
                  >
                    {badgeMode === 'percent' ? (
                      <span>
                        {isUp ? '+' : ''}
                        {(h.dayChangePercent ?? 0).toFixed(2)}%
                      </span>
                    ) : (
                      <span>
                        {isUp ? '+' : ''}$
                        {Math.abs(h.dayChange ?? 0).toFixed(2)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Robinhood Integrated Watchlist Section */}
      <div className="border border-slate-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#0c1015] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00c805]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tactical Watchlist
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            KPEG Radar
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {watchlistPreview.map((stock) => {
            const isAdded = existingTickers.includes(stock.ticker);
            return (
              <div
                key={stock.ticker}
                className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white block">
                    {stock.ticker}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {stock.name} &middot; {stock.marketCap}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block tabular-nums">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono font-bold block">
                      +{stock.upside}% target
                    </span>
                  </div>

                  {isAdded ? (
                    <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <button
                      onClick={() =>
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
                          risks: ['Market volatility'],
                        })
                      }
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-[#00c805] hover:text-[#00c805] flex items-center justify-center transition-colors"
                      title="Add to portfolio"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
