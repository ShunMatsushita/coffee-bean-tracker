import type { Purchase, RoastLevel } from "../types/purchase";

const ROAST_LEVELS: RoastLevel[] = ["light", "medium-light", "medium", "medium-dark", "dark"];

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
    const optStr = (v: unknown) => (v == null || v === "" ? undefined : String(v));
    const optNum = (v: unknown) => {
      if (v == null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };
    const roastRaw = optStr(r.roastLevel);
    const roastLevel = roastRaw && (ROAST_LEVELS as string[]).includes(roastRaw)
      ? (roastRaw as RoastLevel)
      : undefined;
    const ratingRaw = optNum(r.rating);
    const rating = ratingRaw != null && ratingRaw >= 1 && ratingRaw <= 5
      ? Math.round(ratingRaw)
      : undefined;
    return {
      id: String(r.id),
      date: String(r.date),
      countryCode: String(r.countryCode),
      region: optStr(r.region),
      beanName: String(r.beanName),
      roaster: String(r.roaster),
      grams: Number(r.grams),
      process: String(r.process) as Purchase["process"],
      notes: optStr(r.notes),
      roastLevel,
      roastDate: optStr(r.roastDate),
      price: optNum(r.price),
      variety: optStr(r.variety),
      farm: optStr(r.farm),
      altitude: optNum(r.altitude),
      rating,
      createdAt: optStr(r.createdAt),
      updatedAt: optStr(r.updatedAt),
    };
  });
}
