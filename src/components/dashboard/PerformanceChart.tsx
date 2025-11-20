import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface PerformanceData {
  month: string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const CustomDot = (props: any) => {
  const { cx, cy, index, payload } = props;
  const dataLength = props.payload?.length || 0;

  if (index === dataLength - 1) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={15}
          fill="white"
          stroke="#faf6f2ff"
          strokeWidth={2}
        />
        <circle cx={cx} cy={cy} r={8} fill="#f97316" />
      </g>
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="text-xs text-gray-600">{payload[0].payload.month}</p>
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].value} signups
        </p>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const maxSignups = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Performance</h3>
          <p className="text-xs text-muted-foreground mt-1">
            User signups over time
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={true}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
              padding={{ left: 0, right: 0 }}
              stroke="#e5e7eb"
            />
            <YAxis
              axisLine={true}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              domain={[0, Math.ceil(maxSignups * 1.2)]}
              allowDecimals={false}
              stroke="#e5e7eb"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={<CustomDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
