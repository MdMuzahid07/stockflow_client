"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useGetRestockQueueQuery,
  useRestockProductMutation,
} from "@/redux/features/restock/restock.api";
import {
  AlertCircle,
  ArrowUpCircle,
  History,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function RestockQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addedStock, setAddedStock] = useState(10);

  const { data, isLoading } = useGetRestockQueueQuery(undefined);
  const [restock, { isLoading: isRestocking }] = useRestockProductMutation();

  const queue = data?.data?.data || [];
  const filteredQueue = queue.filter((item: any) =>
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRestock = async () => {
    if (!selectedItem) return;
    if (addedStock <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      await restock({ id: selectedItem._id, addedStock }).unwrap();
      toast.success(`${selectedItem.product.name} restocked successfully`);
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to restock");
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "danger" | "warning" | "info"> = {
      High: "danger",
      Medium: "warning",
      Low: "info",
    };
    return (
      <Badge
        variant={variants[priority] || "secondary"}
        className="px-3 py-0.5 text-[11px]"
      >
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">Restock Queue</h1>
          <p className="text-sm text-blue-500/70">
            Replenishment monitoring. Items stay here until stock is restored.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-blue-600 text-white dark:bg-blue-600 dark:border-blue-500">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <AlertCircle className="h-6 w-6 text-blue-50" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-100 uppercase">
                Pending Replenishment
              </p>
              <p className="text-3xl font-semibold mt-0.5">{queue.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-red-50 p-3 text-red-500 dark:bg-red-900/20">
              <ArrowUpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-400 uppercase">
                High Priority
              </p>
              <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100 mt-0.5">
                {queue.filter((i: any) => i.priority === "High").length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-500 dark:bg-blue-900/20">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-400 uppercase">
                System Status
              </p>
              <p className="text-sm font-semibold text-blue-600 mt-1 dark:text-blue-400 uppercase tracking-wider">Replenish Active</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search products in queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader className="bg-white dark:bg-blue-950">
              <TableRow className="border-b border-blue-100 dark:border-blue-800 hover:bg-transparent">
                <TableHead className="w-[80px] text-[10px] uppercase tracking-wider font-bold">Product</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold">Details</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold">Category</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold">Stock Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold">Priority</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-wider font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[52px] text-center text-blue-500/50">
                    Loading queue...
                  </TableCell>
                </TableRow>
              ) : filteredQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[52px] text-center text-blue-500/50">
                    No items in replenishment queue.
                  </TableCell>
                </TableRow>
              ) : (
                (filteredQueue ?? []).map((item: any) => (
                  <TableRow key={item._id} className="h-[52px] group transition-colors">
                    <TableCell>
                      <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded">
                        <Package className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.product.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          Added: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {item.product.category?.name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-red-500">
                          {item.currentStock} / {item.threshold}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="h-8 text-xs"
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Replenish Inventory
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 pt-4 pb-2">
              <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  <Package className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{selectedItem.product.name}</p>
                  <p className="text-xs text-blue-500/70">
                    Current availability: <span className="font-semibold text-red-500">{selectedItem.currentStock}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100 italic ml-1">Quantity to Replenish</label>
                <Input
                  type="number"
                  value={addedStock}
                  onChange={(e) => setAddedStock(parseInt(e.target.value))}
                  className="h-11"
                />
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <p className="text-[11px] font-medium text-blue-400">
                    New inventory level will be <span className="text-blue-600 dark:text-blue-300 font-bold">{selectedItem.currentStock + (isNaN(addedStock) ? 0 : addedStock)}</span> units
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="font-medium text-blue-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRestock}
              disabled={isRestocking}
              className="px-8 font-semibold"
            >
              Confirm replenishment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
