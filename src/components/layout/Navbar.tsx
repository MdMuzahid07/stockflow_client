"use client";
import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 hover:bg-muted lg:hidden transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="relative hidden sm:block w-64 md:w-96">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, records..."
            className="w-full rounded-xl border-none bg-muted/50 pl-10 focus-visible:ring-1 focus-visible:ring-blue-500/50"
          />
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 sm:hidden">
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 transition-colors hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-background bg-blue-600" />
        </button>

        <div className="h-8 w-px bg-border mx-1 md:mx-2" />

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-bold tracking-tight">
              {user?.name || "User Name"}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {user?.role || "Manager"}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
