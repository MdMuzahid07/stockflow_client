import { RegisterCard } from "@/components/auth/RegisterCard";
import { Metadata } from "next";
import { ShieldCheck, Zap, BarChart3, Package2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | StockFlow",
  description: "Create a new StockFlow account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="relative hidden w-full flex-col justify-between bg-blue-600 p-10 text-white lg:flex lg:w-1/2 dark:bg-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=2054&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="relative z-10 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg shadow-blue-500/20">
            <Package2 className="h-6 w-6 text-blue-600" />
          </div>
          StockFlow
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Grow Your Business. Master Your Stock.
            </p>
            <footer className="text-lg font-medium text-blue-100">
              Join thousands of businesses streamlining their operations.
            </footer>
          </blockquote>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Fast Onboarding</p>
                <p className="text-sm text-blue-100/70">Get started in minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Scalable solution</p>
                <p className="text-sm text-blue-100/70">Built for growth</p>
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
        <RegisterCard />
      </div>
    </div>
  );
}
