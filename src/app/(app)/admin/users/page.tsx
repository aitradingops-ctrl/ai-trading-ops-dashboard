import { AdminUsersManager } from "@/components/forms/admin-users-manager";
import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui";
import { listUsers } from "@/lib/access-control";
import { requireAdminPageAccess } from "@/lib/page-guards";
import { publicConfig } from "@/lib/public-config";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdminPageAccess();
  const users = await listUsers();

  return (
    <>
      <PageHeading
        title="Admin"
        description="Admin-only access control for manual grants, suspensions, roles, notes, PayPal access cleanup, and project resources."
      />
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Admin resource
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              {publicConfig.appName} Project Drive
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Shared Drive folder for project documents, exports, and operating
              materials.
            </p>
          </div>
          <a
            href={publicConfig.projectDriveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 md:w-auto"
          >
            Open Project Drive
          </a>
        </div>
      </Card>
      <AdminUsersManager initialUsers={users} />
    </>
  );
}
