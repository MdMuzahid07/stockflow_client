"use client";

import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const TestLoginButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleTestLogin = async () => {
    try {
      const credentials = {
        email: "mdmuzahid.dev@gmail.com",
        password: "stockflow@123",
      };
      const result = await login(credentials).unwrap();
      dispatch(
        setCredentials({ user: result.user, accessToken: result.accessToken }),
      );
      router.push("/");
    } catch (err) {
      console.error("Test login failed:", err);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleTestLogin}
      disabled={isLoading}
      variant="outline"
      className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 relative h-10 w-full overflow-hidden rounded text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 md:h-11"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className="text-primary flex items-center justify-center gap-2">
          <Rocket className="h-4 w-4" />
          Test Login (Guest)
        </span>
      )}
    </Button>
  );
};
