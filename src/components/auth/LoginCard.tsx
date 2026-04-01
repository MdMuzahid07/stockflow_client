/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TestLoginButton } from "./TestLoginButton";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginCard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  // Handle Google Login Redirect
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userStr = searchParams.get("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, accessToken }));
      } catch (err) {
        console.error("Failed to parse Google login data:", err);
      }
    }
  }, [searchParams, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({ user: result.user, accessToken: result.accessToken }),
      );
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm dark:border-blue-800 dark:bg-blue-900">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-blue-500/70">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-900 dark:text-blue-100 italic">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={cn(
                  "pl-10",
                  errors.email && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-blue-900 dark:text-blue-100 italic">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={cn(
                  "pl-10 pr-10",
                  errors.password && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
              {(error as any)?.data?.message ||
                "Invalid credentials. Please try again."}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-sm font-medium"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-blue-100 dark:border-blue-800"></div>
            <span className="mx-4 shrink text-[11px] font-medium text-blue-400 uppercase tracking-widest">or</span>
            <div className="grow border-t border-blue-100 dark:border-blue-800"></div>
          </div>

          <TestLoginButton />
        </form>

        <p className="mt-8 text-center text-sm text-blue-500/70">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
