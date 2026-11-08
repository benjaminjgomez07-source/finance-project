import { Holding, WatchlistStock } from '../types/portfolio';
import { calculateMarketCap, formatSharesCount } from '../utils/marketCap';

export const INITIAL_HOLDINGS: Holding[] = [
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    sector: 'Information Technology',
    allocation: 20,
    price: 449.04,
    targetPrice: 615.18,
    upside: 37.0,
    kpeg: 1.15,
    pe: 48.2,
    forwardPe: 29.4,
    sharesOutstanding: 1_635_000_000,
    sharesCountDisplay: '1.64B shares',
    marketCap: calculateMarketCap(449.04, 1_635_000_000), // $734.2B
    thesis: 'AI accelerator hardware demand, hyperscaler data center expansion (MI300/MI350 series), and high-margin server CPU market share gains over Intel.',
    catalysts: [
      'Next-gen MI350/MI400 series AI chip deployments at major cloud providers',
      'EPYC Turin enterprise server CPU margin expansion',
      'Expanded software stack optimization (ROCm) closing Nvidia software gap'
    ],
    risks: [
      'Intensifying competitive pressure from Nvidia Blackwell architectures',
      'Cyclical fluctuations in PC and gaming console segments'
    ]
  },
  {
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    sector: 'Communication Services',
    allocation: 15,
    price: 63.41,
    targetPrice: 94.35,
    upside: 48.8,
    kpeg: 1.47,
    pe: 34.5,
    forwardPe: 26.2,
    sharesOutstanding: 4_120_000_000,
    sharesCountDisplay: '4.12B shares',
    marketCap: calculateMarketCap(63.41, 4_120_000_000), // $261.2B
    thesis: 'Global streaming dominance, scalable ad-supported tier expansion, password-sharing monetization tailwinds, and valuation multiple rerating as free cash flow inflects.',
    catalysts: [
      'Ad-tier subscriber scale reaching critical mass for brand advertisers',
      'Live sports and event programming (NFL, WWE Raw) driving engagement',
      'Consistent operating margin expansion toward 28-30%'
    ],
    risks: [
      'Subscriber saturation in North America and Western Europe',
      'Content production inflation and competing streaming service bundling'
    ]
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Communication Services',
    allocation: 15,
    price: 610.15,
    targetPrice: 558.28,
    upside: -8.5,
    kpeg: 1.73,
    pe: 27.8,
    forwardPe: 23.5,
    sharesOutstanding: 2_550_000_000,
    sharesCountDisplay: '2.55B shares',
    marketCap: calculateMarketCap(610.15, 2_550_000_000), // $1.56T
    thesis: 'Accelerated AI infrastructure monetization across Instagram and WhatsApp ad platforms, Llama open-source ecosystem dominance, and enterprise messaging monetization.',
    catalysts: [
      'Advantage+ AI advertising suite delivering double-digit ROAS gains for merchants',
      'WhatsApp Business click-to-message revenue scaling globally',
      'Ray-Ban Meta smart glasses emerging as category-defining wearable AI hardware'
    ],
    risks: [
      'High Reality Labs operating losses and heavy capex requirements ($38B-$40B/yr)',
      'Global regulatory scrutiny on digital ad platforms and antitrust reviews'
    ]
  },
  {
    ticker: 'SOFI',
    name: 'SoFi Technologies, Inc.',
    sector: 'Financials',
    allocation: 12,
    price: 16.21,
    targetPrice: 11.91,
    upside: -26.5,
    kpeg: 1.41,
    pe: 42.0,
    forwardPe: 28.1,
    sharesOutstanding: 1_310_000_000,
    sharesCountDisplay: '1.31B shares',
    marketCap: calculateMarketCap(16.21, 1_310_000_000), // $21.2B
    thesis: 'Full-suite digital banking ecosystem, high member retention with multi-product cross-selling, Galileo B2B tech platform expansion, and interest rate easing cycle benefits.',
    catalysts: [
      'Rapid deposit growth lowering cost of funds below traditional retail banks',
      'Loan platform business (LPB) origination fees expanding non-lending revenue',
      'Sustained GAAP profitability and potential S&P index inclusion'
    ],
    risks: [
      'Credit quality deterioration in unsecured personal loans during economic slowdowns',
      'Net interest margin compression if yield curve volatility persists'
    ]
  },
  {
    ticker: 'CRM',
    name: 'Salesforce, Inc.',
    sector: 'Information Technology',
    allocation: 10,
    price: 213.65,
    targetPrice: 461.48,
    upside: 116.0,
    kpeg: 0.81,
    pe: 38.4,
    forwardPe: 21.0,
    sharesOutstanding: 821_000_000,
    sharesCountDisplay: '821M shares',
    marketCap: calculateMarketCap(213.65, 821_000_000), // $175.4B
    thesis: 'Mission-critical enterprise cloud software cash flows, Agentforce autonomous AI agent tier monetization, multi-cloud enterprise contract renewals, and disciplined stock buybacks.',
    catalysts: [
      'Agentforce commercial deployments charging per-conversation consumption fees',
      'Data Cloud becoming Salesforce’s fastest organically growing product line',
      'Free cash flow margin sustained above 32%'
    ],
    risks: [
      'Elongated enterprise IT budget sign-off cycles',
      'Integration friction with legacy software acquisitions'
    ]
  },
  {
    ticker: 'WYNN',
    name: 'Wynn Resorts, Limited',
    sector: 'Consumer Discretionary',
    allocation: 10,
    price: 83.11,
    targetPrice: 107.46,
    upside: 29.3,
    kpeg: 1.01,
    pe: 14.8,
    forwardPe: 12.2,
    sharesOutstanding: 102_500_000,
    sharesCountDisplay: '102.5M shares',
    marketCap: calculateMarketCap(83.11, 102_500_000), // $8.52B
    thesis: 'Premier luxury hospitality brand with robust Macau VIP and mass-market gaming recovery, strong Las Vegas Strip premium RevPAR, and the catalyst of Wynn Al Marjan Island UAE opening in 2027.',
    catalysts: [
      'Wynn Al Marjan Island (first casino resort in UAE) construction progress and licensing',
      'Macau concession stability and international tourist recovery',
      'Substantial share repurchase capacity and dividend growth'
    ],
    risks: [
      'Macroeconomic softness in Mainland China affecting premium travel',
      'Higher debt service burdens if interest rates stay higher for longer'
    ]
  },
  {
    ticker: 'RDDT',
    name: 'Reddit, Inc.',
    sector: 'Communication Services',
    allocation: 8,
    price: 95.10,
    targetPrice: 395.62,
    upside: 316.0,
    kpeg: 0.55,
    pe: 58.0,
    forwardPe: 28.5,
    sharesOutstanding: 193_000_000,
    sharesCountDisplay: '193M shares',
    marketCap: calculateMarketCap(95.10, 193_000_000), // $18.35B
    thesis: 'High-margin AI training data licensing contracts (Google, OpenAI), machine-translated international expansion, premium advertising ROI, and extreme KPEG valuation mispricing.',
    catalysts: [
      'Multiple new LLM training licensing partnerships announced with frontier AI labs',
      'Search and commercial intent keyword monetization inside subreddits',
      'International daily active unique (DAUq) growth accelerating 50%+ YoY'
    ],
    risks: [
      'Moderator community friction regarding platform policy changes',
      'Ad pricing volatility relative to larger walled gardens'
    ]
  },
  {
    ticker: 'LITE',
    name: 'Lumentum Holdings Inc.',
    sector: 'Information Technology',
    allocation: 5,
    price: 538.59,
    targetPrice: 595.68,
    upside: 10.6,
    kpeg: 0.83,
    pe: 25.4,
    forwardPe: 18.2,
    sharesOutstanding: 86_500_000,
    sharesCountDisplay: '86.5M shares',
    marketCap: calculateMarketCap(538.59, 86_500_000), // $46.59B
    thesis: 'Optical networking transceivers (800G and 1.6T), coherent optical modules for AI cluster interconnections, Cloud Light acquisition synergies, and M&A catalyst potential.',
    catalysts: [
      'Datacom optical transceiver volume ramps for AI server backplanes',
      'Hyperscaler transition from 400G to 800G and early 1.6T optical interconnects',
      'Operating margin leverage as telecom inventory digestion finishes'
    ],
    risks: [
      'Customer concentration in top cloud hyperscalers',
      'Lumpy telecom optical network upgrade cycles'
    ]
  },
  {
    ticker: 'RH',
    name: 'RH (Restoration Hardware)',
    sector: 'Consumer Discretionary',
    allocation: 5,
    price: 130.96,
    targetPrice: 427.20,
    upside: 226.2,
    kpeg: 0.35,
    pe: 22.0,
    forwardPe: 12.8,
    sharesOutstanding: 18_900_000,
    sharesCountDisplay: '18.9M shares',
    marketCap: calculateMarketCap(130.96, 18_900_000), // $2.47B
    thesis: 'Luxury home furnishings brand poised for explosive cyclical leverage upon housing market normalization. European gallery openings, sourcebooks rollout, and lowest KPEG (0.35) in the portfolio.',
    catalysts: [
      'Housing turnover rebound driven by mortgage rate normalization',
      'International design gallery expansion in London, Paris, and Milan turning profitable',
      'Massive short squeeze potential combined with CEO aggressive share buybacks'
    ],
    risks: [
      'Prolonged luxury housing transaction freeze',
      'Execution risks and foreign currency exposure across European gallery rollouts'
    ]
  }
];

export const WATCHLIST_CANDIDATES: WatchlistStock[] = [
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies Inc.',
    sector: 'Information Technology',
    price: 160.38,
    targetPrice: 215.00,
    upside: 34.1,
    kpeg: 0.92,
    pe: 88.0,
    sharesOutstanding: 2_400_000_000,
    sharesCountDisplay: '2.40B shares',
    marketCap: calculateMarketCap(160.38, 2_400_000_000), // $384.9B
    thesis: 'AIP (Artificial Intelligence Platform) bootcamps driving unprecedented US commercial contract velocity, government defense software lock-in, and GAAP margin expansion.',
    catalysts: ['US Commercial revenue growing 50%+ YoY', 'Expanding DoD and NATO defense contract allocations']
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Information Technology',
    price: 186.64,
    targetPrice: 240.00,
    upside: 28.6,
    kpeg: 1.05,
    pe: 45.0,
    sharesOutstanding: 24_150_000_000,
    sharesCountDisplay: '24.15B shares',
    marketCap: calculateMarketCap(186.64, 24_150_000_000), // $4.51T
    thesis: 'Uncontested full-stack AI supercomputing platform. Blackwell architecture ramp, CUDA software moat, and sovereign AI datacenter buildouts worldwide.',
    catalysts: ['Blackwell full-scale production delivery in cloud clusters', 'Enterprise AI software and NIM microservices expansion']
  },
  {
    ticker: 'TSM',
    name: 'Taiwan Semiconductor Mfg.',
    sector: 'Information Technology',
    price: 375.44,
    targetPrice: 470.00,
    upside: 25.2,
    kpeg: 0.78,
    pe: 26.5,
    sharesOutstanding: 5_190_000_000,
    sharesCountDisplay: '5.19B ADR shares',
    marketCap: calculateMarketCap(375.44, 5_190_000_000), // $1.95T
    thesis: 'Sole foundry capable of leading-edge 3nm/2nm wafer fabrication and CoWoS advanced packaging required by all AI accelerator designers.',
    catalysts: ['2nm process node production launch', 'Advanced packaging CoWoS capacity doubling']
  },
  {
    ticker: 'UBER',
    name: 'Uber Technologies, Inc.',
    sector: 'Consumer Discretionary',
    price: 68.59,
    targetPrice: 95.00,
    upside: 38.5,
    kpeg: 0.85,
    pe: 31.0,
    sharesOutstanding: 2_040_000_000,
    sharesCountDisplay: '2.04B shares',
    marketCap: calculateMarketCap(68.59, 2_040_000_000), // $139.9B
    thesis: 'Dual-engine network effects across Mobility and Delivery, high-margin advertising revenue surpassing $1B run rate, and strategic autonomous vehicle partnerships.',
    catalysts: ['Autonomous vehicle network integration (Waymo, Cruise)', 'Advertising revenue scaling to $2B+']
  },
  {
    ticker: 'COIN',
    name: 'Coinbase Global, Inc.',
    sector: 'Financials',
    price: 134.76,
    targetPrice: 195.00,
    upside: 44.7,
    kpeg: 0.95,
    pe: 36.0,
    sharesOutstanding: 264_800_000,
    sharesCountDisplay: '264.8M shares',
    marketCap: calculateMarketCap(134.76, 264_800_000), // $35.7B
    thesis: 'Primary custodian for institutional Bitcoin/Ethereum ETFs, Base Layer-2 blockchain transaction fee revenue, and regulatory clarity catalysts.',
    catalysts: ['Base Layer-2 transaction fee monetization', 'Expansion of international derivatives trading platform']
  }
];

export const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': '#3b82f6', // blue
  'Communication Services': '#8b5cf6', // purple
  'Consumer Discretionary': '#f59e0b', // amber
  'Financials': '#10b981',             // emerald
  'Healthcare': '#ec4899',             // pink
  'Industrials': '#06b6d4',            // cyan
  'Energy': '#f97316',                // orange
};

export const COLOR_PALETTE = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
  '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'
];
