export type Process = "washed" | "natural" | "honey" | "anaerobic" | "other";

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
