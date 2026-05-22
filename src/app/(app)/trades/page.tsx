import { TradesManager } from "@/components/forms/trades-manager";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { listTrades } from "@/lib/trading-data-service";

export const dynamic = "force-dynamic";

export default async function TradesPage() {
  const context = await requirePageAccess();
  const trades = await listTrades(context.sessionUser.email);

  return (
    <>
      <PageHeading
        title="Trades"
        description="Journal trade plans, open positions, exits, P/L, and lessons without autonomous execution."
      />
      <TradesManager initialTrades={trades} />
    </>
  );
}
