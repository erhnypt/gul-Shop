import { LegalLayout } from "@/components/legal/legal-layout";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalLayout
      locale={locale}
      title="Terms & Conditions"
      sections={[
        {
          heading: "Company Information & Governing Law",
          body: [
            "This website is operated by [Fill Later], registered in Thailand. All transactions, terms, and disputes arising from the use of this website are governed by and construed in accordance with the laws of the Kingdom of Thailand.",
          ],
        },
        {
          heading: "Product Descriptions & Pricing",
          body: [
            "We strive to ensure all product details, descriptions, and prices are accurate. Prices are listed in [ระบุสกุลเงิน เช่น USD/THB]. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice.",
          ],
        },
        {
          heading: "Orders & Payment",
          body: [
            "Placing an order constitutes an offer to purchase. Orders are subject to acceptance and availability. Payments are processed securely through certified payment gateways complying with Thai Electronic Transactions standards.",
          ],
        },
        {
          heading: "International Shipping, Customs & Import Duties",
          body: [
            "Products are shipped from Thailand. The customer (importer) is solely responsible for any customs duties, import taxes, or clearance fees required by the destination country's regulations.",
          ],
        },
        {
          heading: "Prohibited Uses",
          body: [
            "Users are prohibited from using the site for unlawful purposes under the Thai Computer Crime Act B.E. 2550 (and its amendments), including uploading malicious software, engaging in fraudulent activities, or violating intellectual property rights.",
          ],
        },
      ]}
    />
  );
}