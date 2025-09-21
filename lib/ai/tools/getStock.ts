// import { z } from 'zod';
// import { tool as createTool } from 'ai';

// // Stock data interface
// export interface StockData {
//   symbol: string;
//   name: string;
//   price: number;
//   change: number;
//   changePercent: number;
//   volume: number;
//   marketCap?: number;
//   high: number;
//   low: number;
//   open: number;
//   previousClose: number;
//   lastUpdated: string;
// }

// const stockTool = createTool({
//   description:
//     'Get real-time stock information including price, change, volume, and other key metrics',
//   inputSchema: z.object({
//     symbol: z
//       .string()
//       .describe(
//         'The stock symbol to get information for (e.g., AAPL, GOOGL, MSFT)',
//       ),
//   }),
//   execute: async ({ symbol }: { symbol: string }) => {
//     try {
//       const apiKey = process.env.ALPHA_API_KEY;

//       if (!apiKey) {
//         throw new Error('Missing Alpha Vantage API key');
//       }

//       // Fetch stock data from Alpha Vantage API
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Stock API error: ${response.status}`);
//       }

//       const data = await response.json();

//       // Check for API error messages
//       if (data.ErrorMessage) {
//         throw new Error(data.ErrorMessage);
//       }

//       if (data.Note) {
//         throw new Error('API rate limit exceeded. Please try again later.');
//       }

//       const quote = data.GlobalQuote;
//       if (!quote || !quote['01. symbol']) {
//         throw new Error(`Stock symbol "${symbol}" not found`);
//       }

//       // Parse the stock data
//       const stockData: StockData = {
//         symbol: quote['01. symbol'],
//         name: quote['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
//         price: Number.parseFloat(quote['05. price']),
//         change: Number.parseFloat(quote['09. change']),
//         changePercent: Number.parseFloat(
//           quote['10. change percent'].replace('%', ''),
//         ),
//         volume: Number.parseInt(quote['06. volume']),
//         high: Number.parseFloat(quote['03. high']),
//         low: Number.parseFloat(quote['04. low']),
//         open: Number.parseFloat(quote['02. open']),
//         previousClose: Number.parseFloat(quote['08. previous close']),
//         lastUpdated: quote['07. latest trading day'],
//       };

//       return stockData;
//     } catch (error) {
//       // Fallback to mock data if API fails
//       console.warn('Stock API failed, using mock data:', error);
//       return {
//         symbol: symbol.toUpperCase(),
//         name: `${symbol.toUpperCase()} Inc.`,
//         price: Math.random() * 1000 + 50,
//         change: (Math.random() - 0.5) * 20,
//         changePercent: (Math.random() - 0.5) * 10,
//         volume: Math.floor(Math.random() * 10000000) + 1000000,
//         high: Math.random() * 1000 + 50,
//         low: Math.random() * 1000 + 50,
//         open: Math.random() * 1000 + 50,
//         previousClose: Math.random() * 1000 + 50,
//         lastUpdated: new Date().toISOString().split('T')[0],
//       };
//     }
//   },
// });

// export default stockTool;
