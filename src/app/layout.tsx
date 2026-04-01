import { ThemeProvider } from "@/provider/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "../provider/ReduxProvider";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import "./globals.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StockFlow - Inventory Management System",
    template: "%s | StockFlow",
  },
  description:
    "StockFlow is a smart inventory and order management system designed to help businesses manage products, stock levels, and customer orders with ease.",
  keywords: [
    "inventory management",
    "order management",
    "stock tracking",
    "business solutions",
  ],
  authors: [{ name: "mdmuzahid.dev@gmail.com" }],

  openGraph: {
    title: "StockFlow - Inventory Management System",
    description: "Manage your inventory and orders efficiently.",
    type: "website",
    locale: "en_US",
    siteName: "StockFlow",
  },

  twitter: {
    card: "summary_large_image",
    title: "StockFlow - Inventory Management System",
    description: "Manage your inventory and orders efficiently.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" richColors closeButton />
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
