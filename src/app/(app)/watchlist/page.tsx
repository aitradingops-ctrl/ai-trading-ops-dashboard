import { WatchlistManager } from "@/components/forms/watchlist-manager";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { getUserSettings } from "@/lib/settings-service";
import { listWatchlist } from "@/lib/trading-data-service";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const context = await requirePageAccess();
  const [items, settings] = await Promise.all([
    listWatchlist(context.sessionUser.email),
    getUserSettings(context.sessionUser.email),
  ]);

  return (
    <>
      <PageHeading
        title="Watchlist"
        description="Manage tickers, strategies, sectors, notes, and open an embedded TradingView chart for any symbol."
      />
      <WatchlistManager initialItems={items} settings={settings} />
    </>
  );
}
