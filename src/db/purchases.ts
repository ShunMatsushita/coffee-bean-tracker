import { db } from "./database";
import type { Purchase } from "../types/purchase";

export function makeId(date: string, countryCode: string, beanName: string): string {
  const slug = beanName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const base = `${date}-${countryCode.toLowerCase()}-${slug || "bean"}`;
  return base;
}

export async function addPurchase(input: Omit<Purchase, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<string> {
  const now = new Date().toISOString();
  const baseId = input.id ?? makeId(input.date, input.countryCode, input.beanName);
  let id = baseId;
  let suffix = 1;
  while (await db.purchases.get(id)) {
    suffix += 1;
    id = `${baseId}-${suffix}`;
  }
  await db.purchases.add({ ...input, id, createdAt: now, updatedAt: now });
  return id;
}

export async function updatePurchase(id: string, patch: Partial<Purchase>): Promise<void> {
  await db.purchases.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deletePurchase(id: string): Promise<void> {
  await db.purchases.delete(id);
}

export async function clearAll(): Promise<void> {
  await db.purchases.clear();
}

export async function importPurchases(items: Purchase[], mode: "merge" | "replace"): Promise<{ added: number; updated: number }> {
  if (mode === "replace") {
    await db.purchases.clear();
  }
  let added = 0;
  let updated = 0;
  await db.transaction("rw", db.purchases, async () => {
    for (const item of items) {
      const existing = await db.purchases.get(item.id);
      if (existing) {
        await db.purchases.put({ ...existing, ...item, updatedAt: new Date().toISOString() });
        updated += 1;
      } else {
        await db.purchases.add({
          ...item,
          createdAt: item.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        added += 1;
      }
    }
  });
  return { added, updated };
}
