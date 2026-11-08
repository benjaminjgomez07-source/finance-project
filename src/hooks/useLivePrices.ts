import { useState, useEffect, useCallback, useRef } from 'react';
import { Holding, LiveMarketStatus } from '../types/portfolio';
import { calculateMarketCap, formatSharesCount, SHARES_OUTSTANDING_MAP } from '../utils/marketCap';

export function useLivePrices(
  holdings: Holding[],
  setHoldings: React.Dispatch<React.SetStateAction<Holding[]>>
) {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(3);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [source, setSource] = useState<'real-market' | 'simulated-live'>('simulated-live');
  const [tickCounter, setTickCounter] = useState<number>(0);

  const holdingsRef = useRef(holdings);
  holdingsRef.current = holdings;

  // Hydrate shares outstanding & initial price history if empty or cached
  useEffect(() => {
    setHoldings((prev) =>
      prev.map((h) => {
        const shares = h.sharesOutstanding || SHARES_OUTSTANDING_MAP[h.ticker] || 100_000_000;
        const accurateMarketCap = calculateMarketCap(h.price, shares);
        const sharesDisplay = h.sharesCountDisplay || formatSharesCount(shares);

        if (!h.priceHistory || h.priceHistory.length === 0 || !h.sharesOutstanding) {
          const base = h.price;
          const hist = h.priceHistory && h.priceHistory.length > 0 ? h.priceHistory : [
            Number((base * 0.994).toFixed(2)),
            Number((base * 0.997).toFixed(2)),
            Number((base * 0.999).toFixed(2)),
            Number((base * 0.998).toFixed(2)),
            base,
          ];
          return {
            ...h,
            sharesOutstanding: shares,
            sharesCountDisplay: sharesDisplay,
            marketCap: accurateMarketCap,
            priceHistory: hist,
            dayChange: h.dayChange ?? Number(((base * 0.012) * (h.upside >= 0 ? 1 : -0.5)).toFixed(2)),
            dayChangePercent: h.dayChangePercent ?? Number((h.upside >= 0 ? 1.25 : -0.65).toFixed(2)),
            dayHigh: h.dayHigh ?? Number((base * 1.018).toFixed(2)),
            dayLow: h.dayLow ?? Number((base * 0.985).toFixed(2)),
            lastTickDirection: 'flat',
            lastUpdated: Date.now(),
          };
        }
        return {
          ...h,
          sharesOutstanding: shares,
          sharesCountDisplay: sharesDisplay,
          marketCap: accurateMarketCap,
        };
      })
    );
  }, []);

  // Fetch real quotes from server API
  const fetchRealMarketPrices = useCallback(async () => {
    const current = holdingsRef.current;
    if (current.length === 0) return;

    setIsFetching(true);
    const symbols = current.map((h) => h.ticker).join(',');

    try {
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);
      if (res.ok) {
        const data = await res.json();
        const quotes = data.quotes || {};

        setHoldings((prev) =>
          prev.map((h) => {
            const quote = quotes[h.ticker];
            if (quote && typeof quote.price === 'number') {
              const newPrice = Number(quote.price.toFixed(2));
              const prevPrice = h.price;
              const direction: 'up' | 'down' | 'flat' =
                newPrice > prevPrice ? 'up' : newPrice < prevPrice ? 'down' : 'flat';
              
              const target = h.targetPrice || h.price * (1 + h.upside / 100);
              const newUpside = Number((((target - newPrice) / newPrice) * 100).toFixed(1));
              const hist = [...(h.priceHistory || [h.price]), newPrice].slice(-20);

              const shares = h.sharesOutstanding || SHARES_OUTSTANDING_MAP[h.ticker] || 100_000_000;
              const newMarketCap = calculateMarketCap(newPrice, shares);

              return {
                ...h,
                price: newPrice,
                marketCap: newMarketCap,
                dayChange: quote.change,
                dayChangePercent: quote.changePercent,
                dayHigh: quote.dayHigh || h.dayHigh || newPrice,
                dayLow: quote.dayLow || h.dayLow || newPrice,
                upside: newUpside,
                lastTickDirection: direction,
                priceHistory: hist,
                lastUpdated: Date.now(),
              };
            }
            return h;
          })
        );

        setSource('real-market');
        setLastFetchedAt(Date.now());
      }
    } catch (err) {
      console.warn('Real market quotes fetch failed, continuing with simulated ticks:', err);
    } finally {
      setIsFetching(false);
    }
  }, [setHoldings]);

  // Initial fetch on mount
  useEffect(() => {
    fetchRealMarketPrices();
  }, [fetchRealMarketPrices]);

  // Realistic continuous intraday micro-tick generator
  const triggerTick = useCallback(() => {
    setHoldings((prev) =>
      prev.map((h) => {
        // Volatility multiplier based on stock beta / sector
        const isHighBeta = ['RDDT', 'RH', 'SOFI', 'AMD'].includes(h.ticker);
        const volatility = isHighBeta ? 0.0035 : 0.0018; // 0.18% - 0.35% max swing per tick

        // Random walk with mean reversion
        const deltaPct = (Math.random() - 0.49) * volatility;
        const priceDelta = h.price * deltaPct;
        
        // Round to cents
        const newPrice = Math.max(0.01, Number((h.price + priceDelta).toFixed(2)));
        if (newPrice === h.price) return h;

        const direction: 'up' | 'down' = newPrice > h.price ? 'up' : 'down';
        const target = h.targetPrice || h.price * (1 + h.upside / 100);
        const newUpside = Number((((target - newPrice) / newPrice) * 100).toFixed(1));

        const prevChange = h.dayChange || 0;
        const newDayChange = Number((prevChange + (newPrice - h.price)).toFixed(2));
        const prevBase = newPrice - newDayChange;
        const newDayChangePercent = prevBase > 0 ? Number(((newDayChange / prevBase) * 100).toFixed(2)) : 0;

        const newHigh = Math.max(h.dayHigh || newPrice, newPrice);
        const newLow = Math.min(h.dayLow || newPrice, newPrice);
        const hist = [...(h.priceHistory || [h.price]), newPrice].slice(-20);
        const shares = h.sharesOutstanding || SHARES_OUTSTANDING_MAP[h.ticker] || 100_000_000;
        const newMarketCap = calculateMarketCap(newPrice, shares);

        return {
          ...h,
          price: newPrice,
          marketCap: newMarketCap,
          upside: newUpside,
          dayChange: newDayChange,
          dayChangePercent: newDayChangePercent,
          dayHigh: newHigh,
          dayLow: newLow,
          lastTickDirection: direction,
          priceHistory: hist,
          lastUpdated: Date.now(),
        };
      })
    );

    setTickCounter((c) => c + 1);
  }, [setHoldings]);

  // Continuous streaming interval
  useEffect(() => {
    if (!isStreaming) return;

    const intervalId = setInterval(() => {
      triggerTick();
    }, intervalSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [isStreaming, intervalSeconds, triggerTick]);

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev);
  };

  const status: LiveMarketStatus = {
    isStreaming,
    intervalSeconds,
    lastFetchedAt,
    source,
    isFetching,
  };

  return {
    status,
    tickCounter,
    toggleStreaming,
    setIntervalSeconds,
    fetchRealMarketPrices,
    triggerManualTick: triggerTick,
  };
}
