import prisma from "@/lib/prisma";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Leads / CRM</h1>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="px-4 py-3 font-medium">{l.companyName}</td>
                  <td className="px-4 py-3">{l.contactName}</td>
                  <td className="px-4 py-3 text-foreground-muted">{l.email}</td>
                  <td className="px-4 py-3 text-foreground-muted">{l.country ?? "-"}</td>
                  <td className="px-4 py-3 text-foreground-muted">{l.source}</td>
                  <td className="px-4 py-3 text-foreground-muted">{l.status}</td>
                  <td className="px-4 py-3 text-foreground-muted">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground-subtle">No leads yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
