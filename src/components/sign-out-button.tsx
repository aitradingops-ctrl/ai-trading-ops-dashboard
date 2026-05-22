"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui";

export function SignOutButton() {
  return (
    <Button type="button" variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </Button>
  );
}
