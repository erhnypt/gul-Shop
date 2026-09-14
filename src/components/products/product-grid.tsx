import { ProductCard, type ProductCardData } from "@/components/products/product-card";

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: ProductCardData[];
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-6 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={columns === 4 && i < 2} />
      ))}
    </div>
  );
}

export function toProductCardData(p: any): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    productType: p.productType,
    shortDescription: p.shortDescription,
    packaging: p.packaging,
    moq: p.moq,
    brand: p.brand,
    image: p.images?.[0]?.url ?? null,
    certifications: p.certifications ?? [],
  };
}
