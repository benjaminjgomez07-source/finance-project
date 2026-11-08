import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, ChevronRight, DollarSign, Wallet, ShieldCheck, Sparkles } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface RobinhoodHeroProps {
  holdings: Holding[];
  darkMode: boolean;
  onSelectHolding: (holding: Holding) => void;
  onOpenSimulation: () => void;
}

type Timeframe = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL';

export const RobinhoodHero: React.FC<RobinhoodHeroProps> = ({
  holdings,
  darkMode,
  onSelectHolding,
  onOpenSimulation,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoveredData, setHoveredData] = useState<{ value: number; label: string } | null>(null);
  const [isBuyingPowerOpen, setIsBuyingPowerOpen] = useState<boolean>(false);

  // Compute total portfolio value from initial standard capital base ($100,000)
  const baseCapital = 100000;
  
  // Calculate today's aggregate weighted dollar change and percent change
  const { totalValue, dayChangeDollar, dayChangePercent } = useMemo(() => {
    let dayPnlDollar = 0;
    holdings.forEach((h) => {
      const positionValue = baseCapital * (h.allocation / 100);
      const stockChangePct = (h.dayChangePercent ?? 0) / 100;
      dayPnlDollar += positionValue * stockChangePct;
    });

    const currentPortfolioValue = baseCapital + dayPnlDollar;
    const currentPortfolioChangePct = (dayPnlDollar / baseCapital) * 100;

    return {
      totalValue: currentPortfolioValue,
      dayChangeDollar: dayPnlDollar,
      dayChangePercent: currentPortfolioChangePct,
    };
  }, [holdings]);

  const isPositive = (hoveredData ? hoveredData.value >= baseCapital : dayChangeDollar >= 0);
  const themeColor = isPositive ? '#00c805' : '#ff5000';

  // Generate historical curve based on selected timeframe
  const chartPoints = useMemo(() => {
    const pointsCount = timeframe === '1D' ? 24 : timeframe === '1W' ? 28 : timeframe === '1M' ? 30 : 36;
    const points = [];
    const base = baseCapital;
    const trend = isPositive ? 1 : -0.5;

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      // Realistic random walk leading up to current totalValue
      const randomNoise = (Math.sin(i * 0.8) + Math.cos(i * 1.4)) * 600;
      const val = base + (dayChangeDollar * progress) + randomNoise * (1 - progress);
      
      let label = '';
      if (timeframe === '1D') {
        const hour = 9.5 + (i / pointsCount) * 6.5;
        const hFloor = Math.floor(hour);
        const m = Math.round((hour - hFloor) * 60);
        label = `${hFloor > 12 ? hFloor - 12 : hFloor}:${m < 10 ? '0' : ''}${m} ${hFloor >= 12 ? 'PM' : 'AM'} EDT`;
      } else if (timeframe === '1W') {
        label = `Day ${i + 1}`;
      } else {
        label = `Point ${i + 1}`;
      }

      points.push({
        index: i,
        label,
        value: Math.round(i === pointsCount - 1 ? totalValue : val),
      });
    }

    return points;
  }, [timeframe, totalValue, dayChangeDollar, isPositive]);

  const displayValue = hoveredData ? hoveredData.value : totalValue;
  const displayChangeDollar = hoveredData ? hoveredData.value - baseCapital : dayChangeDollar;
  const displayChangePercent = (displayChangeDollar / baseCapital) * 100;
  const displayLabel = hoveredData ? hoveredData.label : (timeframe === '1D' ? 'Today' : timeframe);

  return (
    <div className="space-y-4">
      {/* Robinhood Big Balance Header */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans tabular-nums">
            ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Real-time Day Change line with signature Robinhood color */}
        <div className="flex items-center gap-2 text-sm sm:text-base font-bold font-sans">
          <span 
            className="flex items-center gap-1 tabular-nums"
            style={{ color: themeColor }}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>
              {displayChangeDollar >= 0 ? '+' : ''}
              ${Math.abs(displayChangeDollar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span>
              ({displayChangePercent >= 0 ? '+' : ''}
              {displayChangePercent.toFixed(2)}%)
            </span>
          </span>
          <span className="text-xs text-slate-400 font-medium">{displayLabel}</span>
        </div>
      </div>

      {/* Signature Robinhood Clean Line Chart (Zero Grid Lines) */}
      <div className="h-60 sm:h-72 w-full -mx-2 sm:mx-0 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartPoints}
            onMouseMove={(e: any) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setHoveredData({
                  value: e.activePayload[0].payload.value,
                  label: e.activePayload[0].payload.label,
                });
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <XAxis dataKey="index" hide />
            <YAxis domain={['dataMin - 500', 'dataMax + 500']} hide />
            <RechartsTooltip
              content={() => null}
              cursor={{ stroke: darkMode ? '#334155' : '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={themeColor}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 5, fill: themeColor, stroke: darkMode ? '#000' : '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Robinhood Timeframe Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {(['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={isActive ? { backgroundColor: themeColor } : {}}
              >
                {tf}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenSimulation}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#00c805] transition-colors flex items-center gap-1"
        >
          <span>Tactical Simulator</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Robinhood Buying Power Accordion Strip */}
      <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] p-4 transition-all">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsBuyingPowerOpen(!isBuyingPowerOpen)}
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#00c805]" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Buying Power
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              $25,000.00
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isBuyingPowerOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {isBuyingPowerOpen && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-slate-400 animate-fadeIn">
            <div className="flex justify-between">
              <span>Cash Available for DCA</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">$25,000.00</span>
            </div>
            <div className="flex justify-between">
              <span>Allocated Equities Capital</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={onOpenSimulation}
                className="px-3 py-1.5 rounded-full bg-[#00c805] text-black font-bold text-xs hover:bg-[#00b004] transition-all"
              >
                Simulate Monthly Additions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
