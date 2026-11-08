export interface Holding {
  ticker: string;
  name: string;
  sector: string;
  allocation: number; // percentage (e.g. 20 for 20%)
  price: number;
  targetPrice?: number;
  upside: number; // percentage (e.g. 37.0 for +37%)
  kpeg: number; // Kelly-weighted PEG valuation score
  pe?: number;
  forwardPe?: number;
  marketCap?: string;
  sharesOutstanding?: number; // total shares outstanding in units
  sharesCountDisplay?: string; // e.g. "1.64B shares"
  thesis: string;
  catalysts?: string[];
  risks?: string[];
  dayChange?: number;
  dayChangePercent?: number;
  dayHigh?: number;
  dayLow?: number;
  lastTickDirection?: 'up' | 'down' | 'flat';
  priceHistory?: number[];
  lastUpdated?: number;
}

export interface LiveMarketStatus {
  isStreaming: boolean;
  intervalSeconds: number; // 2, 5, 10, 30
  lastFetchedAt: number | null;
  source: 'real-market' | 'simulated-live';
  isFetching: boolean;
}

export interface SimulationParams {
  initialCapital: number;
  monthlyDca: number;
  timeHorizon: number; // 1 to 5 years
  scenario: 'aggressive' | 'balanced' | 'defensive' | 'custom';
  customRate: number; // percentage
  reinvestDividends: boolean;
}

export interface WatchlistStock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  targetPrice: number;
  upside: number;
  kpeg: number;
  pe: number;
  marketCap: string;
  sharesOutstanding?: number;
  sharesCountDisplay?: string;
  thesis: string;
  catalysts: string[];
}
