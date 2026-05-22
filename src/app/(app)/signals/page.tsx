import { SignalsManager } from "@/components/forms/signals-manager";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { getUserSettings } from "@/lib/settings-service";
import { listSignals } from "@/lib/trading-data-service";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const context = await requirePageAccess();
  const [signals, settings] = await Promise.all([
    listSignals(context.sessionUser.email),
    getUserSettings(context.sessionUser.email),
  ]);

  return (
    <>
      <PageHeading
        title="Signals"
        description="Track manual signals and TradingView alerts. Webhook events create Signals rows and Alerts_Log entries."
      />
      <SignalsManager initialSignals={signals} settings={settings} />
    </>
  );
}
