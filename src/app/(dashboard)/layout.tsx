import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-20 md:pb-8 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
