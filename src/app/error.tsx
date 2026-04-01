"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-red-500/10 bg-red-500/5 p-8 text-center backdrop-blur-sm">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white shadow-xl shadow-red-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-black tracking-tight text-red-500">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-sm font-medium">
        We encountered an unexpected error while processing your request. Our
        team has been notified.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={() => reset()}
          className="rounded bg-red-500 px-6 font-bold shadow-lg shadow-red-500/20 hover:bg-red-600"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          asChild
          className="rounded border-red-500/20 px-6 font-bold hover:bg-red-500/5"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-[10px] font-bold tracking-[0.3em] text-red-500/30 uppercase">
        Error Code: {error.digest || "INTERNAL_ERROR"}
      </div>
    </div>
  );
}
