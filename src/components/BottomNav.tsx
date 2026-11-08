import React from 'react';
import { TrendingUp, Compass, Lightbulb, Sliders } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Portfolio', icon: TrendingUp },
    { id: 'simulation', label: 'Simulation', icon: Sliders },
    { id: 'kpeg', label: 'KPEG Theses', icon: Lightbulb },
    { id: 'watchlist', label: 'Watchlist', icon: Compass },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-safe">
      <nav className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-all relative ${
                isActive
                  ? 'text-[#00c805] font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-6 h-0.5 bg-[#00c805] rounded-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#00c805]' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
