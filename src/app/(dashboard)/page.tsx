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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none bg-blue-600 text-white shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-100">
              Revenue Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">${stats.revenueToday.toFixed(2)}</div>
            <p className="mt-1 text-xs font-medium text-blue-100/70">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">
              Orders Today
            </CardTitle>
            <ShoppingCart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.totalOrdersToday}</div>
            <p className="mt-1 text-xs font-bold text-blue-600">
              {stats.statusSummary.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">
              Low Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-500">
              {stats.lowStockItemsCount}
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Needs replenishment
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">
              Completed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              {stats.statusSummary.delivered}
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Orders delivered today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Analytics Chart */}
        <Card className="lg:col-span-4 rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue Trend</CardTitle>
            <CardDescription>Daily sales performance for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                    <XAxis
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      className="text-[10px] font-bold text-muted-foreground uppercase"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      className="text-[10px] font-bold text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription>Latest system logs</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
              ) : (
                stats.recentActivities.slice(0, 6).map((activity: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className={cn(
                      "mt-1 flex h-2 w-2 shrink-0 rounded-full",
                      activity.type === "order" ? "bg-blue-600" : "bg-orange-500"
                    )} />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none tracking-tight">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {activity.user?.name || "System"}
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
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">Inventory Highlights</CardTitle>
            <CardDescription>Quick view of current stock status</CardDescription>
          </div>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold">Product Name</TableHead>
                <TableHead className="font-bold text-center">Stock Level</TableHead>
                <TableHead className="font-bold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.productSummary.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No products available.</TableCell>
                 </TableRow>
              ) : (
                stats.productSummary.map((product: any, i: number) => (
                  <TableRow key={i} className="group hover:bg-muted/30">
                    <TableCell className="font-bold text-sm tracking-tight">{product.name}</TableCell>
                    <TableCell className="text-center font-mono font-medium">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg border-none px-3 font-bold",
                          product.status === "Low Stock" 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        )}
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
