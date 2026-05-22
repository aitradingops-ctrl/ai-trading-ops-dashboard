"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

export function PricingSubscribeButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function createSubscription() {
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/paypal/create-subscription", {
      method: "POST",
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Unable to create PayPal subscription.");
      return;
    }

    if (payload.data?.approveUrl) {
      window.location.href = payload.data.approveUrl;
      return;
    }

    setStatus("error");
    setMessage("PayPal did not return an approval URL.");
  }

  return (
    <div className="grid gap-3">
      <Button type="button" onClick={createSubscription} disabled={status === "loading"}>
        {status === "loading" ? "Opening PayPal..." : "Subscribe with PayPal"}
      </Button>
      {message ? <p className="text-sm text-rose-300">{message}</p> : null}
    </div>
  );
}
