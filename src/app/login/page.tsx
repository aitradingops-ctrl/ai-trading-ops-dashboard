import { SignInButton } from "@/components/sign-in-button";
import { Card } from "@/components/ui";
import { publicConfig } from "@/lib/public-config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; restricted?: string }>;
}) {
  const params = await searchParams;
  const isRestricted = params.restricted === "1" || params.error === "AccessDenied";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.22),transparent_34rem),#020617] px-4 py-6 text-slate-100 sm:py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            {publicConfig.appName}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Sign in to the operations dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Use your approved Google account for {publicConfig.appDomain}.
            Access is checked server-side against the Users tab, PayPal
            subscription status, and admin grants.
          </p>
        </div>
        {isRestricted ? (
          <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
            Access is currently restricted. Please contact AI Trading Ops support.
          </div>
        ) : null}
        <SignInButton callbackUrl={params.callbackUrl || "/dashboard"} />
        <p className="mt-6 text-xs leading-5 text-slate-500">
          Google OAuth identifies you. It does not expose Google Sheets,
          PayPal, or OAuth secrets to the browser.
        </p>
      </Card>
    </main>
  );
}
