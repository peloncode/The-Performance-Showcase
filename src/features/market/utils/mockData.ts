export interface CryptoItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  chartData: number[];
}

// Diccionario de activos reales para nivel Senior
const REAL_COINS = [
  { symbol: "BTC", name: "Bitcoin", price: 65000 },
  { symbol: "ETH", name: "Ethereum", price: 3500 },
  { symbol: "SOL", name: "Solana", price: 145 },
  { symbol: "BNB", name: "Binance Coin", price: 580 },
  { symbol: "ADA", name: "Cardano", price: 0.45 },
  { symbol: "XRP", name: "Ripple", price: 0.6 },
  { symbol: "DOT", name: "Polkadot", price: 7.2 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.15 },
  { symbol: "MATIC", name: "Polygon", price: 0.7 },
  { symbol: "LINK", name: "Chainlink", price: 18.5 },
  { symbol: "AVAX", name: "Avalanche", price: 35.2 },
  { symbol: "UNI", name: "Uniswap", price: 7.8 },
];

export const generateMockData = (count: number): CryptoItem[] => {
  return Array.from({ length: count }).map((_, index) => {
    // Si estamos dentro del rango del diccionario, usamos datos reales.
    // Si no, creamos variaciones para completar los 1000 items.
    const isReal = index < REAL_COINS.length;
    const baseAsset = REAL_COINS[index % REAL_COINS.length];

    const symbol = isReal ? baseAsset.symbol : `${baseAsset.symbol}${index}`;
    const name = isReal ? baseAsset.name : `${baseAsset.name} Index ${index}`;

    // Variación de precio para que no todos los "Bitcoin" valgan lo mismo
    const price = baseAsset.price * (0.8 + Math.random() * 0.4);
    const changePercent = Math.random() * 10 - 5;

    // Generar una curva suave para el mini-gráfico (Random Walk)
    let lastValue = 50;
    const chartData = Array.from({ length: 15 }).map(() => {
      lastValue = lastValue + (Math.random() * 10 - 5);
      return lastValue;
    });

    return {
      id: `coin-${index}`,
      symbol,
      name,
      price,
      changePercent,
      chartData,
    };
  });
};

export const MOCK_DATA = generateMockData(1000);
