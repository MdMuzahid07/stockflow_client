"use client";
import { useState } from "react";
import {
  RefreshCw,
  Search,
  Package,
  AlertCircle,
  ArrowUpCircle,
  History,
} from "lucide-react";
import {
  useGetRestockQueueQuery,
  useRestockProductMutation,
} from "@/redux/features/restock/restock.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RestockQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addedStock, setAddedStock] = useState(10);

  const { data, isLoading } = useGetRestockQueueQuery(undefined);
  const [restock, { isLoading: isRestocking }] = useRestockProductMutation();

  const queue = data?.data || [];
  const filteredQueue = queue.filter((item: any) =>
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    const variants: Record<string, string> = {
      High: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      Low: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    };
    return (
      <Badge variant="outline" className={cn("rounded-lg border-none font-bold px-3", variants[priority])}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Restock Queue</h1>
          <p className="text-muted-foreground text-sm">
            Critical replenishment monitoring. Items stay here until stock is restored.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="rounded-2xl border bg-blue-600 p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-4">
               <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                  <AlertCircle className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Pending Items</p>
                  <p className="text-3xl font-black">{queue.length}</p>
               </div>
            </div>
         </div>
         <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/20">
                  <ArrowUpCircle className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-black">{queue.filter((i: any) => i.priority === "High").length}</p>
               </div>
            </div>
         </div>
         <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20">
                  <History className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Auto-Replenish</p>
                  <p className="text-sm font-bold text-blue-600">Enabled</p>
               </div>
            </div>
         </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products in queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-bold">Product</TableHead>
                <TableHead className="font-bold">Info</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Stock Status</TableHead>
                <TableHead className="font-bold">Priority</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading queue...
                  </TableCell>
                </TableRow>
              ) : filteredQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No items in restock queue. Good job!
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueue.map((item: any) => (
                  <TableRow key={item._id} className="group transition-colors">
                    <TableCell>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{item.product.name}</span>
                        <span className="text-xs text-muted-foreground">Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-lg">{item.product.category?.name || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-red-500 font-bold">Current: {item.currentStock}</span>
                        <span className="text-muted-foreground italic">Threshold: {item.threshold}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 h-9 rounded-xl text-xs font-bold"
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replenish Inventory</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{selectedItem.product.name}</p>
                  <p className="text-xs text-muted-foreground">Current Stock: {selectedItem.currentStock}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity to Add</label>
                <Input
                  type="number"
                  value={addedStock}
                  onChange={(e) => setAddedStock(parseInt(e.target.value))}
                  className="rounded-xl h-11"
                />
                <p className="text-[10px] text-muted-foreground">New stock total will be {selectedItem.currentStock + addedStock}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleRestock}
              disabled={isRestocking}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold"
            >
              Confirm Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
