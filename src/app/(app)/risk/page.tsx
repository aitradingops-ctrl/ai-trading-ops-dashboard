import { RiskManager } from "@/components/forms/risk-manager";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { listRiskLogs, listTrades } from "@/lib/trading-data-service";

export const dynamic = "force-dynamic";

export default async function RiskPage() {
  const context = await requirePageAccess();
  const [riskLogs, trades] = await Promise.all([
    listRiskLogs(context.sessionUser.email),
    listTrades(context.sessionUser.email),
  ]);

  return (
    <>
      <PageHeading
        title="Risk"
        description="Monitor exposure, daily loss, max risk per trade, open positions, and desk warnings."
      />
      <RiskManager
        initialRiskLogs={riskLogs}
        openTrades={trades.filter((trade) => trade.status === "open")}
      />
    </>
  );
}
