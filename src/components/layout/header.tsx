"use client";

import { locales, localeNames, type Locale } from "@/config/i18n";
import { getMainNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useRfqStore } from "@/lib/rfq-store";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, Globe, Mail, Menu, Search, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";

interface HeaderProps {
  whatsapp: string | null;
  email: string | null;
  functions: { slug: string; name: string }[];
  certifications: { slug: string; name: string }[];
}

export function Header({
  whatsapp,
  email,
  functions,
  certifications,
}: HeaderProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const rfqCount = useRfqStore((s) => s.items.length);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const nav = getMainNav(locale);

  const switchLocale = (loc: Locale) => {
    setLangOpen(false);
    const segments = pathname.split("/");
    segments[1] = loc;
    router.push(segments.join("/") || `/${loc}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-support transition-all duration-300",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-2 font-serif text-2xl font-semibold tracking-tight text-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-white">
              G
            </span>
            GulShop
          </Link>

          {/* Desktop Nav */}
          <nav className="ml-8 hidden items-center gap-1 lg:flex">
            {nav.map((link) => (
              <div key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground",
                    pathname === link.href && "text-foreground"
                  )}
                >
                  {t(link.labelKey)}
                </Link>
              </div>
            ))}

            {/* Functions mega menu */}
            {functions.length > 0 && (
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMenu("functions")}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  {t("nav.shopByFunctions")}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {activeMenu === "functions" && (
                  <div
                    onMouseEnter={() => setActiveMenu("functions")}
                    onMouseLeave={() => setActiveMenu(null)}
                    className="absolute left-0 top-full mt-1 w-72 rounded-lg border border-border bg-background p-3 shadow-lg"
                  >
                    {functions.map((f) => (
                      <Link
                        key={f.slug}
                        href={`/${locale}/functions/${f.slug}`}
                        className="block rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
                      >
                        {f.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certifications mega menu */}
            {certifications.length > 0 && (
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMenu("certs")}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  {t("nav.shopByCertifications")}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {activeMenu === "certs" && (
                  <div
                    onMouseEnter={() => setActiveMenu("certs")}
                    onMouseLeave={() => setActiveMenu(null)}
                    className="absolute left-0 top-full mt-1 w-72 rounded-lg border border-border bg-background p-3 shadow-lg"
                  >
                    {certifications.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${locale}/certifications/${c.slug}`}
                        className="block rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Language switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen((s) => !s)}
                className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-foreground-muted hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                {localeNames[locale as Locale]}
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border bg-background p-1 shadow-lg">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        "block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-hover",
                        loc === locale
                          ? "font-medium text-foreground"
                          : "text-foreground-muted"
                      )}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-md text-[#25D366] transition-colors hover:bg-surface-hover"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            )}

            {/* RFQ button (desktop) */}
            <Link
              href={`/${locale}/request-a-quote`}
              className="hidden items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 lg:flex"
            >
              {t("common.requestWholesaleQuote")}
            </Link>

            {/* RFQ list count */}
            {rfqCount > 0 && (
              <Link
                href={`/${locale}/rfq-list`}
                className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover lg:flex"
              >
                {t("rfq.rfqList")}
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
                  {rfqCount}
                </span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground-muted lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div className="border-t border-border bg-background/95">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
            >
              <Search className="h-4 w-4 shrink-0 text-foreground-subtle" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-foreground px-4 py-1.5 text-xs font-medium text-background"
              >
                {t("search.label")}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <span className="font-serif text-lg font-semibold">
                {t("footer.tagline")}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-foreground-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {[
                ...nav,
                ...(functions.length
                  ? [{ labelKey: "nav.shopByFunctions", href: "#" }]
                  : []),
                ...(certifications.length
                  ? [{ labelKey: "nav.shopByCertifications", href: "#" }]
                  : []),
                { labelKey: "nav.requestQuote", href: `/${locale}/request-a-quote` },
              ].map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 text-base text-foreground hover:bg-surface-hover"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="px-3 pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-foreground-subtle">
                  {t("nav.shopByFunctions")}
                </p>
                {functions.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/${locale}/functions/${f.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover"
                  >
                    {f.name}
                  </Link>
                ))}
                <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-foreground-subtle">
                  {t("nav.shopByCertifications")}
                </p>
                {certifications.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${locale}/certifications/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href={`/${locale}/request-a-quote`}
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                {t("common.requestWholesaleQuote")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
