import React, { useState } from 'react';
import { 
  Sparkles, Info, ChevronRight, Zap, Target
} from 'lucide-react';
import { Holding } from '../types/portfolio';

interface KpegTabProps {
  holdings: Holding[];
  onSelectHolding: (holding: Holding) => void;
  onApplyOptimalKpegWeights: () => void;
}

export const KpegTab: React.FC<KpegTabProps> = ({
  holdings,
  onSelectHolding,
  onApplyOptimalKpegWeights,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Filter top asymmetric mispricings (lowest KPEG)
  const sortedByKpeg = [...holdings].sort((a, b) => a.kpeg - b.kpeg);
  const lowestKpeg = sortedByKpeg.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c805] animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                KPEG Strategy & Valuation Theses
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] mt-1">
              Personalized Growth-to-Valuation ratios evaluating asymmetrical risk-reward setups for 2026–2027.
            </p>
          </div>

          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-700 dark:text-white hover:border-[#00c805] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Info className="w-4 h-4 text-[#00c805]" />
            <span>{showFormulaDetails ? 'Hide KPEG Logic' : 'How KPEG Works'}</span>
          </button>
        </div>

        {/* Expandable Explanation of KPEG */}
        {showFormulaDetails && (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#00c805]/30 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>Understanding the KPEG Metric</span>
            </h3>
            <p className="leading-relaxed text-[#8b949e]">
              Standard <strong className="text-white">PEG (Price/Earnings-to-Growth)</strong> treats all earnings equally and relies on backward-looking consensus. <strong className="text-white">KPEG (Kelly-adjusted Price-to-Earnings-Growth)</strong> incorporates margin leverage, catalyst timing, and asymmetric upside ratios:
            </p>
            <div className="p-3.5 rounded-xl bg-black border border-white/10 font-mono text-center text-xs sm:text-sm text-[#00c805] font-bold">
              KPEG = (Forward P/E) &divide; (Expected Cash Flow Growth % &times; Catalyst Conviction Factor)
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
              <li className="p-3 rounded-xl bg-black border border-white/10">
                <strong className="text-[#00c805] block mb-0.5 font-bold">KPEG &lt; 0.8: Deep Mispricing</strong>
                Substantial asymmetric margin of safety. Market underprices operational inflection (e.g. RDDT, RH).
              </li>
              <li className="p-3 rounded-xl bg-black border border-white/10">
                <strong className="text-white block mb-0.5 font-bold">KPEG 0.8 &ndash; 1.3: Optimal Growth</strong>
                Balanced compounding with proven durable moat and reasonable multiple (e.g. AMD, CRM).
              </li>
              <li className="p-3 rounded-xl bg-black border border-white/10">
                <strong className="text-amber-400 block mb-0.5 font-bold">KPEG &gt; 1.4: Premium Mega-Cap</strong>
                High-quality incumbent commanding multiple premium for infrastructure cash flows (e.g. META, NFLX).
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Featured Deep Dives: Top Asymmetric Mispricings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Primary Asymmetric Value Plays
          </h3>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            KPEG &le; 0.85 &middot; Highest Multiple Compression
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowestKpeg.map((item) => (
            <div
              key={item.ticker}
              onClick={() => onSelectHolding(item)}
              className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1015] hover:border-[#00c805]/50 shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00c805]/10 text-[#00c805] border border-[#00c805]/30">
                      {item.kpeg <= 0.5 ? 'Extreme Asymmetry' : 'Value Mispricing'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
                      <span className="font-mono text-[#00c805]">{item.ticker}</span>
                      <span>{item.name}</span>
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#00c805] block tabular-nums">
                      {item.kpeg}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">KPEG Ratio</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 pb-3 border-b border-slate-100 dark:border-white/10">
                  <span>Weight: <strong className="text-slate-800 dark:text-white font-mono">{item.allocation}%</strong></span>
                  <span>&middot;</span>
                  <span>Est. Upside: <strong className="text-[#00c805] font-mono font-bold">+{item.upside}%</strong></span>
                  <span>&middot;</span>
                  <span>Price: <strong className="font-mono text-slate-800 dark:text-white">${item.price.toFixed(2)}</strong></span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.thesis}
                </p>

                {item.catalysts && (
                  <div className="space-y-1 bg-slate-50 dark:bg-black p-3 rounded-2xl border border-slate-200/60 dark:border-white/10">
                    <span className="text-[10px] font-bold text-[#00c805] uppercase tracking-wider block">
                      Core Catalyst
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {item.catalysts[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#00c805] font-semibold border-t border-slate-100 dark:border-white/5">
                <span>View Full Analysis &amp; Target</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Thematic Pillars */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Gabriel's Core Macro Investment Pillars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c805]" />
              <h4 className="text-xs font-bold text-[#00c805] uppercase tracking-wider">
                Semiconductors &amp; AI Compute
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>AMD (20%)</strong> &amp; <strong>META (15%)</strong> anchor data center expansions and hyperscaler inference workloads through 2027. Optical interconnect leader <strong>LITE (5%)</strong> provides critical high-bandwidth networking pick-and-shovel infrastructure.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c805]" />
              <h4 className="text-xs font-bold text-[#00c805] uppercase tracking-wider">
                Streaming &amp; Consumer Leisure
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>NFLX (15%)</strong> scales its high-margin advertising tier while <strong>WYNN (10%)</strong> captures luxury hospitality and the multi-billion-dollar UAE Al Marjan Island catalyst opening in 2027.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c805]" />
              <h4 className="text-xs font-bold text-[#00c805] uppercase tracking-wider">
                Enterprise &amp; Digital Banking
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>CRM (10%)</strong> unlocks autonomous Agentforce enterprise revenue, while <strong>SOFI (12%)</strong> drives banking deposit cross-selling benefits from interest rate easing cycles.
            </p>
          </div>
        </div>
      </div>

      {/* KPEG Rebalance Recommendation Assistant */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-black border-[#00c805]/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00c805] text-black">
              Tactical Rebalancing Strategy
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
              Kelly-Optimal Weight Optimization
            </h3>
            <p className="text-xs text-[#8b949e]">
              Shift capital from higher-KPEG names to asymmetric mispricings (RH, RDDT, CRM) to boost expected upside while defending capital.
            </p>
          </div>

          <button
            onClick={onApplyOptimalKpegWeights}
            className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#00c805] hover:bg-[#00b004] text-black font-extrabold text-xs shadow-lg shadow-[#00c805]/20 transition-all active:scale-95 shrink-0"
          >
            Apply Tactical Rebalance
          </button>
        </div>
      </div>
    </div>
  );
};
