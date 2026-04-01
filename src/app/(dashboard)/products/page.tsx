/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { useUploadSingleFileMutation } from "@/redux/features/upload/upload.api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Edit2,
  Filter,
  MoreVertical,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
  minThreshold: z.coerce.number().min(1, "Threshold must be at least 1"),
  image: z.string().url("Valid image URL is required").optional(),
});

type ProductFormValues = {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  minThreshold: number;
  image?: string;
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: productsData, isLoading: isProductsLoading } =
    useGetAllProductsQuery({
      searchTerm,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    });
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadSingleFile, { isLoading: isUploading }] =
    useUploadSingleFileMutation();

  const products = productsData?.data?.data || [];
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
      let imageUrl = data.image || "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadResult = await uploadSingleFile(formData).unwrap();
        imageUrl = uploadResult.data.url;
      }

      if (!imageUrl && !editingProduct) {
        toast.error("Please upload a product image");
        return;
      }

      const finalData = { ...data, image: imageUrl };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...finalData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(finalData).unwrap();
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
      image: product.image,
    });
    setPreviewUrl(product.image);
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
      image: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Products Catalog
          </h1>
          <p className="text-sm text-blue-500/70">
            Manage your inventory, pricing, and stock levels.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="overflow-hidden border-blue-100 p-0 dark:border-blue-800">
        <div className="flex flex-col gap-4 border-b border-blue-50 bg-blue-50/20 p-5 md:flex-row md:items-center dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-blue-100 bg-white/50 pl-10 dark:border-blue-800 dark:bg-blue-950/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 w-[180px] border-blue-100 bg-white/50 dark:border-blue-800 dark:bg-blue-950/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-blue-100 dark:border-blue-800">
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

        <div className="w-full">
          <Table>
            <TableHeader className="bg-white dark:bg-blue-950">
              <TableRow className="border-b border-blue-100 dark:border-blue-800">
                <TableHead className="w-[80px]">Product</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isProductsLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-blue-500/50"
                  >
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-blue-500/50"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow
                    key={product._id}
                    className="border-b border-blue-50 last:border-0 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-900/40"
                  >
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-900/30">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {product.name}
                        </span>
                        <span className="text-xs text-blue-400">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-700 dark:text-blue-300">
                      ${(product.price ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-semibold",
                            product.stockQuantity <= product.minThreshold
                              ? "text-red-500"
                              : "text-blue-700 dark:text-blue-300",
                          )}
                        >
                          {product.stockQuantity}
                        </span>
                        {product.stockQuantity <= product.minThreshold && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "success" : "danger"
                        }
                      >
                        {product.status === "active"
                          ? "In Stock"
                          : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded">
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
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {editingProduct ? "Update Product" : "Register Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Product Name
                </label>
                <Input
                  placeholder="e.g. iPhone 15 Pro"
                  {...register("name")}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Category
                </label>
                <Select
                  onValueChange={(val: string) => setValue("category", val)}
                  defaultValue={editingProduct?.category?._id || ""}
                >
                  <SelectTrigger
                    className={cn("h-10", errors.category && "border-red-500")}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="border-blue-100 dark:border-blue-800">
                    {categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className={cn(errors.price && "border-red-500")}
                />
                {errors.price && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  {...register("stockQuantity")}
                  className={cn(errors.stockQuantity && "border-red-500")}
                />
                {errors.stockQuantity && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Restock Alert Quantity
                </label>
                <Input
                  type="number"
                  {...register("minThreshold")}
                  className={cn(errors.minThreshold && "border-red-500")}
                />
                {errors.minThreshold && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.minThreshold.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-blue-100 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="cursor-pointer file:cursor-pointer file:font-semibold"
                    />
                    <p className="text-[10px] text-blue-500/70">
                      Recommended: 800x800px. JPG, PNG or WEBP.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-8">
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
                disabled={isCreating || isUpdating || isUploading}
                className="px-8 font-semibold"
              >
                {isUploading
                  ? "Uploading..."
                  : editingProduct
                    ? "Update product"
                    : "Save product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
