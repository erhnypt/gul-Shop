import { LegalLayout } from "@/components/legal/legal-layout";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalLayout
      locale={locale}
      title="Privacy Policy"
      sections={[
        {
          heading: "นโยบายความเป็นส่วนตัว · PDPA Compliant",
          body: [
            "In compliance with the Thailand Personal Data Protection Act B.E. 2562 (PDPA), we are committed to protecting your personal information.",
          ],
        },
        {
          heading: "Data We Collect",
          body: [
            "Identity Data: Name, surname.",
            "Contact Data: Shipping address, billing address, email address, phone number.",
            "Transaction Data: Details about payments and orders placed by you.",
            "Technical Data: IP address, browser type, cookies, and usage data.",
          ],
        },
        {
          heading: "Purpose of Collection & Processing",
          body: [
            "We collect and process your personal data on the legal bases of Contractual Necessity (to fulfill and ship your orders) and Legitimate Interest (to improve our website services, customer support, and security).",
          ],
        },
        {
          heading: "Data Retention & Security",
          body: [
            "Your personal data is stored securely and retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable laws (such as Thai tax and accounting regulations).",
          ],
        },
        {
          heading: "Data Sharing",
          body: [
            "We do not sell your personal data. We only share relevant data with trusted third-party service providers essential for fulfilling your order, such as international logistics companies, payment gateways, and IT support services.",
          ],
        },
        {
          heading: "Data Subject Rights",
          body: [
            "Under the Thai PDPA, you have the right to request access to, correction of, deletion of, or restriction on the processing of your personal data. To exercise these rights, please contact us at [Fill Email].",
          ],
        },
      ]}
    />
  );
}