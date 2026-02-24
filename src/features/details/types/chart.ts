export interface ChartPoint {
  timestamp: number;
  value: number;
}

export const generateChartData = (points: number): ChartPoint[] => {
  return Array.from({ length: points }).map((_, i) => ({
    timestamp: Date.now() + i * 1000,
    value: 50 + Math.random() * 100, // Precio entre 50 y 150
  }));
};
