"use client";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  RefreshCcw,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: Tags, label: "Categories", href: "/categories" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: RefreshCcw, label: "Restock Queue", href: "/restock" },
  { icon: History, label: "Activity Log", href: "/activity" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative hidden h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out lg:flex",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md transition-transform hover:scale-110"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}

export function SidebarContent({ 
  isCollapsed = false, 
  onItemClick 
}: { 
  isCollapsed?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(logoutAction());
      router.push("/login");
      onItemClick?.();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={onItemClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
            <Package2 className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="text-xl">StockFlow</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
              pathname === item.href
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-xl p-3 text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
