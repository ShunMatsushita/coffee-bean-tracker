import { useEffect, useState, type FormEvent } from "react";
import { PROCESS_OPTIONS, type Process, type Purchase } from "../types/purchase";
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
