"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hooks";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SidebarContent } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="bg-muted/50 hover:bg-muted flex h-10 w-10 items-center justify-center rounded transition-colors lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-none p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-bold tracking-tight">
              {user?.name || "User Name"}
            </span>
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {user?.role || "User"}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
