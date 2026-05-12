import type { Purchase } from "../types/purchase";

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parsePurchasesJson(text: string): Purchase[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("JSON のトップレベルは配列である必要があります");
  return parsed.map((raw, i) => {
    if (typeof raw !== "object" || raw === null) throw new Error(`item[${i}] is not an object`);
    const r = raw as Record<string, unknown>;
    const required = ["id", "date", "countryCode", "beanName", "roaster", "grams", "process"];
    for (const k of required) {
      if (!(k in r)) throw new Error(`item[${i}] missing required field "${k}"`);
    }
    return {
      id: String(r.id),
      date: String(r.date),
      countryCode: String(r.countryCode),
      region: r.region == null ? undefined : String(r.region),
      beanName: String(r.beanName),
      roaster: String(r.roaster),
      grams: Number(r.grams),
      process: String(r.process) as Purchase["process"],
      notes: r.notes == null ? undefined : String(r.notes),
      createdAt: r.createdAt == null ? undefined : String(r.createdAt),
      updatedAt: r.updatedAt == null ? undefined : String(r.updatedAt),
    };
  });
}
