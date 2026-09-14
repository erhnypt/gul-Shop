import { SettingsForm } from "@/components/admin/settings-form";
import prisma from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const keys = [
    "siteName",
    "siteDescription",
    "logoUrl",
    "salesEmail",
    "generalEmail",
    "supportEmail",
    "whatsappNumber",
    "phone",
    "address",
    "businessHours",
    "facebook",
    "instagram",
    "linkedin",
  ];

  const initial: Record<string, string | null> = {};
  for (const k of keys) initial[k] = settings ? String((settings as any)[k] ?? "") : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Site Settings</h1>
      <SettingsForm initial={initial} />
    </div>
  );
}
