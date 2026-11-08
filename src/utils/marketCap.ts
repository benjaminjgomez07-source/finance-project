export const SHARES_OUTSTANDING_MAP: Record<string, number> = {
  AMD: 1_635_000_000,   // ~1.635B shares
  NFLX: 4_120_000_000,  // ~4.120B shares
  META: 2_550_000_000,  // ~2.550B shares
  SOFI: 1_310_000_000,  // ~1.310B shares
  CRM: 821_000_000,     // ~821M shares
  WYNN: 102_500_000,    // ~102.5M shares
  RDDT: 193_000_000,    // ~193M shares
  LITE: 86_500_000,     // ~86.5M shares
  RH: 18_900_000,       // ~18.9M shares
  PLTR: 2_400_000_000,  // ~2.400B shares
  NVDA: 24_150_000_000, // ~24.150B shares
  TSM: 5_190_000_000,   // ~5.190B ADR shares
  UBER: 2_040_000_000,  // ~2.040B shares
  COIN: 264_800_000,    // ~264.8M shares
};

export function calculateMarketCap(price: number, sharesOutstanding?: number): string {
  if (!sharesOutstanding || sharesOutstanding <= 0) return 'N/A';
  const cap = price * sharesOutstanding;
  if (cap >= 1_000_000_000_000) {
    return `$${(cap / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (cap >= 1_000_000_000) {
    return `$${(cap / 1_000_000_000).toFixed(1)}B`;
  }
  if (cap >= 1_000_000) {
    return `$${(cap / 1_000_000).toFixed(1)}M`;
  }
  return `$${cap.toFixed(0)}`;
}

export function formatSharesCount(shares?: number): string {
  if (!shares || shares <= 0) return 'N/A';
  if (shares >= 1_000_000_000) {
    return `${(shares / 1_000_000_000).toFixed(2)}B`;
  }
  if (shares >= 1_000_000) {
    return `${(shares / 1_000_000).toFixed(1)}M`;
  }
  return `${shares.toLocaleString()}`;
}
