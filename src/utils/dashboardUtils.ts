import { type SignupPerformanceData } from "@/types/stats.types";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

export interface PerformanceData {
  month: string;
  value: number;
  candidates: number;
  units: number;
}

export function calculateMonthlySignups(
  signupData: SignupPerformanceData[],
): PerformanceData[] {
  const now = new Date();

  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const monthDate = startOfMonth(subMonths(now, 5 - i));
    return format(monthDate, "MMM yyyy");
  });

  return lastSixMonths.map((monthKey) => {
    const monthlyItems = signupData.filter((item) => {
      const itemDate = parseISO(item.createdAt);
      return format(startOfMonth(itemDate), "MMM yyyy") === monthKey;
    });
    const candidates = monthlyItems.filter((i) =>
      i.type === "candidate"
    ).length;
    const units = monthlyItems.filter((i) => i.type === "unit").length;

    return {
      month: monthKey,
      value: monthlyItems.length,
      candidates,
      units,
    };
  });
}
