import Dexie, { type Table } from "dexie";
import type { Purchase } from "../types/purchase";
import seedPurchases from "../data/purchases.json";

class CoffeeDB extends Dexie {
  purchases!: Table<Purchase, string>;

  constructor() {
    super("CoffeeBeanTracker");
    this.version(1).stores({
      purchases: "id, date, countryCode, roaster, process",
    });
  }
}

export const db = new CoffeeDB();

const SEED_FLAG = "coffee-bean-tracker:seeded:v1";

export async function ensureSeeded(): Promise<void> {
  if (localStorage.getItem(SEED_FLAG)) return;
  const count = await db.purchases.count();
  if (count === 0) {
    const now = new Date().toISOString();
    await db.purchases.bulkAdd(
      (seedPurchases as Purchase[]).map((p) => ({
        ...p,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }
  localStorage.setItem(SEED_FLAG, "1");
}
