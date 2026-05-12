import type { Purchase } from "../types/purchase";
import { PROCESS_OPTIONS } from "../types/purchase";
import { getCountry } from "../utils/countries";

const processLabel = (p: Purchase["process"]) =>
  PROCESS_OPTIONS.find((o) => o.value === p)?.label ?? p;

interface Props {
  purchase: Purchase;
  onEdit: (p: Purchase) => void;
  onDelete: (p: Purchase) => void;
}

export function PurchaseCard({ purchase, onEdit, onDelete }: Props) {
  const country = getCountry(purchase.countryCode);
  return (
    <article className="card flex flex-col gap-2">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-stone-800">{purchase.beanName}</h3>
          <p className="text-xs text-stone-500">{purchase.roaster}</p>
        </div>
        <span className="shrink-0 rounded-full bg-coffee-100 px-2 py-0.5 text-xs text-coffee-700">
          {purchase.grams}g
        </span>
      </header>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-stone-600">
        <dt className="text-stone-400">購入日</dt>
        <dd>{purchase.date}</dd>
        <dt className="text-stone-400">原産国</dt>
        <dd>
          {country.flag} {country.name}
          {purchase.region ? ` / ${purchase.region}` : ""}
        </dd>
        <dt className="text-stone-400">精製</dt>
        <dd>{processLabel(purchase.process)}</dd>
      </dl>
      {purchase.notes && (
        <p className="rounded-md bg-stone-50 p-2 text-xs italic text-stone-600">{purchase.notes}</p>
      )}
      <footer className="mt-1 flex justify-end gap-2">
        <button type="button" className="btn-secondary !py-1 !px-2 !text-xs" onClick={() => onEdit(purchase)}>
          編集
        </button>
        <button type="button" className="btn-danger !py-1 !px-2 !text-xs" onClick={() => onDelete(purchase)}>
          削除
        </button>
      </footer>
    </article>
  );
}
