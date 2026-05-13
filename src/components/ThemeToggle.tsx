import { useEffect, useState } from "react";
import {
  applyTheme,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from "../utils/theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];

const ICON: Record<ThemePreference, string> = {
  system: "🖥",
  light: "☀",
  dark: "🌙",
};

const LABEL: Record<ThemePreference, string> = {
  system: "OS設定",
  light: "ライト",
  dark: "ダーク",
};

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePreference>(() => readThemePreference());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readThemePreference() === "system") applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(next);
    writeThemePreference(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn-secondary !px-2 !py-1.5 !text-base"
      aria-label={`テーマ切替（現在: ${LABEL[pref]}）`}
      title={`テーマ: ${LABEL[pref]}（クリックで切替）`}
    >
      {ICON[pref]}
    </button>
  );
}
