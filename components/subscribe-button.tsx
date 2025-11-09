"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import clsx from "clsx";

interface SubscribeButtonProps {
  planId: string;
  className?: string;
}

export default function SubscribeButton({ planId, className }: SubscribeButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (status !== "authenticated") {
      signIn();
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to start checkout");
      return;
    }

    const { url } = await response.json();
    if (url) {
      router.push(url);
    }
  }

  return (
    <div className={clsx("space-y-2", className)}>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/60"
      >
        {loading ? "Redirecting…" : "Subscribe"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
