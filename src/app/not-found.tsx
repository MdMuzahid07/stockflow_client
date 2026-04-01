import { Button } from "@/components/ui/button";
import { Home, SearchIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="animate-in fade-in flex min-h-screen w-full flex-col items-center justify-center p-8 text-center duration-1000">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-600/10 blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/40">
          <SearchIcon className="h-10 w-10 animate-bounce" />
        </div>
        <div className="mt-6 text-[80px] leading-none font-black tracking-tighter text-blue-600/20">
          404
        </div>
      </div>

      <h2 className="text-foreground mb-2 text-3xl font-black tracking-tight">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-10 max-w-sm text-sm font-medium">
        The page you are looking for {`doesn't`} exist or has been moved to
        another coordinate.
      </p>

      <Button
        asChild
        className="h-12 rounded bg-blue-600 px-8 font-black shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
      >
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Link>
      </Button>

      <div className="text-muted-foreground/30 mt-16 text-[10px] font-extrabold tracking-[0.5em] uppercase">
        StockFlow &bull; Obsidian Tier Security
      </div>
    </div>
  );
}
