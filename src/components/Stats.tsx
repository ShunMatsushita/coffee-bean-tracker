import type { Purchase } from "../types/purchase";
import { getCountry } from "../utils/countries";

interface Props {
  purchases: Purchase[];
}

export function Stats({ purchases }: Props) {
  const total = purchases.length;
  const totalGrams = purchases.reduce((sum, p) => sum + (p.grams || 0), 0);
  const countries = new Set(purchases.map((p) => p.countryCode)).size;
  const roasters = new Set(purchases.map((p) => p.roaster)).size;

  const byCountry = new Map<string, number>();
  for (const p of purchases) {
    byCountry.set(p.countryCode, (byCountry.get(p.countryCode) ?? 0) + 1);
  }
  const topCountries = [...byCountry.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="grid gap-3 sm:grid-cols-4">
      <div className="card">
        <p className="text-xs text-stone-500">記録数</p>
        <p className="text-xl font-semibold text-stone-800">{total}</p>
      </div>
      <div className="card">
        <p className="text-xs text-stone-500">合計</p>
        <p className="text-xl font-semibold text-stone-800">{totalGrams.toLocaleString()}g</p>
      </div>
      <div className="card">
        <p className="text-xs text-stone-500">国の数</p>
        <p className="text-xl font-semibold text-stone-800">{countries}</p>
      </div>
      <div className="card">
        <p className="text-xs text-stone-500">ロースター数</p>
        <p className="text-xl font-semibold text-stone-800">{roasters}</p>
      </div>
      {topCountries.length > 0 && (
        <div className="card sm:col-span-4">
          <p className="mb-2 text-xs text-stone-500">よく買う国 (Top 5)</p>
          <ul className="flex flex-wrap gap-2">
            {topCountries.map(([code, n]) => {
              const c = getCountry(code);
              return (
                <li
                  key={code}
                  className="rounded-full bg-coffee-50 px-3 py-1 text-xs text-coffee-700"
                >
                  {c.flag} {c.name} <span className="text-coffee-500">×{n}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
