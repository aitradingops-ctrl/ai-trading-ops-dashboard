"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui";

export function SignInButton({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <Button
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl,
          prompt: "select_account",
        })
      }
      className="w-full"
    >
      Continue with Google
    </Button>
  );
}
