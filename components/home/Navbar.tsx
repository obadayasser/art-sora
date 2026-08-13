"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher, ThemeToggle } from "../ui";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
    const t = useTranslations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { getCartCount, setIsOpen } = useCart();

    const navLinks = [
        { href: "/", label: t("common.home") },
        { href: "/products", label: t("common.products") },
        { href: "/categories", label: t("common.categories") },
        { href: "/about", label: t("common.about") },
        { href: "/contact", label: t("common.contact") },
    ];


    return (
        <nav className="sticky shadow-md top-0 z-50 w-full bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--card-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Mobile: Menu + Logo, Desktop: Logo only */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button - shown first on mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--card-border)] transition-all duration-200 active:scale-95"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? (
                                <HiX className="w-5 h-5 text-[var(--foreground)]" />
                            ) : (
                                <HiMenu className="w-5 h-5 text-[var(--foreground)]" />
                            )}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <Image
                                    src="/logo.png"
                                    alt="ArtSora logo"
                                    width={80}
                                    height={45}
                                    className="rounded-2xl transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-accent-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-3xl mx-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium transition-colors duration-200 ${
                                    pathname === link.href
                                        ? "text-[var(--color)]"
                                        : "text-[var(--foreground)] hover:text-[var(--color)]"
                                }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--color)]" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2">
                        {/* Desktop: Show language and theme toggles */}
                        <div className="hidden md:flex items-center gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={() => setIsOpen(true)}
                            aria-label={t("cart.title")}
                            className="relative p-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--card-border)] transition-all duration-200 group"
                        >
                            <ShoppingCart className="w-5 h-5 text-[var(--foreground)] group-hover:text-[var(--color)] transition-colors" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-contrast text-xs rounded-full flex items-center justify-center font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--card-border)] animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1">
                            {/* Navigation Links */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                        pathname === link.href
                                            ? "bg-[var(--color)]/10 text-[var(--color)]"
                                            : "text-[var(--foreground)] hover:bg-[var(--card-bg)]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{link.label}</span>
                                        {pathname === link.href && (
                                            <div className="w-2 h-2 rounded-full bg-[var(--color)]" />
                                        )}
                                    </div>
                                </Link>
                            ))}

                            {/* Settings section */}
                            <div className="mt-4 pt-4 border-t border-[var(--card-border)] px-2 space-y-2">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">{t("common.settings")}</span>
                                </div>
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <span className="text-sm text-[var(--foreground)]">{t("common.language")}</span>
                                    <LanguageSwitcher />
                                </div>
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <span className="text-sm text-[var(--foreground)]">{t("common.theme")}</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
