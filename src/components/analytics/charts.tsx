"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface MonthlyData {
  month: string;
  collected?: number;
  pending?: number;
  overdue?: number;
  paid?: number;
  amount?: number;
}

const COLORS = {
  collected: "#059669",
  pending: "#d97706",
  overdue: "#dc2626",
  paid: "#059669",
};

export function CollectionChart({ data }: { data: MonthlyData[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-variant)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
            axisLine={{ stroke: "var(--color-outline-variant)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
            axisLine={{ stroke: "var(--color-outline-variant)" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-surface-variant)",
              borderRadius: "0.75rem",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="collected" fill={COLORS.collected} radius={[4, 4, 0, 0]} name="Collected" />
          <Bar dataKey="pending" fill={COLORS.pending} radius={[4, 4, 0, 0]} name="Pending" />
          <Bar dataKey="overdue" fill={COLORS.overdue} radius={[4, 4, 0, 0]} name="Overdue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentHistoryChart({ data }: { data: MonthlyData[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-variant)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
            axisLine={{ stroke: "var(--color-outline-variant)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-on-surface-variant)" }}
            axisLine={{ stroke: "var(--color-outline-variant)" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-surface-variant)",
              borderRadius: "0.75rem",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, ""]}
          />
          <Bar dataKey="paid" fill={COLORS.paid} radius={[4, 4, 0, 0]} name="Paid" />
          <Bar dataKey="pending" fill={COLORS.pending} radius={[4, 4, 0, 0]} name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OccupancyDonut({ rate }: { rate: number }) {
  const data = [
    { name: "Occupied", value: rate },
    { name: "Vacant", value: 100 - rate },
  ];
  const colors = ["#059669", "var(--color-surface-container-high)"];

  return (
    <div className="w-full h-[200px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-on-surface">{rate}%</p>
          <p className="text-xs text-on-surface-variant">Occupied</p>
        </div>
      </div>
    </div>
  );
}
