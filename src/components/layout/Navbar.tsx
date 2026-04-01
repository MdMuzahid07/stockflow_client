"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hooks";
import {
  Search,
  Bell,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarContent } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/products": "Products Catalog",
  "/categories": "Categories",
  "/orders": "Orders",
  "/restock": "Restock Queue",
  "/activity": "Activity Log",
};

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-blue-100 bg-white px-4 lg:px-8 dark:border-blue-800 dark:bg-blue-950">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50 lg:hidden dark:text-blue-400 dark:hover:bg-blue-900/40">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 border-none p-0 dark:bg-blue-900">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <h1 className="text-lg font-semibold tracking-tight text-blue-900 dark:text-blue-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-1 md:flex">
           <button className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-500/70 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-blue-400/70 dark:hover:bg-blue-900/40 dark:hover:text-blue-300">
             <Search className="h-4.5 w-4.5" />
           </button>
           <button className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-500/70 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-blue-400/70 dark:hover:bg-blue-900/40 dark:hover:text-blue-300">
             <Bell className="h-4.5 w-4.5" />
           </button>
           <div className="mx-1 h-4 w-px bg-blue-100 dark:bg-blue-800" />
           <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 border-l border-blue-100 pl-4 dark:border-blue-800">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
               {user?.name || "User"}
            </span>
            <span className="text-[10px] font-medium tracking-widest text-blue-500/70 uppercase">
               {user?.role || "Role"}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[13px] font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
