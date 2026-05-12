export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COFFEE_COUNTRIES: Country[] = [
  { code: "ETH", name: "エチオピア", flag: "🇪🇹" },
  { code: "KEN", name: "ケニア", flag: "🇰🇪" },
  { code: "RWA", name: "ルワンダ", flag: "🇷🇼" },
  { code: "BDI", name: "ブルンジ", flag: "🇧🇮" },
  { code: "TZA", name: "タンザニア", flag: "🇹🇿" },
  { code: "UGA", name: "ウガンダ", flag: "🇺🇬" },
  { code: "COL", name: "コロンビア", flag: "🇨🇴" },
  { code: "BRA", name: "ブラジル", flag: "🇧🇷" },
  { code: "GTM", name: "グアテマラ", flag: "🇬🇹" },
  { code: "CRI", name: "コスタリカ", flag: "🇨🇷" },
  { code: "PAN", name: "パナマ", flag: "🇵🇦" },
  { code: "HND", name: "ホンジュラス", flag: "🇭🇳" },
  { code: "NIC", name: "ニカラグア", flag: "🇳🇮" },
  { code: "SLV", name: "エルサルバドル", flag: "🇸🇻" },
  { code: "MEX", name: "メキシコ", flag: "🇲🇽" },
  { code: "PER", name: "ペルー", flag: "🇵🇪" },
  { code: "ECU", name: "エクアドル", flag: "🇪🇨" },
  { code: "BOL", name: "ボリビア", flag: "🇧🇴" },
  { code: "IDN", name: "インドネシア", flag: "🇮🇩" },
  { code: "VNM", name: "ベトナム", flag: "🇻🇳" },
  { code: "IND", name: "インド", flag: "🇮🇳" },
  { code: "PNG", name: "パプアニューギニア", flag: "🇵🇬" },
  { code: "TLS", name: "東ティモール", flag: "🇹🇱" },
  { code: "YEM", name: "イエメン", flag: "🇾🇪" },
  { code: "JAM", name: "ジャマイカ", flag: "🇯🇲" },
  { code: "OTHER", name: "その他", flag: "🌍" },
];

const byCode = new Map(COFFEE_COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string): Country {
  return byCode.get(code) ?? { code, name: code, flag: "🌍" };
}
