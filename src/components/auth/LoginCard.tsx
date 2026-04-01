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
    <div className="mx-auto w-full max-w-lg">
      <div className="bg-card/80 border-border shadow-primary/5 ring-border/50 relative rounded-4xl border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
        <div className="mb-5 flex flex-col items-center md:mb-8">
          <div className="relative mb-3 md:mb-4">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-primary/20 relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg md:h-12 md:w-12">
              <UserPlus className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
          </div>
          <h1 className="text-card-foreground text-center text-xl font-bold tracking-tight md:text-2xl">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1.5 text-center text-sm font-medium">
            Sign in to your StockFlow account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              Email Address
            </label>
            <div className="group relative">
              <Mail className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded-xl pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.email ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500/80">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="group space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 text-[10px] font-bold"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 pr-10 pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500/80">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-bold text-red-500">
              {(error as any)?.data?.message ||
                "Invalid credentials. Please try again."}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="group bg-cyber-gradient shadow-primary/20 relative h-10 w-full overflow-hidden rounded-xl text-base font-black text-white shadow-lg ring-1 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 md:h-12"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>

          <TestLoginButton />

          <div className="relative my-5 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border/50 w-full border-t" />
            </div>
            <div className="text-muted-foreground relative flex justify-center text-[10px] font-bold tracking-[0.3em] uppercase">
              <span className="bg-card px-3">Or</span>
            </div>
          </div>
        </form>

        <p className="text-muted-foreground mt-5 text-center text-xs font-medium md:mt-8">
          New here?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-bold underline decoration-2 underline-offset-4 transition-colors"
          >
            Join StockFlow
          </Link>
        </p>
      </div>
    </div>
  );
};
