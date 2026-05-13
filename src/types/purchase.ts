export type Process = "washed" | "natural" | "honey" | "anaerobic" | "other";

export type RoastLevel = "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export interface Purchase {
  id: string;
  date: string;
  countryCode: string;
  region?: string;
  beanName: string;
  roaster: string;
  grams: number;
  process: Process;
  notes?: string;
  roastLevel?: RoastLevel;
  roastDate?: string;
  price?: number;
  variety?: string;
  farm?: string;
  altitude?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const PROCESS_OPTIONS: { value: Process; label: string }[] = [
  { value: "washed", label: "ウォッシュド" },
  { value: "natural", label: "ナチュラル" },
  { value: "honey", label: "ハニー" },
  { value: "anaerobic", label: "アナエロビック" },
  { value: "other", label: "その他" },
];

export const ROAST_LEVEL_OPTIONS: { value: RoastLevel; label: string }[] = [
  { value: "light", label: "ライト" },
  { value: "medium-light", label: "ミディアムライト" },
  { value: "medium", label: "ミディアム" },
  { value: "medium-dark", label: "ミディアムダーク" },
  { value: "dark", label: "ダーク" },
];
