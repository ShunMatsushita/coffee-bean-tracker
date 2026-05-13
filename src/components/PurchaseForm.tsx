import { useEffect, useState, type FormEvent } from "react";
import {
  PROCESS_OPTIONS,
  ROAST_LEVEL_OPTIONS,
  type Process,
  type Purchase,
  type RoastLevel,
} from "../types/purchase";
import { COFFEE_COUNTRIES } from "../utils/countries";

export interface PurchaseFormValues {
  date: string;
  countryCode: string;
  region: string;
  beanName: string;
  roaster: string;
  grams: number;
  process: Process;
  notes: string;
  roastLevel: RoastLevel | "";
  roastDate: string;
  price: string;
  variety: string;
  farm: string;
  altitude: string;
  rating: number;
}

const empty = (): PurchaseFormValues => ({
  date: new Date().toISOString().slice(0, 10),
  countryCode: "ETH",
  region: "",
  beanName: "",
  roaster: "",
  grams: 200,
  process: "washed",
  notes: "",
  roastLevel: "",
  roastDate: "",
  price: "",
  variety: "",
  farm: "",
  altitude: "",
  rating: 0,
});

function fromPurchase(p: Purchase): PurchaseFormValues {
  return {
    date: p.date,
    countryCode: p.countryCode,
    region: p.region ?? "",
    beanName: p.beanName,
    roaster: p.roaster,
    grams: p.grams,
    process: p.process,
    notes: p.notes ?? "",
    roastLevel: p.roastLevel ?? "",
    roastDate: p.roastDate ?? "",
    price: p.price != null ? String(p.price) : "",
    variety: p.variety ?? "",
    farm: p.farm ?? "",
    altitude: p.altitude != null ? String(p.altitude) : "",
    rating: p.rating ?? 0,
  };
}

interface Props {
  initial?: Purchase;
  onSubmit: (values: PurchaseFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function PurchaseForm({ initial, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<PurchaseFormValues>(() =>
    initial ? fromPurchase(initial) : empty(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [showDetail, setShowDetail] = useState(() =>
    initial
      ? Boolean(
          initial.roastLevel ??
            initial.roastDate ??
            initial.price ??
            initial.variety ??
            initial.farm ??
            initial.altitude ??
            initial.rating,
        )
      : false,
  );

  useEffect(() => {
    setValues(initial ? fromPurchase(initial) : empty());
  }, [initial]);

  const update = <K extends keyof PurchaseFormValues>(key: K, value: PurchaseFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.beanName.trim() || !values.roaster.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="label">購入日</label>
        <input
          type="date"
          className="input"
          value={values.date}
          onChange={(e) => update("date", e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">グラム</label>
        <input
          type="number"
          min={1}
          className="input"
          value={values.grams}
          onChange={(e) => update("grams", Number(e.target.value))}
          required
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">原産国</label>
        <select
          className="input"
          value={values.countryCode}
          onChange={(e) => update("countryCode", e.target.value)}
        >
          {COFFEE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="label">精製方法</label>
        <select
          className="input"
          value={values.process}
          onChange={(e) => update("process", e.target.value as Process)}
        >
          {PROCESS_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="label">地域 / 農園</label>
        <input
          type="text"
          className="input"
          placeholder="Yirgacheffe など"
          value={values.region}
          onChange={(e) => update("region", e.target.value)}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">豆の名前</label>
        <input
          type="text"
          className="input"
          placeholder="Konga G1 など"
          value={values.beanName}
          onChange={(e) => update("beanName", e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label">ロースター</label>
        <input
          type="text"
          className="input"
          placeholder="Onibus Coffee など"
          value={values.roaster}
          onChange={(e) => update("roaster", e.target.value)}
          required
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="button"
          className="text-xs font-medium text-coffee-600 hover:text-coffee-700"
          onClick={() => setShowDetail((s) => !s)}
          aria-expanded={showDetail}
        >
          {showDetail ? "▾ 詳細を隠す" : "▸ 詳細を入力する（焙煎度・価格・評価など）"}
        </button>
      </div>

      {showDetail && (
        <>
          <div className="sm:col-span-1">
            <label className="label">焙煎度</label>
            <select
              className="input"
              value={values.roastLevel}
              onChange={(e) => update("roastLevel", e.target.value as RoastLevel | "")}
            >
              <option value="">未設定</option>
              {ROAST_LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="label">焙煎日</label>
            <input
              type="date"
              className="input"
              value={values.roastDate}
              onChange={(e) => update("roastDate", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label">価格（円）</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="input"
              placeholder="1800"
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label">標高 (m)</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="input"
              placeholder="1800"
              value={values.altitude}
              onChange={(e) => update("altitude", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label">品種</label>
            <input
              type="text"
              className="input"
              placeholder="Geisha, SL28 など"
              value={values.variety}
              onChange={(e) => update("variety", e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="label">農園 / 生産者</label>
            <input
              type="text"
              className="input"
              placeholder="Hambela Estate など"
              value={values.farm}
              onChange={(e) => update("farm", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">自己評価</label>
            <StarRating
              value={values.rating}
              onChange={(n) => update("rating", n)}
            />
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label className="label">テイスティングノート</label>
        <textarea
          className="input min-h-[80px]"
          placeholder="ベリー、フローラル、ミルクチョコ..."
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {initial ? "更新する" : "追加する"}
        </button>
      </div>
    </form>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="自己評価">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} つ星`}
            className={`text-2xl leading-none transition ${
              filled ? "text-amber-500" : "text-stone-300 hover:text-amber-300"
            }`}
            onClick={() => onChange(value === n ? 0 : n)}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
      {value > 0 && (
        <button
          type="button"
          className="ml-2 text-xs text-stone-500 hover:text-stone-700"
          onClick={() => onChange(0)}
        >
          クリア
        </button>
      )}
    </div>
  );
}
