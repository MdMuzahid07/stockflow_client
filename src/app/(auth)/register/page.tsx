import { RegisterCard } from "@/components/auth/RegisterCard";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register | StockFlow",
  description: "Create a new StockFlow account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="relative hidden w-full flex-col justify-between bg-blue-600 p-10 text-white lg:flex lg:w-1/2 dark:bg-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay transition-opacity duration-700" />

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
              Grow Your Business.<br />Master Your Stock.
            </h2>
            <footer className="text-lg font-medium text-blue-100/80">
              Join thousands of businesses streamlining their operations with StockFlow.
            </footer>
          </blockquote>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Fast Onboarding</p>
                <p className="text-xs text-blue-100/60">Get started in minutes</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Scalable solution</p>
                <p className="text-xs text-blue-100/60">Built for enterprise growth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs font-medium text-blue-100/40">
          <ShieldCheck className="h-4 w-4" />
          Enterprise Grade Trust & Security
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full items-center justify-center bg-blue-50 p-6 lg:w-1/2 dark:bg-blue-950">
        <RegisterCard />
      </div>
    </div>
  );
}
