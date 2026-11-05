"use client";

import { createContext, useContext } from "react";
import type { SizeChart } from "@/lib/size-chart";

const SizeChartContext = createContext<SizeChart[] | null>(null);

export function SizeChartProvider({
  charts,
  children,
}: {
  charts: SizeChart[];
  children: React.ReactNode;
}) {
  return <SizeChartContext.Provider value={charts}>{children}</SizeChartContext.Provider>;
}

export function useSizeCharts() {
  return useContext(SizeChartContext) ?? [];
}
