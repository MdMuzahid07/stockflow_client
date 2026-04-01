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
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterCard: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [registerAccount, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated && !isSuccess) router.push("/");
  }, [isAuthenticated, router, isSuccess]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const result = await registerAccount(data).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );

      toast.success("Account created successfully!");
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed");
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="bg-card/80 shadow-primary/5 ring-border/50 relative rounded-4xl border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
              <div className="bg-background shadow-primary/20 relative flex h-20 w-20 items-center justify-center rounded-full shadow-lg ring-1 ring-green-500/20">
                <Mail className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <h2 className="text-card-foreground mb-2 text-2xl font-bold tracking-tight">
              Verify your email
            </h2>

            <p className="text-muted-foreground mb-6 text-sm leading-relaxed font-medium">
              {`We've`} sent a verification link to <br />
              <span className="text-foreground font-bold">
                {getValues("email")}
              </span>
              <br />
              Please check your inbox to activate your account.
            </p>

            <Button
              onClick={() => router.push("/")}
              className="bg-cyber-gradient shadow-primary/20 w-full rounded font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] md:h-12"
            >
              Continue to Dashboard
            </Button>

            <p className="text-muted-foreground/80 mt-4 text-xs">
              {`Didn't`} receive the email?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => toast.info("Resend feature coming soon")}
              >
                Click to resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="bg-card/80 border-border shadow-primary/5 ring-border/50 relative rounded-4xl border p-6 shadow-xl ring-1 backdrop-blur-xl md:p-8">
        <div className="mb-5 flex flex-col items-center md:mb-8">
          <div className="relative mb-3 md:mb-4">
            <div className="bg-cyber-gradient absolute inset-0 animate-pulse rounded-2xl opacity-40 blur-xl" />
            <div className="bg-cyber-gradient shadow-primary/20 relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg md:h-12 md:w-12">
              <ShieldCheck className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
          </div>
          <h1 className="text-card-foreground text-center text-xl font-bold tracking-tight md:text-2xl">
            Create Account
          </h1>
          <p className="text-muted-foreground mt-1.5 text-center text-sm font-medium">
            Join the StockFlow cosmos today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              Full Name
            </label>
            <div className="group relative">
              <User className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.name ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 ml-1 text-[10px] font-bold text-red-500/80">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              Email Address
            </label>
            <div className="group relative">
              <Mail className="group-focus-within:text-primary text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.email ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 ml-1 text-[10px] font-bold text-red-500/80">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                <input
                  type={showPassword.password ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/10 w-full rounded border py-2.5 pr-10 pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.password ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 focus:outline-none"
                >
                  {showPassword.password ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500/80">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                Confirm
              </label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                <Input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                  className={`focus:border-primary/50 focus:ring-primary/10 selection:bg-primary/30 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 h-10 rounded pl-10 text-sm transition-all focus:ring-2 md:h-11 ${errors.confirmPassword ? "border-red-500/50 ring-red-500/10 focus:border-red-500/50 focus:ring-red-500/10" : ""}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 focus:outline-none"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500/80">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded border border-red-500/20 bg-red-500/10 p-3 backdrop-blur-md">
              <div className="text-xs font-bold text-red-500">
                {(error as any)?.data?.message ||
                  "Registration failed. Please check your inputs."}
              </div>
              {(error as any)?.data?.errorSources && (
                <ul className="mt-2 space-y-1">
                  {(error as any).data.errorSources.map(
                    (source: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-red-500/70"
                      >
                        <span className="h-1 w-1 rounded-full bg-red-500/50" />
                        {source.message}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="group bg-cyber-gradient shadow-primary/20 relative h-10 w-full overflow-hidden rounded text-base font-black text-white shadow-lg ring-1 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 md:h-12"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Join Now{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>

          <div className="relative my-5 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border/50 w-full border-t" />
            </div>
            <div className="text-muted-foreground relative flex justify-center text-[10px] font-bold tracking-[0.3em] uppercase">
              <span className="bg-card px-3">Or</span>
            </div>
          </div>

          {/* Google login button removed temporarily */}
        </form>

        <p className="text-muted-foreground mt-5 text-center text-xs font-medium md:mt-8">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-bold underline decoration-2 underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
