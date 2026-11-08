import React, { useState, useRef } from 'react';
import { 
  RefreshCw, Play, Pause, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, Grid, Sparkles 
} from 'lucide-react';
import { Holding, LiveMarketStatus } from '../types/portfolio';
import { Sparkline } from './Sparkline';

interface LiveTickerBarProps {
  holdings: Holding[];
  status: LiveMarketStatus;
  tickCounter: number;
  onToggleStreaming: () => void;
  onSetIntervalSeconds: (sec: number) => void;
  onFetchRealMarket: () => void;
  onSelectHolding: (holding: Holding) => void;
}

export const LiveTickerBar: React.FC<LiveTickerBarProps> = ({
  holdings,
  status,
  tickCounter,
  onToggleStreaming,
  onSetIntervalSeconds,
  onFetchRealMarket,
  onSelectHolding,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950/95 border-b border-slate-800 text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Live Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            {status.isStreaming ? (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            )}
            <span className="font-bold text-[11px] tracking-wide uppercase font-mono">
              {status.isStreaming ? 'LIVE FEED' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Play/Pause Button */}
            <button
              onClick={onToggleStreaming}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                status.isStreaming
                  ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              }`}
              title={status.isStreaming ? 'Pause Real-Time Updates' : 'Resume Real-Time Updates'}
            >
              {status.isStreaming ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-black/60 rounded-full p-0.5 border border-white/10">
              {[2, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onSetIntervalSeconds(sec)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                    status.intervalSeconds === sec
                      ? 'bg-[#00c805] text-black shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Update every ${sec} seconds`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {/* Sync Real Market Button */}
            <button
              onClick={onFetchRealMarket}
              disabled={status.isFetching}
              className="min-h-[32px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors flex items-center gap-1.5 text-[11px] font-bold disabled:opacity-50"
              title="Sync with real-world NYSE/NASDAQ market quotes"
            >
              <RefreshCw className={`w-3 h-3 ${status.isFetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Market</span>
            </button>
          </div>
        </div>

        {/* Right: Scrolling Tape with Scroll Arrows + "View All Symbols" Button */}
        <div className="w-full md:w-auto flex items-center gap-1.5 justify-between md:justify-end">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="min-h-[30px] min-w-[30px] p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center shrink-0"
            title="Scroll left to see preceding symbols"
            aria-label="Scroll left symbols"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrolling Tape of Holdings */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 py-0.5 max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl scroll-smooth"
          >
            {holdings.map((h) => {
              const isUp = (h.dayChangePercent ?? 0) >= 0;
              const flashClass =
                h.lastTickDirection === 'up'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : h.lastTickDirection === 'down'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'border-slate-800 bg-slate-900/60';

              return (
                <button
                  key={h.ticker}
                  onClick={() => onSelectHolding(h)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border hover:border-slate-600 hover:bg-slate-800 transition-all shrink-0 ${flashClass}`}
                  title={`${h.name} - Click for full thesis & metrics`}
                >
                  <span className="font-mono font-black text-blue-400 text-xs">
                    {h.ticker}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-100 tabular-nums">
                    ${h.price.toFixed(2)}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold tabular-nums ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {(h.dayChangePercent ?? 0).toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="min-h-[30px] min-w-[30px] p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center shrink-0"
            title="Scroll right to see more symbols"
            aria-label="Scroll right symbols"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* "View All Symbols" Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`min-h-[32px] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
              isExpanded
                ? 'bg-[#00c805] border-[#00c805] text-black shadow-md shadow-[#00c805]/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-[#00c805] hover:text-white'
            }`}
            title="Toggle grid showing all portfolio symbols at once"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="font-mono">{isExpanded ? 'Hide' : `All (${holdings.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Multi-Column Grid of ALL symbols */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-black/95 px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                All {holdings.length} Active Portfolio Symbols (Real-Time Live Quotes)
              </span>
              <span>Click any symbol card to view full catalysts & thesis</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {holdings.map((h) => {
                const isUp = (h.dayChangePercent ?? 0) >= 0;
                return (
                  <button
                    key={h.ticker}
                    onClick={() => {
                      onSelectHolding(h);
                      setIsExpanded(false);
                    }}
                    className="p-3 rounded-2xl border border-white/10 bg-[#0c1015] hover:border-[#00c805] text-left transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div>
                        <span className="font-mono font-black text-white group-hover:text-[#00c805] text-sm transition-colors">
                          {h.ticker}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-[100px]">
                          {h.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {h.allocation}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        ${h.price.toFixed(2)}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold tabular-nums ${
                          isUp ? 'text-[#00c805]' : 'text-[#ff5000]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {(h.dayChangePercent ?? 0).toFixed(2)}%
                      </span>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Cap: <strong className="text-slate-300 font-mono">{h.marketCap || 'N/A'}</strong></span>
                      <Sparkline data={h.priceHistory} width={42} height={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
