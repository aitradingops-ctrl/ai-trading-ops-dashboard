"use client";

import { useState, useTransition } from "react";

import { Button, Card, CardHeader, Field, Input, Select, Textarea } from "@/components/ui";
import type { UserSettings } from "@/types/models";

export function SettingsForm({
  initialSettings,
  userEmail,
}: {
  initialSettings: UserSettings;
  userEmail: string;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateSetting(key: keyof UserSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function save(regenerateTradingViewWebhookToken = false) {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          regenerateTradingViewWebhookToken,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to save settings.");
        return;
      }

      setSettings(payload.data);
      setMessage("Settings saved.");
    });
  }

  const webhookUrl =
    typeof window === "undefined"
      ? "/api/tradingview/webhook"
      : `${window.location.origin}/api/tradingview/webhook`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader
          title="User customization"
          description={`Settings are saved by signed-in email: ${userEmail}`}
        />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Preferred watchlist tickers">
            <Input
              value={settings.preferredWatchlistTickers}
              onChange={(event) =>
                updateSetting("preferredWatchlistTickers", event.target.value)
              }
            />
          </Field>
          <Field label="Trading strategies">
            <Input
              value={settings.tradingStrategies}
              onChange={(event) => updateSetting("tradingStrategies", event.target.value)}
            />
          </Field>
          <Field label="Max daily loss">
            <Input
              value={settings.maxDailyLoss}
              onChange={(event) => updateSetting("maxDailyLoss", event.target.value)}
            />
          </Field>
          <Field label="Max position size">
            <Input
              value={settings.maxPositionSize}
              onChange={(event) => updateSetting("maxPositionSize", event.target.value)}
            />
          </Field>
          <Field label="Default confidence threshold">
            <Input
              value={settings.defaultConfidenceScoreThreshold}
              onChange={(event) =>
                updateSetting("defaultConfidenceScoreThreshold", event.target.value)
              }
            />
          </Field>
          <Field label="Preferred notification email">
            <Input
              type="email"
              value={settings.preferredNotificationEmail}
              onChange={(event) =>
                updateSetting("preferredNotificationEmail", event.target.value)
              }
              placeholder={userEmail}
            />
          </Field>
          <Field label="Default TradingView symbol">
            <Input
              value={settings.defaultTradingViewSymbol}
              onChange={(event) =>
                updateSetting("defaultTradingViewSymbol", event.target.value)
              }
              placeholder="NASDAQ:AAPL"
            />
          </Field>
          <Field label="Chart interval">
            <Input
              value={settings.preferredChartInterval}
              onChange={(event) =>
                updateSetting("preferredChartInterval", event.target.value)
              }
              placeholder="D"
            />
          </Field>
          <Field label="Chart theme">
            <Select
              value={settings.preferredChartTheme}
              onChange={(event) =>
                updateSetting("preferredChartTheme", event.target.value)
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </Field>
          <Field label="Dashboard widgets">
            <Input
              value={settings.dashboardWidgets}
              onChange={(event) => updateSetting("dashboardWidgets", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Risk limits">
              <Textarea
                value={settings.riskLimits}
                onChange={(event) => updateSetting("riskLimits", event.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Alert thresholds">
              <Textarea
                value={settings.alertThresholds}
                onChange={(event) => updateSetting("alertThresholds", event.target.value)}
              />
            </Field>
          </div>
          <Field label="Custom categories">
            <Input
              value={settings.customCategories}
              onChange={(event) => updateSetting("customCategories", event.target.value)}
            />
          </Field>
          <Field label="Custom tags">
            <Input
              value={settings.customTags}
              onChange={(event) => updateSetting("customTags", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Custom notes">
              <Textarea
                value={settings.customNotes}
                onChange={(event) => updateSetting("customNotes", event.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Button type="button" disabled={isPending} onClick={() => save(false)}>
              {isPending ? "Saving..." : "Save settings"}
            </Button>
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">
          TradingView alert webhook
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Use this URL and token in TradingView alerts. Token rotation takes
          effect immediately and old alert messages will be rejected.
        </p>
        <div className="mt-5 grid gap-4">
          <Field label="Webhook URL">
            <Input readOnly value={webhookUrl} />
          </Field>
          <Field label="Webhook token">
            <Textarea readOnly value={settings.tradingViewWebhookToken} />
          </Field>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => save(true)}
          >
            Regenerate webhook token
          </Button>
        </div>
      </Card>
    </div>
  );
}
