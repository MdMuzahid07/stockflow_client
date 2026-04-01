"use client";
import {
  useGetStatsQuery,
  useGetAnalyticsQuery,
} from "@/redux/features/dashboard/dashboard.api";
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  AlertTriangle,
  DollarSign,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const { data: statsData, isLoading: isStatsLoading } = useGetStatsQuery(undefined);
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAnalyticsQuery(undefined);

  const stats = statsData?.data || {
    revenueToday: 0,
    totalOrdersToday: 0,
    statusSummary: { pending: 0, delivered: 0 },
    lowStockItemsCount: 0,
    recentActivities: [],
    productSummary: [],
  };

  const chartData = analyticsData?.data || [];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">System Overview</h1>
        <p className="text-sm text-blue-500/70">
          Welcome back! Here's a brief look at your inventory performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-600 text-white dark:bg-blue-600 dark:border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[12px] font-medium uppercase tracking-wider text-blue-100">
              Revenue Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">${(stats.revenueToday ?? 0).toLocaleString()}</div>
            <p className="mt-1 text-xs font-medium text-blue-100/70 italic">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[12px] font-medium uppercase tracking-wider text-blue-500">
              Orders Today
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">{stats.totalOrdersToday}</div>
            <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 italic">
              {stats.statusSummary.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[12px] font-medium uppercase tracking-wider text-red-500">
              Low Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-red-600 dark:text-red-400">
              {stats.lowStockItemsCount}
            </div>
            <p className="mt-1 text-xs font-medium text-blue-500/60 italic">
              Needs replenishment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[12px] font-medium uppercase tracking-wider text-green-600">
              Completed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-green-700 dark:text-green-400">
              {stats.statusSummary.delivered}
            </div>
            <p className="mt-1 text-xs font-medium text-blue-500/60 italic">
              Orders delivered today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Analytics Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Revenue Trend</CardTitle>
            <CardDescription className="text-sm text-blue-500/70">Daily sales performance for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-blue-600)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="var(--color-blue-600)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--color-blue-200) / 0.5)" />
                    <XAxis
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                      tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      className="text-[10px] font-medium text-blue-400 uppercase tracking-widest"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                      className="text-[10px] font-medium text-blue-400"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-blue-600)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recent Activity</CardTitle>
              <CardDescription className="text-sm text-blue-500/70">Latest system logs</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(stats.recentActivities ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
              ) : (
                (stats.recentActivities ?? []).slice(0, 6).map((activity: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className={cn(
                      "mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full",
                      activity.type === "order" ? "bg-blue-600" : "bg-amber-500"
                    )} />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-blue-900 dark:text-blue-100">
                        {activity.action}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-blue-400">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activity.user?.name || "System"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Summary */}
      <Card className="p-0 overflow-hidden border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="space-y-0.5">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Inventory Highlights</h3>
            <p className="text-sm text-blue-500/70">Quick view of current stock status</p>
          </div>
          <Package className="h-4 w-4 text-blue-400" />
        </div>
        <div className="w-full">
          <Table>
            <TableHeader className="bg-white dark:bg-blue-950">
              <TableRow className="border-b border-blue-100 dark:border-blue-800">
                <TableHead>Product Name</TableHead>
                <TableHead className="text-center">Stock Level</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(stats.productSummary ?? []).length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-blue-500/50">No products available.</TableCell>
                 </TableRow>
              ) : (
                (stats.productSummary ?? []).map((product: any, i: number) => (
                  <TableRow key={i} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/40 border-b border-blue-50 dark:border-blue-900 last:border-0">
                    <TableCell className="font-medium text-blue-900 dark:text-blue-100">{product.name}</TableCell>
                    <TableCell className="text-center font-medium text-blue-700 dark:text-blue-300">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={product.status === "Low Stock" ? "danger" : "success"}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
