import { useMemo } from "react";
import { ChartPoint } from "../types/chart";

export const useChartLogic = (
  data: ChartPoint[],
  width: number,
  height: number,
) => {
  return useMemo(() => {
    if (data.length === 0) return { path: "", points: [] };

    const min = Math.min(...data.map((d) => d.value));
    const max = Math.max(...data.map((d) => d.value));
    const range = max - min;
    const horizontalStep = width / (data.length - 1);

    const points = data.map((p, i) => ({
      x: i * horizontalStep,
      y: height - ((p.value - min) / range) * height,
      value: p.value,
    }));

    // Construir el path para Skia
    const path = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    return { path, points, min, max };
  }, [data, width, height]);
};
