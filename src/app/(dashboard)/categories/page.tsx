/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";
import { Edit2, MoreVertical, Plus, Search, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");

  const { data, isLoading } = useGetAllCategoriesQuery(undefined);
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.data || [];
  const filteredCategories = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          name: categoryName,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory({ name: categoryName }).unwrap();
        toast.success("Category created successfully");
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Categories
          </h1>
          <p className="text-sm text-blue-500/70">
            Manage your product categories for better organization.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="overflow-hidden border-blue-100 p-0 dark:border-blue-800">
        <div className="border-b border-blue-50 bg-blue-50/20 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-blue-100 bg-white pl-10 dark:border-blue-800 dark:bg-blue-950/50"
            />
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader className="bg-white dark:bg-blue-950">
              <TableRow className="border-b border-blue-100 dark:border-blue-800">
                <TableHead className="w-[80px]">Icon</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                (filteredCategories ?? []).map((category: any) => (
                  <TableRow
                    key={category._id}
                    className="border-b border-blue-50 last:border-0 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-900/40"
                  >
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-900/30">
                        <Tags className="h-5 w-5" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-900 dark:text-blue-100">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(category._id)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                Category Name
              </label>
              <Input
                placeholder="e.g. Electronics"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCloseModal}
              className="font-medium text-blue-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              className="px-8 font-semibold"
            >
              {editingCategory ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
