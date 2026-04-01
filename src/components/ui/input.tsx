import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900 dark:focus-visible:ring-blue-500/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
