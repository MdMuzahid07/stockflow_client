import { LoginCard } from "@/components/auth/LoginCard";
import { Metadata } from "next";
import { ShieldCheck, Zap, BarChart3, Package2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | StockFlow",
  description: "Sign in to your StockFlow account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="relative hidden w-full flex-col justify-between bg-blue-600 p-10 text-white lg:flex lg:w-1/2 dark:bg-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="relative z-10 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg shadow-blue-500/20">
            <Package2 className="h-6 w-6 text-blue-600" />
          </div>
          StockFlow
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Precision. Inventory. Mastery.
            </p>
            <footer className="text-lg font-medium text-blue-100">
              The ultimate tool for inventory management and order fulfillment.
            </footer>
          </blockquote>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Real-time Sync</p>
                <p className="text-sm text-blue-100/70">Always up to date</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Smart Insights</p>
                <p className="text-sm text-blue-100/70">Data-driven decisions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-blue-100/50">
          <ShieldCheck className="h-4 w-4" />
          Secure Enterprise Grade Platform
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full items-center justify-center bg-blue-50 p-6 lg:w-1/2 dark:bg-blue-950">
        <LoginCard />
      </div>
    </div>
  );
}
