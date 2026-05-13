export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "coffee-bean-tracker:theme";

export function readThemePreference(): ThemePreference {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function writeThemePreference(pref: ThemePreference): void {
  localStorage.setItem(STORAGE_KEY, pref);
}

export function isDarkActive(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(pref: ThemePreference): void {
  const dark = isDarkActive(pref);
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#1c1917" : "#3e2917");
}

export function initThemeEarly(): void {
  applyTheme(readThemePreference());
}
