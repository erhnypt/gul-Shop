import { LegalLayout } from "@/components/legal/legal-layout";

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalLayout
      locale={locale}
      title="Cookie Policy"
      sections={[
        {
          heading: "What Are Cookies",
          body: [
            "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and function correctly.",
          ],
        },
        {
          heading: "How We Use Cookies",
          body: [
            "We use essential cookies to keep the website working, such as maintaining your RFQ list and language preference.",
            "We may use limited analytics cookies to understand how visitors use the site, without collecting unnecessary personal data.",
          ],
        },
        {
          heading: "Managing Cookies",
          body: [
            "You can control or delete cookies through your browser settings. Disabling essential cookies may affect the functionality of the website.",
          ],
        },
      ]}
    />
  );
}
