"use client";

import { useState, useTransition } from "react";

import {
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  TableShell,
  Textarea,
} from "@/components/ui";
import type { UserRecord } from "@/types/models";

const emptyForm = {
  userEmail: "",
  fullName: "",
  role: "manual_user",
  accessStatus: "active",
  accessType: "manual_grant",
  accessExpiresAt: "",
  notes: "",
};

export function AdminUsersManager({
  initialUsers,
}: {
  initialUsers: UserRecord[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refresh() {
    const response = await fetch("/api/admin/users");
    const payload = await response.json();

    if (response.ok) {
      setUsers(payload.data ?? []);
    }
  }

  function save(payload = form) {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        setMessage(body.error ?? "Unable to update user.");
        return;
      }

      setForm(emptyForm);
      setMessage("User updated.");
      await refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">Manual access</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Email">
            <Input
              type="email"
              value={form.userEmail}
              onChange={(event) => updateForm("userEmail", event.target.value)}
            />
          </Field>
          <Field label="Full name">
            <Input
              value={form.fullName}
              onChange={(event) => updateForm("fullName", event.target.value)}
            />
          </Field>
          <Field label="Role">
            <Select
              value={form.role}
              onChange={(event) => updateForm("role", event.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="paid_user">Paid user</option>
              <option value="manual_user">Manual user</option>
              <option value="suspended">Suspended</option>
            </Select>
          </Field>
          <Field label="Access status">
            <Select
              value={form.accessStatus}
              onChange={(event) => updateForm("accessStatus", event.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </Select>
          </Field>
          <Field label="Access type">
            <Select
              value={form.accessType}
              onChange={(event) => updateForm("accessType", event.target.value)}
            >
              <option value="manual_grant">Manual grant</option>
              <option value="admin">Admin</option>
              <option value="paypal_subscription">PayPal subscription</option>
              <option value="">None</option>
            </Select>
          </Field>
          <Field label="Access expires at">
            <Input
              value={form.accessExpiresAt}
              onChange={(event) => updateForm("accessExpiresAt", event.target.value)}
              placeholder="Optional ISO date"
            />
          </Field>
          <Field label="Notes">
            <Textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
            />
          </Field>
          <Button
            type="button"
            disabled={isPending || !form.userEmail}
            onClick={() => save()}
          >
            {isPending ? "Saving..." : "Save user access"}
          </Button>
          {message ? <p className="text-sm text-cyan-200">{message}</p> : null}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Users"
          description="Grant manual access, suspend users, change roles, update notes, or remove access."
        />
        <TableShell>
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="border-y border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Access</th>
                <th className="px-5 py-3">PayPal</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.userEmail} className="align-top text-slate-300">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{user.fullName || "No name"}</p>
                    <p className="font-mono text-xs text-slate-500">{user.userEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={user.role === "admin" ? "amber" : "slate"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="grid gap-1">
                      <Badge tone={user.accessStatus === "active" ? "green" : "red"}>
                        {user.accessStatus}
                      </Badge>
                      <span className="text-xs text-slate-500">{user.accessType || "none"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p>{user.subscriptionStatus || "none"}</p>
                    <p className="font-mono text-xs text-slate-500">
                      {user.paypalSubscriptionId || "No subscription"}
                    </p>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-slate-400">{user.notes}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          save({
                            ...user,
                            role: "manual_user",
                            accessStatus: "active",
                            accessType: "manual_grant",
                          })
                        }
                      >
                        Grant
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() =>
                          save({
                            ...user,
                            role: "suspended",
                            accessStatus: "suspended",
                          })
                        }
                      >
                        Suspend
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          save({
                            ...user,
                            role: "paid_user",
                            accessStatus: "inactive",
                            accessType: "",
                            notes: `${user.notes} Access removed manually.`.trim(),
                          })
                        }
                      >
                        Remove access
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setForm({
                            userEmail: user.userEmail,
                            fullName: user.fullName,
                            role: user.role,
                            accessStatus: user.accessStatus,
                            accessType: user.accessType,
                            accessExpiresAt: user.accessExpiresAt,
                            notes: user.notes,
                          })
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>
    </div>
  );
}
