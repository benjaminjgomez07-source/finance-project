import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Holding } from '../types/portfolio';
import { WATCHLIST_CANDIDATES } from '../data/defaultPortfolio';
import { calculateMarketCap, formatSharesCount, SHARES_OUTSTANDING_MAP } from '../utils/marketCap';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (holding: Holding) => void;
  existingTickers: string[];
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  onAddHolding,
  existingTickers,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Custom Form State
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('Information Technology');
  const [allocation, setAllocation] = useState(5);
  const [price, setPrice] = useState(100);
  const [upside, setUpside] = useState(25);
  const [kpeg, setKpeg] = useState(0.95);
  const [thesis, setThesis] = useState('');

  const availableWatchlist = WATCHLIST_CANDIDATES.filter(
    (item) => !existingTickers.includes(item.ticker)
  );

  const handleAddPreset = (item: typeof WATCHLIST_CANDIDATES[0]) => {
    onAddHolding({
      ticker: item.ticker,
      name: item.name,
      sector: item.sector,
      allocation: 5,
      price: item.price,
      targetPrice: item.targetPrice,
      upside: item.upside,
      kpeg: item.kpeg,
      pe: item.pe,
      sharesOutstanding: item.sharesOutstanding,
      sharesCountDisplay: item.sharesCountDisplay,
      marketCap: item.marketCap || calculateMarketCap(item.price, item.sharesOutstanding),
      thesis: item.thesis,
      catalysts: item.catalysts,
      risks: ['General market and sector volatility']
    });
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !name.trim()) return;

    const sym = ticker.trim().toUpperCase();
    const numPrice = Number(price);
    const shares = SHARES_OUTSTANDING_MAP[sym] || 100_000_000;
    const computedMarketCap = calculateMarketCap(numPrice, shares);
    const sharesDisplay = formatSharesCount(shares);

    onAddHolding({
      ticker: sym,
      name: name.trim(),
      sector,
      allocation: Number(allocation),
      price: numPrice,
      upside: Number(upside),
      kpeg: Number(kpeg),
      sharesOutstanding: shares,
      sharesCountDisplay: sharesDisplay,
      marketCap: computedMarketCap,
      thesis: thesis.trim() || 'Custom strategic thesis.',
      catalysts: ['Upcoming earnings catalyst', 'Product monetization ramp'],
      risks: ['Market volatility']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#0c1015] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Add Asset to Portfolio
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Select a tactical growth candidate or enter a custom position
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 bg-slate-50 dark:bg-black/60 border-b border-slate-200 dark:border-white/10 flex gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 min-h-[38px] rounded-full text-xs font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-black dark:bg-[#00c805] text-white dark:text-black font-bold shadow-sm'
                : 'text-slate-600 dark:text-[#8b949e] hover:text-white'
            }`}
          >
            Tactical Radar ({availableWatchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 min-h-[38px] rounded-full text-xs font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-black dark:bg-[#00c805] text-white dark:text-black font-bold shadow-sm'
                : 'text-slate-600 dark:text-[#8b949e] hover:text-white'
            }`}
          >
            Custom Entry
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'presets' ? (
            <div className="space-y-3">
              {availableWatchlist.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">
                  All preset tactical watchlist candidates are already in your portfolio!
                </p>
              ) : (
                availableWatchlist.map((item) => (
                  <div
                    key={item.ticker}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black hover:border-slate-300 dark:hover:border-white/20 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                          {item.ticker}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.sector}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-[#8b949e]">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Price: <strong className="font-mono text-slate-700 dark:text-white">${item.price}</strong></span>
                        <span>Upside: <strong className="font-mono text-[#00c805]">+{item.upside}%</strong></span>
                        <span>KPEG: <strong className="font-mono text-[#00c805]">{item.kpeg}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPreset(item)}
                      className="min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold bg-[#00c805] hover:bg-[#00b004] text-black flex items-center gap-1 transition-transform active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add (5%)</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ticker *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PLTR"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white font-mono uppercase focus:border-[#00c805] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Palantir Technologies"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white focus:border-[#00c805] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white text-xs focus:border-[#00c805] focus:outline-none"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Communication Services">Communication Services</option>
                    <option value="Consumer Discretionary">Consumer Discretionary</option>
                    <option value="Financials">Financials</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Industrials">Industrials</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocation Weight (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={allocation}
                    onChange={(e) => setAllocation(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white font-mono focus:border-[#00c805] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white font-mono focus:border-[#00c805] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Upside (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={upside}
                    onChange={(e) => setUpside(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white font-mono focus:border-[#00c805] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    KPEG Score
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="5"
                    value={kpeg}
                    onChange={(e) => setKpeg(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white font-mono focus:border-[#00c805] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Investment Thesis
                </label>
                <textarea
                  rows={3}
                  placeholder="Key catalysts, revenue inflection points, and asymmetric upside driver..."
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white text-xs leading-relaxed focus:border-[#00c805] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 rounded-full text-xs font-bold text-black bg-[#00c805] hover:bg-[#00b004] shadow-lg shadow-[#00c805]/20"
                >
                  Add Custom Holding
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
