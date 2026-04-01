"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  History,
  LayoutDashboard,
  LogOut,
  Package,
  RefreshCcw,
  ShoppingCart,
  Tags,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
        "relative hidden h-screen flex-col border-r border-blue-100 bg-white transition-all duration-300 ease-in-out lg:flex dark:border-blue-800 dark:bg-blue-900",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}

export function SidebarContent({
  isCollapsed = false,
  onItemClick,
}: {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch (err) {
      console.warn("Server-side logout failed, performing local cleanup:", err);
    } finally {
      dispatch(logoutAction());
      router.push("/login");
      onItemClick?.();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-blue-100 px-6 dark:border-blue-800">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
          onClick={onItemClick}
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-blue-50 p-1 ring-1 ring-blue-100 dark:bg-blue-800/20 dark:ring-blue-800">
            <Image
              src="/images/stockflow-logo.png"
              alt="StockFlow"
              width={24}
              height={24}
              className="h-full w-full object-contain"
            />
          </div>
          {!isCollapsed && <span className="text-lg text-blue-900 dark:text-blue-100">StockFlow</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200"
                  : "text-blue-500/70 hover:bg-blue-50/50 hover:text-blue-600 dark:text-blue-400 dark:hover:bg-blue-800/30",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Footer */}
      <div className="border-t border-blue-100 p-4 dark:border-blue-800">
        {!isCollapsed && (
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden text-xs">
              <span className="font-semibold text-blue-900 truncate dark:text-blue-100">
                {user?.name || "User"}
              </span>
              <span className="text-blue-500/70 truncate uppercase tracking-widest text-[10px]">
                {user?.role || "Role"}
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "h-10 w-full justify-start gap-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20",
            isCollapsed && "justify-center px-0",
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
