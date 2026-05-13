import type { Purchase } from "../types/purchase";
import { PROCESS_OPTIONS, ROAST_LEVEL_OPTIONS } from "../types/purchase";
import { getCountry } from "../utils/countries";

const processLabel = (p: Purchase["process"]) =>
  PROCESS_OPTIONS.find((o) => o.value === p)?.label ?? p;

const roastLabel = (r: Purchase["roastLevel"]) =>
  r ? ROAST_LEVEL_OPTIONS.find((o) => o.value === r)?.label ?? r : null;

interface Props {
  purchase: Purchase;
  onEdit: (p: Purchase) => void;
  onDelete: (p: Purchase) => void;
}

export function PurchaseCard({ purchase, onEdit, onDelete }: Props) {
  const country = getCountry(purchase.countryCode);
  const roast = roastLabel(purchase.roastLevel);
  return (
    <article className="card flex flex-col gap-2">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">{purchase.beanName}</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">{purchase.roaster}</p>
        </div>
        <span className="shrink-0 rounded-full bg-coffee-100 px-2 py-0.5 text-xs text-coffee-700 dark:bg-coffee-700/30 dark:text-coffee-100">
          {purchase.grams}g
        </span>
      </header>
      {purchase.rating ? (
        <div
          className="text-sm leading-none text-amber-500"
          aria-label={`評価 ${purchase.rating} / 5`}
        >
          {"★".repeat(purchase.rating)}
          <span className="text-stone-300 dark:text-stone-600">{"★".repeat(5 - purchase.rating)}</span>
        </div>
      ) : null}
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs text-stone-600 dark:text-stone-300">
        <dt className="text-stone-400 dark:text-stone-500">購入日</dt>
        <dd>{purchase.date}</dd>
        <dt className="text-stone-400 dark:text-stone-500">原産国</dt>
        <dd>
          {country.flag} {country.name}
          {purchase.region ? ` / ${purchase.region}` : ""}
        </dd>
        <dt className="text-stone-400 dark:text-stone-500">精製</dt>
        <dd>{processLabel(purchase.process)}</dd>
        {roast && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">焙煎度</dt>
            <dd>{roast}</dd>
          </>
        )}
        {purchase.roastDate && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">焙煎日</dt>
            <dd>{purchase.roastDate}</dd>
          </>
        )}
        {purchase.variety && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">品種</dt>
            <dd>{purchase.variety}</dd>
          </>
        )}
        {purchase.farm && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">農園</dt>
            <dd>{purchase.farm}</dd>
          </>
        )}
        {purchase.altitude != null && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">標高</dt>
            <dd>{purchase.altitude.toLocaleString()} m</dd>
          </>
        )}
        {purchase.price != null && (
          <>
            <dt className="text-stone-400 dark:text-stone-500">価格</dt>
            <dd>
              ¥{purchase.price.toLocaleString()}
              {purchase.grams > 0 && (
                <span className="ml-1 text-stone-400 dark:text-stone-500">
                  (¥{Math.round((purchase.price / purchase.grams) * 100).toLocaleString()}/100g)
                </span>
              )}
            </dd>
          </>
        )}
      </dl>
      {purchase.notes && (
        <p className="rounded-md bg-stone-50 p-2 text-xs italic text-stone-600 dark:bg-stone-900/50 dark:text-stone-300">{purchase.notes}</p>
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
