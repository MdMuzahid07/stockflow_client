/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
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
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm dark:border-blue-800 dark:bg-blue-900">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-900/20">
              <Mail className="h-8 w-8" />
            </div>

            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
              Verify your email
            </h2>

            <p className="mb-8 text-sm leading-relaxed text-blue-500/70">
              {`We've`} sent a verification link to <br />
              <span className="font-semibold text-blue-900 dark:text-blue-100">
                {getValues("email")}
              </span>
              <br />
              Please check your inbox to activate your account.
            </p>

            <Button
              onClick={() => router.push("/")}
              className="h-10 w-full font-medium"
            >
              Continue to Dashboard
            </Button>

            <p className="mt-6 text-xs text-blue-400">
              {`Didn't`} receive the email?{" "}
              <button
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
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
      <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm dark:border-blue-800 dark:bg-blue-900">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            Create account
          </h1>
          <p className="mt-2 text-sm text-blue-500/70">
            Join StockFlow and start managing your inventory today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={cn(
                  "pl-10",
                  errors.name &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
                )}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
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
                  errors.email &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
                )}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
                <Input
                  type={showPassword.password ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "pr-10 pl-10",
                    errors.password &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  {showPassword.password ? (
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900 italic dark:text-blue-100">
                Confirm
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
                <Input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={cn(
                    "pr-10 pl-10",
                    errors.confirmPassword &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
              {(error as any)?.data?.message ||
                "Registration failed. Please check your inputs."}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full text-sm font-semibold"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Join now"
            )}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-blue-100 dark:border-blue-800"></div>
            <span className="mx-4 shrink text-[11px] font-medium tracking-widest text-blue-400 uppercase">
              or
            </span>
            <div className="grow border-t border-blue-100 dark:border-blue-800"></div>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-blue-500/70">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
