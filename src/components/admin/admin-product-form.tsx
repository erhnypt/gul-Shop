"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea, Checkbox } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface AdminOption {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductDocument {
  id?: string;
  name: string;
  url: string;
  type: string;
  access: "public" | "after_rfq" | "admin_only";
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  skinType: string | null;
  productType: string | null;
  packaging: string | null;
  size: string | null;
  countryOfOrigin: string | null;
  moq: number | null;
  moqNote: string | null;
  cartonQuantity: number | null;
  unitsPerCarton: number | null;
  shelfLife: string | null;
  leadTime: string | null;
  sampleAvailable: boolean;
  oemOdmAvailable: boolean;
  isFeatured: boolean;
  isSachet: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isExportReady: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  availability: "AVAILABLE" | "LIMITED" | "ON_REQUEST" | "UNAVAILABLE";
  functionIds: string[];
  certificationIds: string[];
  documents: AdminProductDocument[];
}

export function AdminProductForm({
  product,
  brands,
  functions,
  certifications,
}: {
  product?: AdminProduct | null;
  brands: AdminOption[];
  functions: AdminOption[];
  certifications: AdminOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<AdminProduct>(
    product ?? {
      id: "",
      name: "",
      slug: "",
      brandId: "",
      sku: "",
      shortDescription: "",
      description: "",
      benefits: "",
      ingredients: "",
      skinType: "",
      productType: "",
      packaging: "",
      size: "",
      countryOfOrigin: "",
      moq: null,
      moqNote: "",
      cartonQuantity: null,
      unitsPerCarton: null,
      shelfLife: "",
      leadTime: "",
      sampleAvailable: false,
      oemOdmAvailable: false,
      isFeatured: false,
      isSachet: false,
      isNew: false,
      isBestseller: false,
      isExportReady: true,
      seoTitle: "",
      seoDescription: "",
      status: "DRAFT",
      availability: "AVAILABLE",
      functionIds: [],
      certificationIds: [],
      documents: [],
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: "functionIds" | "certificationIds", id: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const del = async () => {
    if (!product || !confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  const set = (patch: Partial<AdminProduct>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <form onSubmit={submit} className="space-y-8">
      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

      {/* Basics */}
      <section className="space-y-4 rounded-lg border border-border bg-background p-5">
        <h2 className="text-lg font-medium text-foreground">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" required>
            <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </FormField>
          <FormField label="Slug" required>
            <Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} />
          </FormField>
          <FormField label="Brand" required>
            <Select value={form.brandId} onChange={(e) => set({ brandId: e.target.value })}>
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="SKU / Internal Reference">
            <Input value={form.sku ?? ""} onChange={(e) => set({ sku: e.target.value })} />
          </FormField>
          <FormField label="Product Type">
            <Input value={form.productType ?? ""} onChange={(e) => set({ productType: e.target.value })} />
          </FormField>
          <FormField label="Skin Type">
            <Input value={form.skinType ?? ""} onChange={(e) => set({ skinType: e.target.value })} />
          </FormField>
          <FormField label="Country of Origin">
            <Input value={form.countryOfOrigin ?? ""} onChange={(e) => set({ countryOfOrigin: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => set({ status: e.target.value as any })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </FormField>
          <FormField label="Availability">
            <Select value={form.availability} onChange={(e) => set({ availability: e.target.value as any })}>
              <option value="AVAILABLE">Available</option>
              <option value="LIMITED">Limited</option>
              <option value="ON_REQUEST">On Request</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Short Description">
          <Textarea value={form.shortDescription ?? ""} onChange={(e) => set({ shortDescription: e.target.value })} />
        </FormField>
        <FormField label="Full Description">
          <Textarea value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        </FormField>
        <FormField label="Key Benefits">
          <Textarea value={form.benefits ?? ""} onChange={(e) => set({ benefits: e.target.value })} />
        </FormField>
        <FormField label="Key Ingredients">
          <Textarea value={form.ingredients ?? ""} onChange={(e) => set({ ingredients: e.target.value })} />
        </FormField>
      </section>

      {/* Wholesale */}
      <section className="space-y-4 rounded-lg border border-border bg-background p-5">
        <h2 className="text-lg font-medium text-foreground">Wholesale Information</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="MOQ (units)">
            <Input type="number" value={form.moq ?? ""} onChange={(e) => set({ moq: e.target.value ? Number(e.target.value) : null })} />
          </FormField>
          <FormField label="MOQ Display Note">
            <Input value={form.moqNote ?? ""} onChange={(e) => set({ moqNote: e.target.value })} placeholder="e.g. 500 units" />
          </FormField>
          <FormField label="Carton Quantity">
            <Input type="number" value={form.cartonQuantity ?? ""} onChange={(e) => set({ cartonQuantity: e.target.value ? Number(e.target.value) : null })} />
          </FormField>
          <FormField label="Units per Carton">
            <Input type="number" value={form.unitsPerCarton ?? ""} onChange={(e) => set({ unitsPerCarton: e.target.value ? Number(e.target.value) : null })} />
          </FormField>
          <FormField label="Packaging">
            <Input value={form.packaging ?? ""} onChange={(e) => set({ packaging: e.target.value })} />
          </FormField>
          <FormField label="Size">
            <Input value={form.size ?? ""} onChange={(e) => set({ size: e.target.value })} />
          </FormField>
          <FormField label="Shelf Life">
            <Input value={form.shelfLife ?? ""} onChange={(e) => set({ shelfLife: e.target.value })} />
          </FormField>
          <FormField label="Lead Time">
            <Input value={form.leadTime ?? ""} onChange={(e) => set({ leadTime: e.target.value })} />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.sampleAvailable} onChange={(e) => set({ sampleAvailable: e.target.checked })} />
            Sample Available
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.oemOdmAvailable} onChange={(e) => set({ oemOdmAvailable: e.target.checked })} />
            OEM/ODM Available
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isFeatured} onChange={(e) => set({ isFeatured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isNew} onChange={(e) => set({ isNew: e.target.checked })} />
            New
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isBestseller} onChange={(e) => set({ isBestseller: e.target.checked })} />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isSachet} onChange={(e) => set({ isSachet: e.target.checked })} />
            Sachet
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isExportReady} onChange={(e) => set({ isExportReady: e.target.checked })} />
            Export Ready
          </label>
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4 rounded-lg border border-border bg-background p-5">
        <h2 className="text-lg font-medium text-foreground">SEO</h2>
        <FormField label="SEO Title">
          <Input value={form.seoTitle ?? ""} onChange={(e) => set({ seoTitle: e.target.value })} />
        </FormField>
        <FormField label="SEO Description">
          <Textarea value={form.seoDescription ?? ""} onChange={(e) => set({ seoDescription: e.target.value })} rows={3} />
        </FormField>
      </section>

      {/* Functions */}
      <section className="rounded-lg border border-border bg-background p-5">
        <h2 className="mb-3 text-lg font-medium text-foreground">Functions</h2>
        <div className="flex flex-wrap gap-2">
          {functions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle("functionIds", f.id)}
              className={
                form.functionIds.includes(f.id)
                  ? "rounded-full bg-foreground px-3 py-1 text-xs text-background"
                  : "rounded-full border border-border px-3 py-1 text-xs text-foreground-muted hover:bg-surface"
              }
            >
              {f.name}
            </button>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="rounded-lg border border-border bg-background p-5">
        <h2 className="mb-3 text-lg font-medium text-foreground">Certifications (explicitly assigned)</h2>
        <div className="flex flex-wrap gap-2">
          {certifications.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle("certificationIds", c.id)}
              className={
                form.certificationIds.includes(c.id)
                  ? "rounded-full bg-accent px-3 py-1 text-xs text-white"
                  : "rounded-full border border-border px-3 py-1 text-xs text-foreground-muted hover:bg-surface"
              }
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="space-y-4 rounded-lg border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Downloadable Documents</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set({ documents: [...form.documents, { id: "", name: "", url: "", type: "specification", access: "public" }] })
            }
          >
            Add document
          </Button>
        </div>
        {form.documents.length === 0 && (
          <p className="text-sm text-foreground-subtle">
            Add spec sheets, certificates, or catalogs. Public files are downloadable by all buyers; "After RFQ" files unlock once a buyer submits a request.
          </p>
        )}
        <div className="space-y-3">
          {form.documents.map((doc, i) => (
            <div key={i} className="grid gap-3 rounded-md border border-border/60 p-3 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <FormField label="Name">
                  <Input
                    value={doc.name}
                    onChange={(e) => {
                      const docs = [...form.documents];
                      docs[i] = { ...docs[i], name: e.target.value };
                      set({ documents: docs });
                    }}
                  />
                </FormField>
              </div>
              <div className="sm:col-span-5">
                <FormField label="File URL">
                  <Input
                    value={doc.url}
                    placeholder="https://..."
                    onChange={(e) => {
                      const docs = [...form.documents];
                      docs[i] = { ...docs[i], url: e.target.value };
                      set({ documents: docs });
                    }}
                  />
                </FormField>
              </div>
              <div className="sm:col-span-1">
                <FormField label="Type">
                  <Select
                    value={doc.type}
                    onChange={(e) => {
                      const docs = [...form.documents];
                      docs[i] = { ...docs[i], type: e.target.value };
                      set({ documents: docs });
                    }}
                  >
                    <option value="specification">Spec</option>
                    <option value="certificate">Cert</option>
                    <option value="ingredient_sheet">Ingredients</option>
                    <option value="catalog">Catalog</option>
                  </Select>
                </FormField>
              </div>
              <div className="sm:col-span-1">
                <FormField label="Access">
                  <Select
                    value={doc.access}
                    onChange={(e) => {
                      const docs = [...form.documents];
                      docs[i] = { ...docs[i], access: e.target.value as any };
                      set({ documents: docs });
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="after_rfq">After RFQ</option>
                    <option value="admin_only">Admin</option>
                  </Select>
                </FormField>
              </div>
              <div className="flex items-end justify-end sm:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set({ documents: form.documents.filter((_, x) => x !== i) })}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </Button>
        {product && (
          <Button type="button" variant="outline" onClick={del}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
