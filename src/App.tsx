import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, ensureSeeded } from "./db/database";
import {
  addPurchase,
  deletePurchase,
  importPurchases,
  updatePurchase,
} from "./db/purchases";
import type { Purchase } from "./types/purchase";
import { PROCESS_OPTIONS } from "./types/purchase";
import { COFFEE_COUNTRIES } from "./utils/countries";
import { downloadJson, parsePurchasesJson } from "./utils/io";
import { PurchaseCard } from "./components/PurchaseCard";
import { PurchaseForm, type PurchaseFormValues } from "./components/PurchaseForm";
import { Modal } from "./components/Modal";
import { Stats } from "./components/Stats";

type SortKey = "date-desc" | "date-asc" | "grams-desc" | "grams-asc";

function App() {
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterProcess, setFilterProcess] = useState("");
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ensureSeeded().catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const purchases = useLiveQuery(() => db.purchases.toArray(), []) ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = purchases.filter((p) => {
      if (filterCountry && p.countryCode !== filterCountry) return false;
      if (filterProcess && p.process !== filterProcess) return false;
      if (!q) return true;
      return [p.beanName, p.roaster, p.region ?? "", p.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return a.date.localeCompare(b.date);
        case "grams-desc":
          return b.grams - a.grams;
        case "grams-asc":
          return a.grams - b.grams;
        case "date-desc":
        default:
          return b.date.localeCompare(a.date);
      }
    });
    return result;
  }, [purchases, query, filterCountry, filterProcess, sort]);

  const handleSubmit = async (values: PurchaseFormValues) => {
    const payload = {
      ...values,
      region: values.region.trim() || undefined,
      notes: values.notes.trim() || undefined,
    };
    if (editing) {
      await updatePurchase(editing.id, payload);
      setToast("更新しました");
    } else {
      await addPurchase(payload);
      setToast("追加しました");
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (p: Purchase) => {
    if (!window.confirm(`「${p.beanName}」を削除しますか？`)) return;
    await deletePurchase(p.id);
    setToast("削除しました");
  };

  const handleExport = () => {
    if (purchases.length === 0) {
      setToast("エクスポートできるデータがありません");
      return;
    }
    const filename = `coffee-purchases-${new Date().toISOString().slice(0, 10)}.json`;
    downloadJson(purchases, filename);
    setToast(`${purchases.length}件をエクスポートしました`);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const items = parsePurchasesJson(text);
      const mode = window.confirm(
        `${items.length}件を読み込みます。\n\n「OK」: 既存のデータに上書きマージ\n「キャンセル」: 全て置き換え（既存を削除）`,
      )
        ? "merge"
        : "replace";
      const { added, updated } = await importPurchases(items, mode);
      setToast(`インポート完了 (追加:${added} / 更新:${updated})`);
    } catch (e) {
      console.error(e);
      setToast(`インポート失敗: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-coffee-700">☕ Coffee Bean Tracker</h1>
          <p className="text-xs text-stone-500">買ったコーヒー豆を記録しよう</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + 新しく記録
          </button>
          <button type="button" className="btn-secondary" onClick={handleExport}>
            ⬇ エクスポート
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            ⬆ インポート
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      <Stats purchases={purchases} />

      <section className="mt-6 grid gap-2 sm:grid-cols-4">
        <input
          type="search"
          className="input sm:col-span-2"
          placeholder="豆名・ロースター・ノートで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        >
          <option value="">すべての国</option>
          {COFFEE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={filterProcess}
          onChange={(e) => setFilterProcess(e.target.value)}
        >
          <option value="">すべての精製</option>
          {PROCESS_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className="input sm:col-span-4"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="date-desc">購入日: 新しい順</option>
          <option value="date-asc">購入日: 古い順</option>
          <option value="grams-desc">グラム: 多い順</option>
          <option value="grams-asc">グラム: 少ない順</option>
        </select>
      </section>

      <section className="mt-4">
        {filtered.length === 0 ? (
          <div className="card text-center text-sm text-stone-500">
            該当する記録がありません
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PurchaseCard
                key={p.id}
                purchase={p}
                onEdit={(target) => {
                  setEditing(target);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <Modal
        open={showForm}
        title={editing ? "記録を編集" : "新しいコーヒー豆を記録"}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
      >
        <PurchaseForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      </Modal>

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-stone-800 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-stone-400">
        データはお使いのブラウザに保存されます。共有・バックアップにはエクスポート機能を使ってください。
      </footer>
    </div>
  );
}

export default App;
