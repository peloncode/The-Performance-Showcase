import { useQuery } from "@tanstack/react-query";
import { generateMockData } from "../utils/mockData";

export const useMarketData = () => {
  return useQuery({
    queryKey: ["market"],
    queryFn: async () => {
      return generateMockData(1000);
    },
  });
};
