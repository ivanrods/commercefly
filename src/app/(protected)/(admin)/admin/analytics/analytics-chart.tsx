"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp, ShoppingCart } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/helpers/format-currency";

interface ChartDataPoint {
  month: string;
  sales: number;
  orders: number;
}

interface AnalyticsChartProps {
  chartData: ChartDataPoint[];
  totalSales: number;
  totalOrders: number;
  year: number;
  monthsLabel: string;
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  chartData,
  totalSales,
  totalOrders,
  year,
  monthsLabel,
}) => {
  return (
    <div className="px-6 md:px-8 pt-8 md:pt-24 flex items-center justify-center ">
      <Card className="w-full max-w-2xl">
        <CardHeader className="px-6">
          <CardTitle className="text-xl font-semibold">
            Visão Geral de Desempenho de Vendas
          </CardTitle>
          <CardDescription>
            Tendências de volume de vendas mensal e contagem de pedidos —{" "}
            {monthsLabel} {year}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Vendas Totais
                </p>
                <TrendingUp className="size-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(totalSales)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 6 meses
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Pedidos Totais
                </p>
                <ShoppingCart className="size-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {totalOrders.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pedidos realizado
              </p>
            </div>
          </div>

          <div className="w-full">
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, bottom: 20 }}
                  accessibilityLayer
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                    opacity={0.5}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickMargin={10}
                  />

                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    width={50}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    width={45}
                  />

                  <ChartTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          if (name === "orders") {
                            return [`${Number(value).toFixed(0)}`, "Orders"];
                          }
                          return [
                            `$${Number(value).toLocaleString()}`,
                            "Sales",
                          ];
                        }}
                      />
                    }
                  />

                  <ChartLegend
                    content={<ChartLegendContent />}
                    iconType="circle"
                  />

                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    fill="var(--chart-1)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#salesGradient)" />
                    ))}
                  </Bar>

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--chart-3)"
                    strokeWidth={3}
                    dot={{
                      fill: "var(--chart-3)",
                      strokeWidth: 2,
                      r: 6,
                      stroke: "var(--background)",
                    }}
                    activeDot={{
                      r: 8,
                      fill: "var(--chart-3)",
                      stroke: "var(--background)",
                      strokeWidth: 3,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span>
                Mostrando dados para {monthsLabel} {year}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsChart;
