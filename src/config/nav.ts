export interface NavLink {
  labelKey: string;
  href: string;
}

export function getMainNav(locale: string) {
  return [
    { labelKey: "nav.home", href: `/${locale}` },
    { labelKey: "nav.brands", href: `/${locale}/brands` },
    { labelKey: "nav.products", href: `/${locale}/products` },
    { labelKey: "nav.about", href: `/${locale}/about` },
    { labelKey: "nav.exportWholesale", href: `/${locale}/export-wholesale` },
  ];
}

export function getFooterNav(locale: string) {
  return [
    { labelKey: "nav.about", href: `/${locale}/about` },
    { labelKey: "nav.exportWholesale", href: `/${locale}/export-wholesale` },
    { labelKey: "nav.contact", href: `/${locale}/contact` },
  ];
}

export function getLegalNav(locale: string) {
  return [
    { labelKey: "legal.privacy", href: `/${locale}/privacy` },
    { labelKey: "legal.terms", href: `/${locale}/terms` },
    { labelKey: "legal.cookies", href: `/${locale}/cookies` },
  ];
}
