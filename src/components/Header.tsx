import React from 'react';
import { Sun, Moon, Share2, Plus, RotateCcw, Search, TrendingUp } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onResetPortfolio: () => void;
  totalHoldingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenExportModal,
  onResetPortfolio,
}) => {
  const navItems = [
    { id: 'overview', label: 'Portfolio' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'kpeg', label: 'KPEG Theses' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors bg-white/95 dark:bg-black/90 border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone: Robinhood signature aesthetic */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#00c805] flex items-center justify-center text-black font-black text-sm tracking-tighter shadow-sm shadow-[#00c805]/30 shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black stroke-black" strokeWidth="1.5">
              <path d="M12 2L3 19h18L12 2z" opacity="0.2"/>
              <path d="M12 2C9 7 6 13 4 19c3-1 6-2 8-2s5 1 8 2c-2-6-5-12-8-17z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-tight">
              Gabriel's Portfolio
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c805] inline-block animate-pulse" />
              <span>Robinhood Style &middot; Tactical 2027</span>
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c805] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-[#00c805] hover:bg-[#00b004] active:scale-95 text-black transition-all shadow-sm shadow-[#00c805]/20"
            title="Add Stock to Portfolio"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Stock</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="min-h-[38px] min-w-[38px] p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            title="Export or Share Portfolio"
            aria-label="Export or Share Portfolio"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onResetPortfolio}
            className="hidden sm:flex min-h-[38px] min-w-[38px] p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors items-center justify-center"
            title="Reset to Gabriel's baseline"
            aria-label="Reset portfolio baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="min-h-[38px] min-w-[38px] p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
