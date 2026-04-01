import { LoginCard } from "@/components/auth/LoginCard";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login | StockFlow",
  description: "Sign in to your StockFlow account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="relative hidden w-full flex-col justify-between bg-blue-600 p-10 text-white lg:flex lg:w-1/2 dark:bg-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad86d7950c4?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay transition-opacity duration-700" />

        <div className="relative z-10 flex items-center gap-2 text-xl font-semibold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-2">
            <Image
              src="/images/stockflow-logo.png"
              alt="StockFlow"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
          StockFlow
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-4">
            <h2 className="text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
              Precision.<br />Inventory.<br />Mastery.
            </h2>
            <footer className="text-lg font-medium text-blue-100/80">
              The professional standard for inventory management and order fulfillment.
            </footer>
          </blockquote>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Real-time Sync</p>
                <p className="text-xs text-blue-100/60">Automated stock tracking</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Smart Insights</p>
                <p className="text-xs text-blue-100/60">Data-driven decisions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-blue-100/40">
          <ShieldCheck className="h-4 w-4" />
          Enterprise Grade Security
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full items-center justify-center bg-blue-50 p-6 lg:w-1/2 dark:bg-blue-950">
        <LoginCard />
      </div>
    </div>
  );
}
