import { SettingsForm } from "@/components/forms/settings-form";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { getUserSettings } from "@/lib/settings-service";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const context = await requirePageAccess();
  const settings = await getUserSettings(context.sessionUser.email);

  return (
    <>
      <PageHeading
        title="Settings"
        description="Customize dashboard widgets, risk preferences, alert thresholds, TradingView defaults, and webhook token."
      />
      <SettingsForm
        initialSettings={settings}
        userEmail={context.sessionUser.email}
      />
    </>
  );
}
