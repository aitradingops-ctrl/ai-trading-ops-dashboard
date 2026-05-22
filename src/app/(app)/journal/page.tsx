import { JournalManager } from "@/components/forms/journal-manager";
import { PageHeading } from "@/components/page-heading";
import { requirePageAccess } from "@/lib/page-guards";
import { listJournalEntries } from "@/lib/trading-data-service";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const context = await requirePageAccess();
  const entries = await listJournalEntries(context.sessionUser.email);

  return (
    <>
      <PageHeading
        title="Journal"
        description="Capture post-trade notes, tags, lessons, and a placeholder for future AI summaries."
      />
      <JournalManager initialEntries={entries} />
    </>
  );
}
