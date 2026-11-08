import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Sliders, ShieldCheck, Zap } from 'lucide-react';

interface SimulationTabProps {
  darkMode: boolean;
}

export const SimulationTab: React.FC<SimulationTabProps> = ({ darkMode }) => {
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [monthlyDca, setMonthlyDca] = useState<number>(1000);
  const [timeHorizon, setTimeHorizon] = useState<number>(2); // 1 to 5 years
  const [scenario, setScenario] = useState<'aggressive' | 'balanced' | 'defensive' | 'custom'>('balanced');
  const [customRate, setCustomRate] = useState<number>(14);
  const [showVolatilityCone, setShowVolatilityCone] = useState<boolean>(true);

  // Return rate based on scenario
  const annualRate = useMemo(() => {
    switch (scenario) {
      case 'aggressive':
        return 0.16; // 16% CAGR
      case 'balanced':
        return 0.12; // 12% CAGR
      case 'defensive':
        return 0.06; // 6% CAGR
      case 'custom':
        return customRate / 100;
      default:
        return 0.12;
    }
  }, [scenario, customRate]);

  // Simulation calculations with compound interest & monthly DCA
  const { chartData, projectedValue, totalContributions, totalGain, breakdownLedger } = useMemo(() => {
    let currentBalance = initialCapital;
    let totalDeposited = initialCapital;
    let upperBalance = initialCapital;
    let lowerBalance = initialCapital;

    const data = [
      {
        year: 'Start',
        yearNum: 0,
        Projected: Math.round(initialCapital),
        Contributions: Math.round(initialCapital),
        BullScenario: Math.round(initialCapital),
        BearScenario: Math.round(initialCapital),
      }
    ];

    const ledger = [
      {
        year: 0,
        startBalance: initialCapital,
        contributions: 0,
        gains: 0,
        endBalance: initialCapital,
      }
    ];

    const annualDca = monthlyDca * 12;

    for (let y = 1; y <= timeHorizon; y++) {
      const yearStart = currentBalance;
      const r = annualRate;
      const rMonthly = r / 12;
      const compoundedStart = currentBalance * Math.pow(1 + r, 1);
      const fvAnnuity = rMonthly > 0 
        ? monthlyDca * ((Math.pow(1 + rMonthly, 12) - 1) / rMonthly)
        : annualDca;
      
      const yearEnd = compoundedStart + fvAnnuity;
      const yearGains = yearEnd - yearStart - annualDca;

      currentBalance = yearEnd;
      totalDeposited += annualDca;

      // Bull (+40% higher return) & Bear (50% lower return or drawdown)
      const bullRate = r * 1.4 + 0.04;
      const bearRate = Math.max(-0.05, r * 0.45);
      upperBalance = upperBalance * (1 + bullRate) + annualDca;
      lowerBalance = lowerBalance * (1 + bearRate) + annualDca;

      data.push({
        year: `Year ${y}`,
        yearNum: y,
        Projected: Math.round(currentBalance),
        Contributions: Math.round(totalDeposited),
        BullScenario: Math.round(upperBalance),
        BearScenario: Math.round(lowerBalance),
      });

      ledger.push({
        year: y,
        startBalance: yearStart,
        contributions: annualDca,
        gains: yearGains,
        endBalance: currentBalance,
      });
    }

    const netGain = currentBalance - totalDeposited;

    return {
      chartData: data,
      projectedValue: currentBalance,
      totalContributions: totalDeposited,
      totalGain: netGain,
      breakdownLedger: ledger,
    };
  }, [initialCapital, monthlyDca, timeHorizon, annualRate]);

  const capitalPresets = [25000, 50000, 100000, 250000];

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00c805]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tactical 1–5 Year Capital Projection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e]">
            Simulate portfolio growth with compound compounding, dollar-cost averaging (DCA), and tactical market trajectories.
          </p>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Initial Capital */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Initial Investment
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
              <input
                type="number"
                min="1000"
                step="5000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Math.max(0, Number(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-mono font-bold text-base focus:border-[#00c805] focus:outline-none transition-colors"
              />
            </div>
            {/* Quick chips */}
            <div className="flex gap-1.5 pt-1">
              {capitalPresets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInitialCapital(amt)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                    initialCapital === amt
                      ? 'bg-[#00c805] border-[#00c805] text-black font-bold shadow-sm'
                      : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ${amt / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Monthly DCA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Monthly Contribution (DCA)
              </label>
              <span className="font-mono text-xs font-bold text-[#00c805] tabular-nums">
                ${monthlyDca.toLocaleString()}/mo
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
              <input
                type="number"
                min="0"
                step="250"
                value={monthlyDca}
                onChange={(e) => setMonthlyDca(Math.max(0, Number(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-mono font-bold text-base focus:border-[#00c805] focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Total DCA over {timeHorizon}Y: <strong className="text-slate-700 dark:text-slate-200 font-mono">${(monthlyDca * 12 * timeHorizon).toLocaleString()}</strong>
            </p>
          </div>

          {/* Time Horizon Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Time Horizon
              </label>
              <span className="font-mono text-xs font-bold text-[#00c805]">
                {timeHorizon} {timeHorizon === 1 ? 'Year' : 'Years'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#00c805] my-3"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1 Year</span>
              <span>2 Years</span>
              <span>3 Years</span>
              <span>5 Years</span>
            </div>
          </div>
        </div>

        {/* Growth Scenarios */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Market Trajectory Scenario
            </label>
            <button
              onClick={() => setShowVolatilityCone(!showVolatilityCone)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                showVolatilityCone
                  ? 'bg-[#00c805]/10 border-[#00c805]/40 text-[#00c805]'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              {showVolatilityCone ? '✓ Bull/Bear Bands On' : '+ Show Range Cone'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'aggressive', label: 'Aggressive', rate: '16.0% CAGR', desc: 'AI cycle acceleration' },
              { id: 'balanced', label: 'Balanced', rate: '12.0% CAGR', desc: 'Historical tech thesis' },
              { id: 'defensive', label: 'Defensive', rate: '6.0% CAGR', desc: 'Market consolidation' },
              { id: 'custom', label: 'Custom', rate: `${customRate.toFixed(1)}% CAGR`, desc: 'User-specified rate' },
            ].map((scen) => (
              <button
                key={scen.id}
                onClick={() => setScenario(scen.id as any)}
                className={`min-h-[56px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  scenario === scen.id
                    ? 'bg-[#00c805] border-[#00c805] text-black shadow-lg shadow-[#00c805]/20'
                    : 'bg-slate-50 dark:bg-black/60 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold">{scen.label}</span>
                  <span className={`font-mono text-xs font-bold tabular-nums ${scenario === scen.id ? 'text-black' : 'text-[#00c805]'}`}>{scen.rate}</span>
                </div>
                <span className={`text-[10px] truncate ${scenario === scen.id ? 'text-black/80 font-medium' : 'opacity-70'}`}>{scen.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom CAGR Slider if custom is chosen */}
          {scenario === 'custom' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                Custom CAGR:
              </span>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#00c805]"
              />
              <span className="font-mono font-bold text-sm text-[#00c805] shrink-0 w-16 text-right tabular-nums">
                {customRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Big Calculated Output Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Invested
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-slate-900 dark:text-white tabular-nums">
              ${totalContributions.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-500">Principal + {timeHorizon}Y DCA</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Projected Value ({timeHorizon}Y)
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-[#00c805] tabular-nums">
              ${Math.round(projectedValue).toLocaleString()}
            </p>
            <span className="text-[11px] text-[#00c805] font-semibold">
              {(annualRate * 100).toFixed(1)}% Compound Rate
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Net Gain
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-[#00c805] tabular-nums">
              +${Math.round(totalGain).toLocaleString()}
            </p>
            <span className="text-[11px] text-[#00c805] font-semibold">
              +{((totalGain / totalContributions) * 100).toFixed(1)}% Total ROI
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg Annual Gain
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-slate-900 dark:text-white tabular-nums">
              +${Math.round(totalGain / timeHorizon).toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-500">Per Year Average</span>
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="p-4 sm:p-6 rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Portfolio Growth Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Scenario: <strong className="text-white">{scenario.toUpperCase()}</strong> @ {(annualRate * 100).toFixed(1)}% annual rate over {timeHorizon} years
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c805]" />
              <span className="text-slate-400">Projected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500" />
              <span className="text-slate-400">Total Invested</span>
            </div>
            {showVolatilityCone && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c805]/40" />
                <span className="text-slate-400">Bull/Bear Range</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-72 sm:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c805" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00c805" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c805" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00c805" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0'} />
              <XAxis 
                dataKey="year" 
                stroke={darkMode ? '#8b949e' : '#64748b'} 
                tick={{ fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke={darkMode ? '#8b949e' : '#64748b'} 
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip 
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ 
                  backgroundColor: darkMode ? '#000000' : '#ffffff', 
                  borderColor: darkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  color: darkMode ? '#ffffff' : '#000000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }} 
              />
              {showVolatilityCone && (
                <Area 
                  type="monotone" 
                  dataKey="BullScenario" 
                  name="Bullish Case" 
                  stroke="#00c805" 
                  strokeDasharray="4 4"
                  fill="url(#colorBull)" 
                />
              )}
              <Area 
                type="monotone" 
                dataKey="Projected" 
                name="Projected Value" 
                stroke="#00c805" 
                strokeWidth={3} 
                fill="url(#colorProjected)" 
              />
              <Area 
                type="monotone" 
                dataKey="Contributions" 
                name="Net Capital Added" 
                stroke="#8b949e" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
                fill="none" 
              />
              {showVolatilityCone && (
                <Area 
                  type="monotone" 
                  dataKey="BearScenario" 
                  name="Defensive Case" 
                  stroke="#ff5000" 
                  strokeDasharray="4 4"
                  fill="none" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annual Breakdown Ledger */}
      <div className="rounded-3xl border bg-white dark:bg-[#0c1015] border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Year-by-Year Compound Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8b949e]">
            Chronological accounting of contributions, cumulative investment returns, and year-end balance
          </p>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="min-w-[600px] w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 sm:p-4">Period</th>
                <th className="p-3.5 sm:p-4">Starting Balance</th>
                <th className="p-3.5 sm:p-4">Annual Additions (DCA)</th>
                <th className="p-3.5 sm:p-4">Compounded Gains</th>
                <th className="p-3.5 sm:p-4 text-right">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {breakdownLedger.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white">
                    {row.year === 0 ? 'Baseline' : `Year ${row.year}`}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-600 dark:text-slate-300 tabular-nums">
                    ${Math.round(row.startBalance).toLocaleString()}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-600 dark:text-slate-300 tabular-nums">
                    {row.contributions > 0 ? `+$${Math.round(row.contributions).toLocaleString()}` : '$0'}
                  </td>
                  <td className="p-3.5 sm:p-4 text-[#00c805] font-semibold tabular-nums">
                    {row.gains > 0 ? `+$${Math.round(row.gains).toLocaleString()}` : '$0'}
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white text-right tabular-nums">
                    ${Math.round(row.endBalance).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
