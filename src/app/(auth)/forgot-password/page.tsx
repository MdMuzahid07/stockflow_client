import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password | StockFlow",
  description: "Password recovery for your StockFlow account",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6 dark:bg-blue-950">
      <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-8 shadow-sm dark:border-blue-800 dark:bg-blue-900">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
          Forgot password
        </h1>
        <p className="mt-3 text-sm text-blue-600/80 dark:text-blue-300/80">
          Password reset flow is not available yet. Please contact support or return to login.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
