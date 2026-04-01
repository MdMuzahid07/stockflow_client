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

  const orders = ordersData?.data || [];
  const products = productsData?.data || [];

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
    const variants: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      confirmed:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-lg border-none px-3 font-bold capitalize",
          variants[status],
        )}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Orders Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Track customer orders, fulfillment status, and shipments.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-10 rounded bg-blue-600 px-4 font-bold hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Order
        </Button>
      </div>

      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search orders by customer or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/50 rounded border-none pl-10 focus-visible:ring-1 focus-visible:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-muted/50 w-[180px] rounded border-none">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded">
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOrdersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => (
                  <TableRow key={order._id} className="group transition-colors">
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">
                          {order.customer.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {order.customer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
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
      </div>

      {/* Create Order Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Create New Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="bg-muted/30 grid grid-cols-2 gap-4 rounded p-4">
              <h3 className="text-muted-foreground col-span-2 text-xs font-bold tracking-widest uppercase">
                Customer Information
              </h3>
              <div className="col-span-2 space-y-2">
                <Input
                  placeholder="Full Name"
                  {...register("customer.name")}
                  className="bg-background rounded"
                />
                {errors.customer?.name && (
                  <p className="text-xs text-red-500">
                    {errors.customer.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Phone Number"
                  {...register("customer.phone")}
                  className="bg-background rounded"
                />
                {errors.customer?.phone && (
                  <p className="text-xs text-red-500">
                    {errors.customer.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Address"
                  {...register("customer.address")}
                  className="bg-background rounded"
                />
                {errors.customer?.address && (
                  <p className="text-xs text-red-500">
                    {errors.customer.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Order Items
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ product: "", quantity: 1, unitPrice: 0 })
                  }
                  className="h-8 rounded-lg border-blue-500/20 text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="mr-2 h-3 w-3" />
                  Add Product
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

            <div className="flex items-center justify-between border-t pt-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Total Amount
                </span>
                <span className="text-3xl font-black tracking-tight text-blue-600">
                  ${(totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="rounded"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="h-12 rounded bg-blue-600 px-12 font-black hover:bg-blue-700"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="rounded-2xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              {viewingOrder && getStatusBadge(viewingOrder.status)}
            </DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-3">
                  <h4 className="text-muted-foreground flex items-center gap-2 font-bold tracking-tight">
                    <User className="h-4 w-4" /> Customer Info
                  </h4>
                  <div className="bg-muted/30 space-y-1 rounded p-3">
                    <p className="font-bold">{viewingOrder.customer.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {viewingOrder.customer.phone}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {viewingOrder.customer.address}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-muted-foreground flex items-center gap-2 font-bold tracking-tight">
                    <Calendar className="h-4 w-4" /> Order Info
                  </h4>
                  <div className="bg-muted/30 space-y-1 rounded p-3">
                    <p className="text-xs font-bold tracking-tight">
                      Order Date:
                    </p>
                    <p className="font-mono text-xs">
                      {new Date(viewingOrder.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-tight">
                      Order ID:
                    </p>
                    <p className="font-mono text-xs">#{viewingOrder._id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-muted-foreground flex items-center gap-2 font-bold tracking-tight">
                  <ShoppingCart className="h-4 w-4" /> Line Items
                </h4>
                <div className="overflow-hidden rounded border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-8 text-[10px] font-bold tracking-widest uppercase">
                          Product
                        </TableHead>
                        <TableHead className="h-8 text-right text-[10px] font-bold tracking-widest uppercase">
                          Price
                        </TableHead>
                        <TableHead className="h-8 text-center text-[10px] font-bold tracking-widest uppercase">
                          Qty
                        </TableHead>
                        <TableHead className="h-8 text-right text-[10px] font-bold tracking-widest uppercase">
                          Subtotal
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingOrder.items.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs font-medium">
                            {item.product?.name || "Deleted Product"}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            ${item.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center text-xs">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-bold">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-center justify-between rounded bg-blue-600 p-4 text-white">
                <span className="text-sm font-bold tracking-[0.2em] uppercase">
                  Grand Total
                </span>
                <span className="text-2xl font-black tracking-tight">
                  ${viewingOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
