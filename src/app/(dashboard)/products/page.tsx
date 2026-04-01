"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
  minThreshold: z.coerce.number().min(1, "Threshold must be at least 1"),
});

type ProductFormValues = {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  minThreshold: number;
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductsQuery({
    searchTerm,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...data }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product created successfully");
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      category: product.category?._id || product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      minThreshold: product.minThreshold,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset({
      name: "",
      category: "",
      price: 0,
      stockQuantity: 0,
      minThreshold: 5,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Catalog</h1>
          <p className="text-muted-foreground text-sm">
            Manage your inventory, pricing, and stock levels.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 h-10 rounded-xl px-4 font-bold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] rounded-xl border-none bg-muted/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
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
                <TableHead className="w-[100px] font-bold">Product</TableHead>
                <TableHead className="font-bold">Name & Category</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isProductsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product._id} className="group transition-colors">
                    <TableCell>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                        <Package className="h-6 w-6" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <span className={product.stockQuantity <= product.minThreshold ? "text-red-500 font-bold" : "font-medium"}>
                          {product.stockQuantity}
                        </span>
                        {product.stockQuantity <= product.minThreshold && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "active" ? "default" : "destructive"}
                        className={product.status === "active" ? "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}
                      >
                        {product.status === "active" ? "Active" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-2xl sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Update Product" : "Register New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input placeholder="e.g. iPhone 15 Pro" {...register("name")} className="rounded-xl" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  onValueChange={(val: string) => setValue("category", val)}
                  defaultValue={editingProduct?.category?._id || ""}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input type="number" step="0.01" {...register("price")} className="rounded-xl" />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input type="number" {...register("stockQuantity")} className="rounded-xl" />
                {errors.stockQuantity && (
                  <p className="text-xs text-red-500">{errors.stockQuantity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min. Threshold</label>
                <Input type="number" {...register("minThreshold")} className="rounded-xl" />
                {errors.minThreshold && (
                  <p className="text-xs text-red-500">{errors.minThreshold.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold"
              >
                {editingProduct ? "Update Product" : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
