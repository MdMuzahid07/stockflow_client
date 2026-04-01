"use client";
import { useState } from "react";
import {
  History,
  Search,
  Filter,
  User,
  ShoppingCart,
  Package,
  RefreshCw,
  Info,
} from "lucide-react";
import { useGetRecentLogsQuery } from "@/redux/features/activityLog/activityLog.api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading } = useGetRecentLogsQuery({
    searchTerm,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const logs = data?.data || [];

  const getLogIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "restock":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "product":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "restock":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground text-sm">
            Auditable history of all system actions and stock movements.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] rounded-xl border-none bg-muted/50">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="restock">Restock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Loading system logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
              <History className="h-8 w-8 opacity-20" />
              <p>No activity logs found.</p>
            </div>
          ) : (
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-muted">
              {logs.map((log: any, i: number) => (
                <div key={log._id} className="relative flex items-start gap-6 group">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg ring-4 ring-background transition-transform group-hover:scale-110",
                    getLogColor(log.type)
                  )}>
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 pt-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold tracking-tight text-foreground">
                        {log.action}
                      </p>
                      <time className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString([], { 
                          month: 'short', day: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] font-medium">
                          <User className="h-3 w-3" />
                          {log.user?.name || "System Auto"}
                       </div>
                       <Badge variant="outline" className="h-4 border-none bg-blue-50 px-2 text-[8px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-900/20">
                          {log.type}
                       </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
