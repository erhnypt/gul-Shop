import { getFooterNav, getLegalNav } from "@/config/nav";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

interface FooterProps {
  locale: string;
  settings: {
    siteName: string | null;
    salesEmail: string | null;
    whatsappNumber: string | null;
    address: string | null;
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
  } | null;
}

export async function Footer({ locale, settings }: FooterProps) {
  const t = await getDictionary(locale);
  const companyNav = getFooterNav(locale);
  const legalNav = getLegalNav(locale);

  return (
    <footer className="border-t border-border bg-surface/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 font-serif text-2xl font-semibold"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-white">
                G
              </span>
              {settings?.siteName ?? "GulShop"}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted">
              {t["footer.description"]}
            </p>
            <div className="mt-6 space-y-2 text-sm text-foreground-muted">
              {settings?.salesEmail && (
                <a
                  href={`mailto:${settings.salesEmail}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {settings.salesEmail}
                </a>
              )}
              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  {settings.whatsappNumber}
                </a>
              )}
              {settings?.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.address}
                </p>
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t["footer.company"]}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {t[link.labelKey as keyof typeof t]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/sachet-skincare`} className="hover:text-foreground">
                  {t["nav.sachetSkincare"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/request-a-quote`} className="hover:text-foreground">
                  {t["nav.requestQuote"]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t["footer.products"]}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
              <li>
                <Link href={`/${locale}/products?function=sun-protection`} className="hover:text-foreground">
                  Sun Protection
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?function=acne-care`} className="hover:text-foreground">
                  Acne Care
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?packaging=sachet`} className="hover:text-foreground">
                  Sachet Products
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-foreground">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Markets
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
              <li>
                <Link href={`/${locale}/markets/saudi-arabia`} className="hover:text-foreground">
                  Saudi & GCC
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/markets/uae`} className="hover:text-foreground">
                  UAE & Gulf
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/markets/europe`} className="hover:text-foreground">
                  Europe
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/markets/africa`} className="hover:text-foreground">
                  Africa
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t["footer.resources"]}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
              <li>
                <Link href={`/${locale}/certifications/halal`} className="hover:text-foreground">
                  Halal
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/certifications/gmp`} className="hover:text-foreground">
                  GMP
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/export-wholesale`} className="hover:text-foreground">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/request-a-quote`} className="hover:text-foreground">
                  {t["nav.requestQuote"]}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground-subtle">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground-muted">
                  {t[link.labelKey as keyof typeof t]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground-subtle">
            © {new Date().getFullYear()} {settings?.siteName ?? "GulShop"}. {t["footer.rights"]}
          </p>
        </div>
      </div>
    </footer>
  );
}
