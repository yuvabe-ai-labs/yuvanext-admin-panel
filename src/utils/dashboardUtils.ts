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
  // Get last 6 months including current month
  const months: PerformanceData[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = startOfMonth(subMonths(now, i));
    const monthKey = format(monthDate, "MMM yyyy");

    months.push({
      month: monthKey,
      value: 0,
      candidates: 0,
      units: 0,
    });
  }

  // Count signups by month
  signupData.forEach((item) => {
    try {
      const itemDate = parseISO(item.createdAt);
      const monthKey = format(startOfMonth(itemDate), "MMM yyyy");

      const monthData = months.find((m) => m.month === monthKey);

      if (monthData) {
        if (item.type === "candidate") {
          monthData.candidates += 1;
        } else if (item.type === "unit") {
          monthData.units += 1;
        }
        monthData.value += 1;
      }
    } catch (error) {
      console.error("Error parsing date:", item.createdAt, error);
    }
  });

  return months;
}
