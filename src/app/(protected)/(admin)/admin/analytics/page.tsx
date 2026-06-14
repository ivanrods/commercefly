import { getAllOrders } from "@/services/orders-service";
import AnalyticsChart from "./analytics-chart";

export default async function AnalyticsPage() {
  const orders = await getAllOrders();

  const now = new Date();
  const monthlyMap = new Map<
    string,
    { month: string; sales: number; orders: number }
  >();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    monthlyMap.set(key, { month: label, sales: 0, orders: 0 });
  }

  for (const order of orders) {
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = monthlyMap.get(key);
    if (entry) {
      entry.sales += order.totalAmount / 100;
      entry.orders += 1;
    }
  }

  const chartData = Array.from(monthlyMap.values());
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

  const firstMonth = chartData[0]?.month ?? "";
  const lastMonth = chartData[chartData.length - 1]?.month ?? "";
  const monthsLabel = `${firstMonth} – ${lastMonth}`;

  return (
    <AnalyticsChart
      chartData={chartData}
      totalSales={totalSales}
      totalOrders={totalOrders}
      year={now.getFullYear()}
      monthsLabel={monthsLabel}
    />
  );
}
