/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetRecentLogsQuery } from "@/redux/features/activityLog/activityLog.api";
import {
  Filter,
  History,
  Info,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";

export default function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading } = useGetRecentLogsQuery({
    searchTerm,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const logs = data?.data?.data || [];

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
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300";
      case "product":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300";
      case "restock":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300";
      default:
        return "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
          Activity
        </h1>
        <p className="text-sm text-blue-500/70">
          Historical audit trail of all inventory events and system actions.
        </p>
      </div>

      <Card className="overflow-hidden border-blue-100 p-0 dark:border-blue-800">
        <div className="flex flex-col gap-4 border-b border-blue-50 bg-blue-50/20 p-5 md:flex-row md:items-center dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-blue-100 bg-white/50 pl-10 dark:border-blue-800 dark:bg-blue-950/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 w-[180px] border-blue-100 bg-white/50 dark:border-blue-800 dark:bg-blue-950/50">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent className="border-blue-100 dark:border-blue-800">
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="restock">Restock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm font-medium text-blue-500/50 italic">
              Loading intelligence logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                <History className="h-8 w-8 text-blue-400 opacity-40" />
              </div>
              <p className="text-sm font-medium text-blue-500/50 italic">
                No matching activity records found.
              </p>
            </div>
          ) : (
            <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:h-full before:w-px before:bg-blue-100 dark:before:bg-blue-800">
              {logs.map((log: any) => (
                <div
                  key={log._id}
                  className="group relative flex items-start gap-8"
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-4 ring-white transition-all group-hover:scale-110 dark:ring-blue-950",
                      getLogColor(log.type),
                    )}
                  >
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <p className="text-sm font-bold tracking-tight text-blue-900 dark:text-blue-100">
                        {log.action}
                      </p>
                      <time className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">
                        {new Date(log.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-blue-500/70 uppercase">
                        <User className="h-3 w-3" />
                        {log.user?.name || "System Core"}
                      </div>
                      <Badge
                        variant="secondary"
                        className="h-5 px-2 text-[9px] font-black tracking-[0.15em] uppercase opacity-80"
                      >
                        {log.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
