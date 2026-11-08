import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewTab } from './components/OverviewTab';
import { SimulationTab } from './components/SimulationTab';
import { KpegTab } from './components/KpegTab';
import { WatchlistTab } from './components/WatchlistTab';
import { HoldingModal } from './components/HoldingModal';
import { AddHoldingModal } from './components/AddHoldingModal';
import { ExportModal } from './components/ExportModal';
import { LiveTickerBar } from './components/LiveTickerBar';
import { useLivePrices } from './hooks/useLivePrices';
import { INITIAL_HOLDINGS } from './data/defaultPortfolio';
import { Holding } from './types/portfolio';

export default function App() {
  // Theme state with local persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gp_theme');
    return saved ? saved === 'dark' : true;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gp_theme', 'light');
    }
  }, [darkMode]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Holdings state with local persistence
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem('gp_holdings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved holdings', e);
    }
    return INITIAL_HOLDINGS;
  });

  // Save holdings to localStorage on change
  useEffect(() => {
    localStorage.setItem('gp_holdings', JSON.stringify(holdings));
  }, [holdings]);

  // Live market streaming engine
  const {
    status,
    tickCounter,
    toggleStreaming,
    setIntervalSeconds,
    fetchRealMarketPrices,
  } = useLivePrices(holdings, setHoldings);

  // Modals state
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSyncMarket = async () => {
    showNotification('Syncing quotes from NYSE / NASDAQ...');
    await fetchRealMarketPrices();
    showNotification('Market prices synced');
  };

  // Holding actions
  const handleUpdateAllocation = (ticker: string, newAllocation: number) => {
    setHoldings((prev) =>
      prev.map((h) => (h.ticker === ticker ? { ...h, allocation: newAllocation } : h))
    );
    showNotification(`Updated ${ticker} allocation to ${newAllocation}%`);
  };

  const handleDeleteHolding = (ticker: string) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
    showNotification(`Removed ${ticker} from portfolio`);
  };

  const handleAddHolding = (newHolding: Holding) => {
    setHoldings((prev) => {
      const existing = prev.find((h) => h.ticker === newHolding.ticker);
      if (existing) {
        return prev.map((h) =>
          h.ticker === newHolding.ticker ? { ...h, allocation: h.allocation + newHolding.allocation } : h
        );
      }
      return [...prev, newHolding];
    });
    showNotification(`Added ${newHolding.ticker} to portfolio`);
  };

  const handleNormalizeAllocations = () => {
    const currentSum = holdings.reduce((s, h) => s + h.allocation, 0);
    if (currentSum === 0) return;

    let remainder = 100;
    const normalized = holdings.map((h, idx) => {
      if (idx === holdings.length - 1) {
        return { ...h, allocation: remainder };
      }
      const newWeight = Math.round((h.allocation / currentSum) * 100);
      remainder -= newWeight;
      return { ...h, allocation: Math.max(1, newWeight) };
    });

    setHoldings(normalized);
    showNotification('Allocations normalized to 100%');
  };

  const handleResetPortfolio = () => {
    if (window.confirm("Reset all holdings back to Gabriel's baseline 9-stock portfolio?")) {
      setHoldings(INITIAL_HOLDINGS);
      showNotification("Restored Gabriel's baseline portfolio");
    }
  };

  const handleApplyOptimalKpegWeights = () => {
    // Kelly/KPEG optimal weighting:
    // Low KPEG assets (RH 0.35, RDDT 0.55, CRM 0.81, LITE 0.83) get overweight
    // Higher KPEG get slight trim
    const rebalanced: Holding[] = [
      { ...holdings.find((h) => h.ticker === 'RDDT') || INITIAL_HOLDINGS[6], allocation: 16 },
      { ...holdings.find((h) => h.ticker === 'RH') || INITIAL_HOLDINGS[8], allocation: 12 },
      { ...holdings.find((h) => h.ticker === 'CRM') || INITIAL_HOLDINGS[4], allocation: 15 },
      { ...holdings.find((h) => h.ticker === 'AMD') || INITIAL_HOLDINGS[0], allocation: 18 },
      { ...holdings.find((h) => h.ticker === 'NFLX') || INITIAL_HOLDINGS[1], allocation: 12 },
      { ...holdings.find((h) => h.ticker === 'META') || INITIAL_HOLDINGS[2], allocation: 10 },
      { ...holdings.find((h) => h.ticker === 'WYNN') || INITIAL_HOLDINGS[5], allocation: 7 },
      { ...holdings.find((h) => h.ticker === 'LITE') || INITIAL_HOLDINGS[7], allocation: 5 },
      { ...holdings.find((h) => h.ticker === 'SOFI') || INITIAL_HOLDINGS[3], allocation: 5 },
    ];
    setHoldings(rebalanced);
    setActiveTab('overview');
    showNotification('Applied KPEG Tactical Rebalance (Boosted Asymmetric Weight)');
  };

  const totalAllocation = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.allocation, 0);
  }, [holdings]);

  const weightedKPEG = useMemo(() => {
    if (totalAllocation === 0) return '0.00';
    const sum = holdings.reduce((acc, h) => acc + (h.kpeg * (h.allocation / totalAllocation)), 0);
    return sum.toFixed(2);
  }, [holdings, totalAllocation]);

  const existingTickers = useMemo(() => holdings.map((h) => h.ticker), [holdings]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-black text-white' : 'bg-[#fafafa] text-slate-900'} transition-colors duration-200 pb-20 md:pb-12`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#00c805] text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetPortfolio={handleResetPortfolio}
        totalHoldingsCount={holdings.length}
      />

      {/* Live Market Streaming Ticker */}
      <LiveTickerBar
        holdings={holdings}
        status={status}
        tickCounter={tickCounter}
        onToggleStreaming={toggleStreaming}
        onSetIntervalSeconds={setIntervalSeconds}
        onFetchRealMarket={handleSyncMarket}
        onSelectHolding={(h) => setSelectedHolding(h)}
      />

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab
            holdings={holdings}
            darkMode={darkMode}
            onSelectHolding={(h) => setSelectedHolding(h)}
            onNormalizeAllocations={handleNormalizeAllocations}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onAddHolding={handleAddHolding}
            onOpenSimulation={() => setActiveTab('simulation')}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationTab darkMode={darkMode} />
        )}

        {activeTab === 'kpeg' && (
          <KpegTab
            holdings={holdings}
            onSelectHolding={(h) => setSelectedHolding(h)}
            onApplyOptimalKpegWeights={handleApplyOptimalKpegWeights}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistTab
            existingTickers={existingTickers}
            onAddHolding={handleAddHolding}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <HoldingModal
        holding={selectedHolding ? holdings.find((h) => h.ticker === selectedHolding.ticker) || selectedHolding : null}
        onClose={() => setSelectedHolding(null)}
        onUpdateAllocation={handleUpdateAllocation}
        onDeleteHolding={handleDeleteHolding}
      />

      <AddHoldingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHolding={handleAddHolding}
        existingTickers={existingTickers}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        holdings={holdings}
        weightedKPEG={weightedKPEG}
      />

      {/* Bottom Nav for Mobile Ergonomics */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
