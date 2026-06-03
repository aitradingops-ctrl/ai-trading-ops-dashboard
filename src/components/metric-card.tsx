import { Card } from "@/components/ui";

export function MetricCard({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "green" | "red" | "blue";
}) {
  const valueTone = {
    default: "text-white",
    green: "text-emerald-300",
    red: "text-rose-300",
    blue: "text-cyan-200",
  };

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-3 text-2xl font-semibold tracking-tight sm:text-3xl ${valueTone[tone]}`}>
        {value}
      </p>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </Card>
  );
}
