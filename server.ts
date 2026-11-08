import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Real-time market quotes proxy endpoint
  app.get('/api/quotes', async (req, res) => {
    try {
      const symbolsParam = req.query.symbols as string;
      if (!symbolsParam) {
        return res.status(400).json({ error: 'symbols query parameter required' });
      }

      const symbols = symbolsParam
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const quotes: Record<string, any> = {};

      await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
              symbol
            )}?interval=1d&range=1d`;
            const resp = await fetch(url, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'application/json',
              },
            });

            if (resp.ok) {
              const data = await resp.json();
              const result = data.chart?.result?.[0];
              const meta = result?.meta;

              if (meta && typeof meta.regularMarketPrice === 'number') {
                const currentPrice = meta.regularMarketPrice;
                const prevClose =
                  meta.chartPreviousClose ||
                  meta.previousClose ||
                  currentPrice;
                const change = Number((currentPrice - prevClose).toFixed(2));
                const changePercent = prevClose
                  ? Number(((change / prevClose) * 100).toFixed(2))
                  : 0;

                quotes[symbol] = {
                  symbol,
                  price: currentPrice,
                  previousClose: prevClose,
                  change,
                  changePercent,
                  dayHigh: meta.regularMarketDayHigh || currentPrice,
                  dayLow: meta.regularMarketDayLow || currentPrice,
                  volume: meta.regularMarketVolume || 0,
                  marketTime: meta.regularMarketTime,
                  currency: meta.currency || 'USD',
                };
              }
            }
          } catch (err: any) {
            console.error(`Error fetching quote for ${symbol}:`, err.message);
          }
        })
      );

      res.json({
        quotes,
        count: Object.keys(quotes).length,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.error('Quotes API error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Mount Vite middlewares in development or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
