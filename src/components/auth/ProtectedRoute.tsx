"use client";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "manager")[];
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { isLoading: isFetchingUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isFetchingUser) {
      router.push("/login");
    } else if (
      isAuthenticated &&
      user &&
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.push("/"); // Redirect to dashboard if role not allowed
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, isFetchingUser, user, allowedRoles, router]);

  if (isChecking || isFetchingUser) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-blue-50 dark:bg-blue-950">
        <div className="relative mb-8 flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-600/20" />
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded bg-white p-2 shadow-xl ring-1 shadow-blue-500/20 ring-blue-600/20">
              <Image
                src="/images/stockflow-logo.png"
                alt="StockFlow"
                width={48}
                height={48}
                className="h-full w-full animate-pulse object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-black tracking-widest text-blue-600 uppercase">
              StockFlow
            </p>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
