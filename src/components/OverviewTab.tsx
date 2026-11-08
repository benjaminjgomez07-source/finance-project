import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ReferenceLine
} from 'recharts';
import { 
  Search, SlidersHorizontal, ArrowUpDown, ChevronRight, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, ShieldCheck, Zap
} from 'lucide-react';
import { Sparkline } from './Sparkline';
import { RobinhoodHero } from './RobinhoodHero';
import { RobinhoodStocksList } from './RobinhoodStocksList';
import { Holding } from '../types/portfolio';
import { COLOR_PALETTE, SECTOR_COLORS } from '../data/defaultPortfolio';

interface OverviewTabProps {
  holdings: Holding[];
  darkMode: boolean;
  onSelectHolding: (holding: Holding) => void;
  onNormalizeAllocations: () => void;
  onOpenAddModal: () => void;
  onAddHolding: (holding: Holding) => void;
  onOpenSimulation: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  holdings,
  darkMode,
  onSelectHolding,
  onNormalizeAllocations,
  onOpenAddModal,
  onAddHolding,
  onOpenSimulation,
}) => {
  const [viewStyle, setViewStyle] = useState<'robinhood' | 'table'>('robinhood');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'allocation' | 'upside' | 'kpeg' | 'ticker'>('allocation');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [chartView, setChartView] = useState<'allocation' | 'matrix'>('allocation');

  // Aggregated calculations
  const totalAllocation = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.allocation, 0);
  }, [holdings]);

  const weightedKPEG = useMemo(() => {
    if (totalAllocation === 0) return '0.00';
    const sum = holdings.reduce((acc, h) => acc + (h.kpeg * (h.allocation / totalAllocation)), 0);
    return sum.toFixed(2);
  }, [holdings, totalAllocation]);

  const weightedUpside = useMemo(() => {
    if (totalAllocation === 0) return '0.0';
    const sum = holdings.reduce((acc, h) => acc + (h.upside * (h.allocation / totalAllocation)), 0);
    return sum.toFixed(1);
  }, [holdings, totalAllocation]);

  // Sector Aggregation
  const sectorData = useMemo(() => {
    const map: Record<string, number> = {};
    holdings.forEach((h) => {
      map[h.sector] = (map[h.sector] || 0) + h.allocation;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [holdings]);

  // Unique sectors for filtering
  const allSectors = useMemo(() => {
    return ['All', ...Array.from(new Set(holdings.map((h) => h.sector)))];
  }, [holdings]);

  const lowestKpegAsset = useMemo(() => {
    if (holdings.length === 0) return null;
    return [...holdings].sort((a, b) => a.kpeg - b.kpeg)[0];
  }, [holdings]);

  const coreTechWeight = useMemo(() => {
    return holdings
      .filter((h) => h.sector === 'Information Technology' || h.sector === 'Communication Services')
      .reduce((sum, h) => sum + h.allocation, 0);
  }, [holdings]);

  // Filtered and sorted holdings
  const filteredHoldings = useMemo(() => {
    return holdings
      .filter((h) => {
        const matchesSearch =
          h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.sector.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === 'All' || h.sector === selectedSector;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
      });
  }, [holdings, searchQuery, selectedSector, sortBy, sortOrder]);

  const toggleSort = (field: 'allocation' | 'upside' | 'kpeg' | 'ticker') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const scatterData = useMemo(() => {
    return holdings.map((h) => ({
      ticker: h.ticker,
      name: h.name,
      kpeg: h.kpeg,
      upside: h.upside,
      allocation: h.allocation,
      sector: h.sector,
    }));
  }, [holdings]);

  return (
    <div className="space-y-6">
      {/* Allocation Alert if != 100% */}
      {Math.abs(totalAllocation - 100) > 0.1 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium">
              Portfolio allocations total <strong>{totalAllocation}%</strong> (target is 100%).
            </span>
          </div>
          <button
            onClick={onNormalizeAllocations}
            className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-colors shrink-0"
          >
            Normalize to 100%
          </button>
        </div>
      )}

      {/* Robinhood 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Portfolio Hero, Charts & Research) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* 1. Robinhood Signature Hero: Big Balance & Clean Line Chart */}
          <RobinhoodHero
            holdings={holdings}
            darkMode={darkMode}
            onSelectHolding={onSelectHolding}
            onOpenSimulation={onOpenSimulation}
          />

          {/* 2. Executive Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Weighted KPEG
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums block mt-0.5">
                {weightedKPEG}
              </span>
              <span className="text-[11px] text-[#00c805] font-semibold">Growth Benchmark</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                1-2Y Est. Upside
              </span>
              <span className="text-2xl font-extrabold font-mono text-[#00c805] tabular-nums block mt-0.5">
                +{weightedUpside}%
              </span>
              <span className="text-[11px] text-slate-400">Consensus Weighted</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tech Concentration
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums block mt-0.5">
                {coreTechWeight}%
              </span>
              <span className="text-[11px] text-slate-400">AMD + META + CRM</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Top Asymmetric Play
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white block mt-0.5">
                {lowestKpegAsset?.ticker || 'RH'}
              </span>
              <span className="text-[11px] text-[#00c805] font-mono font-bold">
                +{lowestKpegAsset?.upside || 226}% ({lowestKpegAsset?.kpeg || 0.35})
              </span>
            </div>
          </div>

          {/* 3. Visualizations: Allocation Donut or KPEG Matrix */}
          <div className="border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0c1015] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartView('allocation')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    chartView === 'allocation'
                      ? 'bg-[#00c805] text-black shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Asset Weights
                </button>
                <button
                  onClick={() => setChartView('matrix')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    chartView === 'matrix'
                      ? 'bg-[#00c805] text-black shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  KPEG Matrix
                </button>
              </div>
              <span className="text-xs text-slate-400">
                {chartView === 'allocation' ? `${holdings.length} Positions` : 'Asymmetric Upside'}
              </span>
            </div>

            {chartView === 'allocation' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={holdings}
                        dataKey="allocation"
                        nameKey="ticker"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={3}
                        onClick={(entry: any) => {
                          const ticker = entry?.ticker || entry?.payload?.ticker || entry?.name;
                          const found = holdings.find((h) => h.ticker === ticker);
                          if (found) onSelectHolding(found);
                        }}
                        cursor="pointer"
                      >
                        {holdings.map((entry, index) => (
                          <Cell 
                            key={`cell-${entry.ticker}`} 
                            fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} 
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(val: any, name: any) => [`${val}% Weight`, `${name}`]}
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#000000' : '#ffffff', 
                          borderColor: darkMode ? '#222' : '#cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg KPEG</span>
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                      {weightedKPEG}
                    </span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {holdings.map((h, idx) => (
                    <div 
                      key={h.ticker}
                      onClick={() => onSelectHolding(h)}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }} 
                        />
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{h.ticker}</span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[100px]">{h.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                        {h.allocation}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                    <XAxis 
                      type="number" 
                      dataKey="kpeg" 
                      domain={[0, 2.0]}
                      stroke={darkMode ? '#94a3b8' : '#64748b'} 
                      tick={{ fontSize: 11 }}
                      label={{ value: 'KPEG (Lower = Better)', position: 'insideBottom', offset: -10, fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="upside" 
                      domain={[-50, 350]}
                      stroke={darkMode ? '#94a3b8' : '#64748b'} 
                      tick={{ fontSize: 11 }}
                      label={{ value: 'Upside %', angle: -90, position: 'insideLeft', fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }}
                    />
                    <ZAxis type="number" dataKey="allocation" range={[60, 400]} />
                    <ReferenceLine x={1.0} stroke="#f59e0b" strokeDasharray="3 3" />
                    <ReferenceLine y={50} stroke="#00c805" strokeDasharray="3 3" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: darkMode ? '#000' : '#fff', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Scatter 
                      data={scatterData} 
                      fill="#00c805"
                      onClick={(entry: any) => {
                        const ticker = entry?.ticker || entry?.payload?.ticker;
                        const found = holdings.find((h) => h.ticker === ticker);
                        if (found) onSelectHolding(found);
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 4. Analyst Research & Core Catalysts (Robinhood "News" Style) */}
          <div className="border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0c1015] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tactical 2027 Research &amp; Catalysts
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {holdings.slice(0, 4).map((h) => (
                <div
                  key={h.ticker}
                  onClick={() => onSelectHolding(h)}
                  className="py-3.5 first:pt-0 last:pb-0 cursor-pointer hover:opacity-85 transition-opacity group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono font-bold text-[#00c805]">{h.ticker} &middot; {h.sector}</span>
                    <span className="font-mono">{h.kpeg <= 0.8 ? '★ High Conviction Value' : 'Core Compounder'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#00c805] transition-colors">
                    {h.name}: {h.catalysts ? h.catalysts[0] : h.thesis}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {h.thesis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Robinhood Stocks List & Watchlist) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <RobinhoodStocksList
            holdings={holdings}
            onSelectHolding={onSelectHolding}
            onOpenAddModal={onOpenAddModal}
            onAddHolding={onAddHolding}
          />
        </div>
      </div>
    </div>
  );
};
