import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line 
} from 'recharts';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // View state: 'overview' | 'simulation' | 'kpeg'
  const [activeTab, setActiveTab] = useState('overview');

  // Mobile Table vs Card View switch
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Interactive Simulation State
  const [initialCapital, setInitialCapital] = useState(100000);
  const [timeHorizon, setTimeHorizon] = useState(2); // 1 to 5 years
  const [scenario, setScenario] = useState('balanced'); // 'aggressive', 'balanced', 'defensive'

  // Holdings Data from Gabriel's Portfolio
  const portfolioData = [
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Information Technology', allocation: 20, price: 449.04, upside: 37.0, kpeg: 1.15, thesis: 'AI hardware demand, data center expansion, and inference advantages.' },
    { ticker: 'NFLX', name: 'Netflix, Inc.', sector: 'Communication Services', allocation: 15, price: 63.41, upside: 48.8, kpeg: 1.47, thesis: 'Streaming dominance, ad-supported tier expansion, valuation rerating.' },
    { ticker: 'META', name: 'Meta Platforms, Inc.', sector: 'Communication Services', allocation: 15, price: 610.15, upside: -8.5, kpeg: 1.73, thesis: 'Accelerated AI infrastructure monetization and ad platform efficiency.' },
    { ticker: 'SOFI', name: 'SoFi Technologies, Inc.', sector: 'Financials', allocation: 12, price: 16.21, upside: -26.5, kpeg: 1.41, thesis: 'Digital banking growth, fintech platform expansion, interest rate easing.' },
    { ticker: 'CRM', name: 'Salesforce, Inc.', sector: 'Information Technology', allocation: 10, price: 213.65, upside: 116.0, kpeg: 0.81, thesis: 'Enterprise cloud software cash flows, Agentforce AI integration.' },
    { ticker: 'WYNN', name: 'Wynn Resorts, Limited', sector: 'Consumer Discretionary', allocation: 10, price: 83.11, upside: 29.3, kpeg: 1.01, thesis: 'Luxury hospitality recovery and robust international resort demand.' },
    { ticker: 'RDDT', name: 'Reddit, Inc.', sector: 'Communication Services', allocation: 8, price: 95.10, upside: 316.0, kpeg: 0.55, thesis: 'Data licensing, high-margin advertising growth, low KPEG mispricing.' },
    { ticker: 'LITE', name: 'Lumentum Holdings Inc.', sector: 'Information Technology', allocation: 5, price: 538.59, upside: 10.6, kpeg: 0.83, thesis: 'Optical networking components and M&A catalyst potential.' },
    { ticker: 'RH', name: 'RH (Restoration Hardware)', sector: 'Consumer Discretionary', allocation: 5, price: 130.96, upside: 226.2, kpeg: 0.35, thesis: 'Housing market cyclical recovery and luxury home furnishings leverage.' },
  ];

  // Sector Aggregation
  const sectorData = portfolioData.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.sector);
    if (existing) {
      existing.value += curr.allocation;
    } else {
      acc.push({ name: curr.sector, value: curr.allocation });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Calculate Weighted Portfolio KPEG Average
  const weightedKPEG = portfolioData.reduce((acc, curr) => acc + (curr.kpeg * (curr.allocation / 100)), 0).toFixed(2);

  // Return rates for simulation scenarios
  const getReturnRate = (scen) => {
    switch(scen) {
      case 'aggressive': return 0.16;
      case 'balanced': return 0.12;
      case 'defensive': return 0.06;
      default: return 0.12;
    }
  };

  const annualRate = getReturnRate(scenario);
  const projectedValue = initialCapital * Math.pow(1 + annualRate, timeHorizon);
  const totalGain = projectedValue - initialCapital;

  // Chart data for simulation over target years
  const simulationChartData = [];
  for (let y = 0; y <= timeHorizon; y++) {
    const val = initialCapital * Math.pow(1 + annualRate, y);
    simulationChartData.push({
      year: `Yr ${y}`,
      PortfolioValue: Math.round(val),
      InitialPrincipal: initialCapital
    });
  }

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white`}>
      
      {/* Top Mobile-First Sticky Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'} px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/30 flex-shrink-0">
            GP
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent truncate">
              Gabriel's Portfolio
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">Tactical 2027 Growth & KPEG Analytics</p>
          </div>
        </div>

        {/* Theme Toggle Button - Min 44px Touch Area */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border flex items-center justify-center text-xs font-semibold transition-all ${
            darkMode 
              ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800 active:scale-95' 
              : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
          }`}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Touch-Optimized Segmented Navigation Bar */}
      <div className={`sticky top-[65px] z-40 border-b px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <nav className="flex space-x-2 min-w-max">
          {[
            { id: 'overview', label: '📊 Portfolio Overview' },
            { id: 'simulation', label: '📈 1-2Y Simulation' },
            { id: 'kpeg', label: '💡 KPEG Theses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : darkMode 
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Container - Responsive Padding for Mobile & Desktop */}
      <main className="max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-8 space-y-6">
        
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW PAGE                                      */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Executive Summary Cards: Mobile Stack (1-Col) to Tablet/Desktop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Holdings</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">9 Assets</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">100% Allocated</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Target Horizon: 1–2 Years</p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weighted KPEG Avg</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400">{weightedKPEG}</h3>
                  <span className="text-xs text-blue-400 font-medium">Growth Value</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Personalized PEG Benchmark</p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Value Mispricing</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">RH</h3>
                  <span className="text-xs text-emerald-400 font-bold">+226.2% Upside</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Lowest KPEG (0.35)</p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Tech Concentration</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-400">35%</h3>
                  <span className="text-xs text-indigo-400 font-medium">AMD + META</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Semiconductors & AI Infra</p>
              </div>
            </div>

            {/* Charts Row: Single Column on Mobile, 2 Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pie Allocation Chart */}
              <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold mb-3 flex items-center justify-between">
                  <span>Asset Weight Breakdown</span>
                  <span className="text-xs font-normal text-slate-400">Top 9 Holdings</span>
                </h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        dataKey="allocation"
                        nameKey="ticker"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        innerRadius={50}
                        paddingAngle={3}
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legend Chips for Mobile Touch Legibility */}
                <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-slate-800">
                  {portfolioData.map((item, idx) => (
                    <div key={item.ticker} className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs ${darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-100'}`}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="font-mono font-bold">{item.ticker}</span>
                      <span className="text-slate-400">({item.allocation}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector Progress Bars & Horizontal Bar Chart */}
              <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold mb-4">Sector Distribution</h3>
                <div className="space-y-4">
                  {sectorData.map((sec, idx) => (
                    <div key={sec.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-slate-300">{sec.name}</span>
                        <span className="font-mono text-blue-400">{sec.value}%</span>
                      </div>
                      <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-100'}`}>
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${sec.value}%`, 
                            backgroundColor: COLORS[idx % COLORS.length] 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Holdings Section: Mobile Touch Cards vs Responsive Table Toggle */}
            <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">Portfolio Asset Metrics</h3>
                  <p className="text-xs text-slate-400">Detailed allocations, estimated upsides & KPEG valuations</p>
                </div>
                
                {/* Card vs Table View Selector Switch */}
                <div className={`p-1 rounded-xl border flex space-x-1 self-start sm:self-auto ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'cards' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎴 Cards View
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'table' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📋 Full Table
                  </button>
                </div>
              </div>

              {/* VIEW 1: Mobile-Optimized Touch Cards */}
              {viewMode === 'cards' && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioData.map((item) => (
                    <div 
                      key={item.ticker} 
                      className={`p-4 rounded-xl border transition-all ${
                        darkMode 
                          ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-lg font-black font-mono text-blue-400">{item.ticker}</span>
                          <h4 className="text-xs font-medium text-slate-400 line-clamp-1">{item.name}</h4>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.allocation}% Weight
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-800/60">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Est. Upside</span>
                          <span className={`font-bold font-mono text-sm ${item.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.upside >= 0 ? `+${item.upside}%` : `${item.upside}%`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">KPEG Ratio</span>
                          <span className={`font-bold font-mono text-sm ${item.kpeg < 0.8 ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {item.kpeg}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {item.thesis}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: Horizontal Scroll Protected Full Table */}
              {viewMode === 'table' && (
                <div className="w-full overflow-x-auto no-scrollbar">
                  <table className="min-w-[650px] w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'border-slate-800 text-slate-400 bg-slate-950/80' : 'border-slate-200 text-slate-500 bg-slate-100'}`}>
                        <th className="p-3 sm:p-4">Ticker</th>
                        <th className="p-3 sm:p-4">Company</th>
                        <th className="p-3 sm:p-4">Allocation</th>
                        <th className="p-3 sm:p-4">Est. Upside</th>
                        <th className="p-3 sm:p-4">KPEG</th>
                        <th className="p-3 sm:p-4">Sector</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {portfolioData.map((item) => (
                        <tr key={item.ticker} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                          <td className="p-3 sm:p-4 font-bold font-mono text-blue-400">{item.ticker}</td>
                          <td className="p-3 sm:p-4 font-medium text-slate-200">{item.name}</td>
                          <td className="p-3 sm:p-4 font-semibold">{item.allocation}%</td>
                          <td className={`p-3 sm:p-4 font-bold font-mono ${item.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.upside >= 0 ? `+${item.upside}%` : `${item.upside}%`}
                          </td>
                          <td className="p-3 sm:p-4 font-mono font-bold">{item.kpeg}</td>
                          <td className="p-3 sm:p-4 text-slate-400 text-xs">{item.sector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INTERACTIVE SIMULATION                              */}
        {/* ========================================================= */}
        {activeTab === 'simulation' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-lg sm:text-xl font-bold mb-1">1–2 Year Risk-Return Simulation</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">Test tactical capital growth scenarios tailored to your 1-2 year portfolio horizon.</p>

              {/* Mobile-First Input Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                
                {/* Capital Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Initial Investment ($)</label>
                  <input 
                    type="number" 
                    value={initialCapital} 
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    className={`min-h-[44px] w-full px-4 py-2.5 rounded-xl border font-mono text-base font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-black'}`}
                    step="5000"
                    min="1000"
                  />
                </div>

                {/* Horizon Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-300">Time Horizon</label>
                    <span className="text-xs font-mono font-bold text-blue-400">{timeHorizon} {timeHorizon === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={timeHorizon} 
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 my-3"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1 Year</span>
                    <span>3 Years</span>
                    <span>5 Years</span>
                  </div>
                </div>

                {/* Strategy Selector Buttons (Min 44px Height) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Growth Scenario</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'aggressive', label: 'Aggressive', rate: '16%' },
                      { id: 'balanced', label: 'Balanced', rate: '12%' },
                      { id: 'defensive', label: 'Defensive', rate: '6%' },
                    ].map((scen) => (
                      <button
                        key={scen.id}
                        onClick={() => setScenario(scen.id)}
                        className={`min-h-[44px] py-2 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center transition-all ${
                          scenario === scen.id 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30' 
                            : darkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{scen.label}</span>
                        <span className="text-[10px] opacity-80 font-mono">{scen.rate}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Calculated Outputs Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-800">
                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50'}`}>
                  <p className="text-[11px] font-medium text-slate-400">Starting Base</p>
                  <p className="text-xl sm:text-2xl font-extrabold font-mono mt-0.5">${initialCapital.toLocaleString()}</p>
                </div>
                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50'}`}>
                  <p className="text-[11px] font-medium text-slate-400">Projected Value ({timeHorizon}Y)</p>
                  <p className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">${Math.round(projectedValue).toLocaleString()}</p>
                </div>
                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50'}`}>
                  <p className="text-[11px] font-medium text-slate-400">Total Net Gain</p>
                  <p className="text-xl sm:text-2xl font-extrabold font-mono text-blue-400 mt-0.5">+${Math.round(totalGain).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Projection Chart */}
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-sm sm:text-base font-bold mb-4">Trajectory Projection ({scenario.toUpperCase()} @ {annualRate * 100}%)</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationChartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="year" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 12 }} />
                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 10 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="PortfolioValue" name="Projected Portfolio ($)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="InitialPrincipal" name="Initial Principal ($)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KPEG & THESIS DEEP-DIVE                            */}
        {/* ========================================================= */}
        {activeTab === 'kpeg' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-lg sm:text-xl font-bold mb-1">KPEG Strategy & Mispricing Theses</h2>
              <p className="text-xs sm:text-sm text-slate-400">Personalized Growth-to-Valuation ratios evaluating asymmetrical risk-reward setups.</p>
            </div>

            {/* Top Value Cards Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Lowest KPEG</span>
                    <h3 className="text-lg font-bold mt-1">RH (Restoration Hardware)</h3>
                  </div>
                  <span className="text-xl font-black font-mono text-emerald-400">0.35 KPEG</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Allocation: 5% | Projected Upside: <strong className="text-emerald-400">+226.2%</strong></p>
                <p className="text-xs leading-relaxed text-slate-300">
                  Leveraging housing market cyclical recovery and luxury furniture demand. Severe valuation compression provides asymmetrical upside for a 1-2 year rebound.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Data Licensing Play</span>
                    <h3 className="text-lg font-bold mt-1">Reddit, Inc. (RDDT)</h3>
                  </div>
                  <span className="text-xl font-black font-mono text-blue-400">0.55 KPEG</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Allocation: 8% | Projected Upside: <strong className="text-emerald-400">+316.0%</strong></p>
                <p className="text-xs leading-relaxed text-slate-300">
                  Monetizing platform content via high-margin AI licensing agreements paired with rapid ad revenue growth. Exceptional upside potential driven by content scarcity.
                </p>
              </div>

            </div>

            {/* Core Catalysts Accordion Grid */}
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-base font-bold mb-4">Core Portfolio Catalysts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}>
                  <h4 className="font-bold text-xs text-blue-400 uppercase tracking-wider mb-2">⚡ Semiconductor & AI</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>AMD (20%)</strong> & <strong>META (15%)</strong> form the hardware backbone of data center expansions and AI inference monetization over the next 24 months.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}>
                  <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-2">🍿 Streaming & Consumer</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>NFLX (15%)</strong> & <strong>WYNN (10%)</strong> balance software margin leverage with global consumer discretionary leisure demand.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}>
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider mb-2">💼 Enterprise & Fintech</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>CRM (10%)</strong> & <strong>SOFI (12%)</strong> provide enterprise software cash flow stability combined with digital banking tailwinds.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`mt-8 border-t py-6 text-center text-xs text-slate-500 px-4 ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
        Gabriel's Portfolio Analytics Hub • Optimized for iPhone & Mobile Displays 2027
      </footer>

    </div>
  );
}