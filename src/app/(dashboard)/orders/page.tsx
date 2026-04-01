"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCancelOrderMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/order/order.api";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Calendar,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  PlusCircle,
  Search,
  ShoppingCart,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
  }),
  items: z
    .array(
      z.object({
        product: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number(),
      }),
    )
    .min(1, "At least one item is required"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrdersQuery({
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const { data: productsData } = useGetAllProductsQuery({ status: "active" });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const orders = ordersData?.data?.data || [];
  const products = productsData?.data?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ product: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const orderItems = watch("items");
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
    0,
  );

  const onSubmit = async (data: OrderFormValues) => {
    try {
      await createOrder(data).unwrap();
      toast.success("Order placed successfully");
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Order marked as ${status}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this order? Stock will be restored.",
      )
    ) {
      try {
        await cancelOrder(id).unwrap();
        toast.success("Order cancelled successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to cancel order");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({
      customer: { name: "", phone: "", address: "" },
      items: [{ product: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "info" | "secondary" | "success" | "warning" | "danger"> = {
      pending: "info",
      confirmed: "info",
      shipped: "warning",
      delivered: "success",
      cancelled: "danger",
    };
    return (
      <Badge
        variant={variants[status] || "secondary"}
        className="capitalize px-3 py-0.5 text-[11px]"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Orders Management
          </h1>
          <p className="text-sm text-blue-500/70">
            Track customer orders, fulfillment status, and shipments.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-blue-100 dark:border-blue-800">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center border-b border-blue-50 bg-blue-50/20 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-950/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-10 border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-950/50">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="border-blue-100 dark:border-blue-800">
                <SelectItem value="all">All Status</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader className="bg-white dark:bg-blue-950">
              <TableRow className="border-b border-blue-100 dark:border-blue-800">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOrdersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-blue-500/50">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-blue-500/50">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/40 border-b border-blue-50 dark:border-blue-900 last:border-0"
                  >
                    <TableCell className="text-blue-400 font-mono text-[10px] tracking-widest">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {order.customer.name}
                        </span>
                        <span className="text-[11px] text-blue-400">
                          {order.customer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-blue-500 dark:text-blue-400 flex items-center gap-1.5 text-xs font-medium">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-blue-700 dark:text-blue-300">
                      ${(order.totalAmount ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded"
                        >
                          <DropdownMenuItem
                            onClick={() => setViewingOrder(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <>
                                {ORDER_STATUSES.slice(
                                  ORDER_STATUSES.indexOf(order.status) + 1,
                                ).map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() =>
                                      handleUpdateStatus(order._id, s)
                                    }
                                  >
                                    Mark as{" "}
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Create New Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <div className="bg-blue-50/30 dark:bg-blue-900/10 grid grid-cols-2 gap-5 rounded-lg border border-blue-100/50 dark:border-blue-800/50 p-5">
              <h3 className="text-blue-400 col-span-2 text-[11px] font-semibold tracking-widest uppercase mb-1">
                Customer Information
              </h3>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-medium text-blue-900 dark:text-blue-100 italic ml-1">Full Name</label>
                <Input
                  placeholder="Enter customer name"
                  {...register("customer.name")}
                  className={cn("h-10", errors.customer?.name && "border-red-500")}
                />
                {errors.customer?.name && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.customer.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-900 dark:text-blue-100 italic ml-1">Phone Number</label>
                <Input
                  placeholder="e.g. +1 234 567 890"
                  {...register("customer.phone")}
                  className={cn("h-10", errors.customer?.phone && "border-red-500")}
                />
                {errors.customer?.phone && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.customer.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-900 dark:text-blue-100 italic ml-1">Shipping Address</label>
                <Input
                  placeholder="Enter full address"
                  {...register("customer.address")}
                  className={cn("h-10", errors.customer?.address && "border-red-500")}
                />
                {errors.customer?.address && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.customer.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-blue-50 dark:border-blue-900 pb-2">
                <h3 className="text-blue-400 text-[11px] font-semibold tracking-widest uppercase">
                  Order Items
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    append({ product: "", quantity: 1, unitPrice: 0 })
                  }
                  className="h-7 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const selectedProductId = watch(`items.${index}.product`);
                  const selectedProduct = products.find(
                    (p: any) => p._id === selectedProductId,
                  );
                  const isOverStock = selectedProduct
                    ? watch(`items.${index}.quantity`) >
                      selectedProduct.stockQuantity
                    : false;

                  return (
                    <div
                      key={field.id}
                      className="group relative flex flex-col gap-3 rounded border p-3 pt-4 transition-colors hover:border-blue-500/30 sm:grid sm:grid-cols-12"
                    >
                      <div className="col-span-12 space-y-2 sm:col-span-6">
                        <Select
                          onValueChange={(val) => {
                            const p = products.find((x: any) => x._id === val);
                            setValue(`items.${index}.product`, val);
                            setValue(`items.${index}.unitPrice`, p?.price || 0);
                          }}
                          defaultValue={field.product}
                        >
                          <SelectTrigger className="h-9 rounded-lg">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            {products.map((p: any) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.name} (${p.price}) - {p.stockQuantity} left
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Input
                          type="number"
                          placeholder="Qty"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          className={cn(
                            "h-9 rounded-lg",
                            isOverStock && "border-red-500 ring-red-500/10",
                          )}
                        />
                      </div>
                      <div className="col-span-6 flex items-center justify-between pt-2 text-right sm:col-span-2">
                        <span className="text-muted-foreground text-xs font-bold uppercase sm:hidden">
                          Subtotal
                        </span>
                        <span className="font-mono text-sm font-bold">
                          $
                          {(
                            (watch(`items.${index}.unitPrice`) || 0) *
                            (watch(`items.${index}.quantity`) || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-12 sm:col-span-1">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-muted-foreground flex h-9 w-full items-center justify-center transition-colors hover:text-red-500"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>

                      {isOverStock && selectedProduct && (
                        <div className="col-span-12 mt-1 flex items-center gap-1.5 text-[10px] font-bold text-red-500">
                          <AlertTriangle className="h-3 w-3" />
                          Only {selectedProduct.stockQuantity} items available
                          in stock
                        </div>
                      )}
                      {errors.items?.[index]?.quantity && (
                        <p className="col-span-12 text-[10px] text-red-500">
                          {errors.items?.[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-blue-100 dark:border-blue-800 pt-8">
              <div className="flex flex-col gap-0.5">
                <span className="text-blue-400 text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Total Payable
                </span>
                <span className="text-3xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">
                  ${(totalAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="font-medium text-blue-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="px-10 font-semibold"
                >
                  Confirm Order
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {viewingOrder && (
            <>
              <div className="p-6 border-b border-blue-50 bg-blue-50/20 dark:border-blue-900/30 dark:bg-blue-900/10">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-blue-900 dark:text-blue-100">Order Manifest</span>
                    {getStatusBadge(viewingOrder.status)}
                  </DialogTitle>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 flex items-center gap-2">
                      <User className="h-3 w-3" /> Customer Metadata
                    </h4>
                    <div className="space-y-1 ml-1">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{viewingOrder.customer.name}</p>
                      <p className="text-xs text-blue-500/70">{viewingOrder.customer.phone}</p>
                      <p className="text-xs text-blue-500/70 leading-relaxed">{viewingOrder.customer.address}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Registry Information
                    </h4>
                    <div className="space-y-1 ml-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-blue-400">Date</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">{new Date(viewingOrder.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-blue-400">Reference ID</span>
                        <span className="font-mono text-blue-900 dark:text-blue-100">#{viewingOrder._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 flex items-center gap-2">
                    <ShoppingCart className="h-3 w-3" /> Line-Item Breakdown
                  </h4>
                  <div className="rounded-xl border border-blue-100/50 dark:border-blue-800/50 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-blue-50/30 dark:bg-blue-900/10">
                        <TableRow className="border-b border-blue-50 dark:border-blue-900 last:border-0 hover:bg-transparent">
                          <TableHead className="h-9 text-[10px] text-blue-400 font-semibold uppercase">Product</TableHead>
                          <TableHead className="h-9 text-right text-[10px] text-blue-400 font-semibold uppercase">Price</TableHead>
                          <TableHead className="h-9 text-center text-[10px] text-blue-400 font-semibold uppercase">Qty</TableHead>
                          <TableHead className="h-9 text-right text-[10px] text-blue-400 font-semibold uppercase">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingOrder.items.map((item: any, i: number) => (
                          <TableRow key={i} className="border-b border-blue-50/50 dark:border-blue-900/30 last:border-0 h-11">
                            <TableCell className="text-xs font-medium text-blue-900 dark:text-blue-100 py-2">
                              {item.product?.name || "Deleted Product"}
                            </TableCell>
                            <TableCell className="text-right text-xs text-blue-500/70 font-medium py-2">
                              ${item.unitPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center text-xs text-blue-900 dark:text-blue-100 font-medium py-2">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right text-xs font-semibold text-blue-900 dark:text-blue-100 py-2">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-blue-600 p-5 text-white shadow-lg shadow-blue-500/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-100/70">
                      Amount Due
                    </span>
                    <span className="text-xs text-blue-100/50">Tax included where applicable</span>
                  </div>
                  <span className="text-2xl font-semibold tracking-tight">
                    ${viewingOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
