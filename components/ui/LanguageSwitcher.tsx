"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, locales, localeNames, type Locale } from "../providers/LanguageProvider";
import { HiGlobeAlt, HiChevronDown } from "react-icons/hi";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-border)] transition-colors text-[var(--foreground)]"
        aria-label="Change language"
      >
        <HiGlobeAlt className="w-5 h-5" />
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
        <HiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 min-w-[150px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left rtl:text-right text-sm
                hover:bg-[var(--card-border)] transition-colors
                ${locale === loc ? "text-primary font-medium" : "text-[var(--foreground)]"}
              `}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
