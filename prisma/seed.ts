import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Functions ───────────────────────────────────────
  const functions = [
    { slug: "sun-protection", name: "Sun Protection", icon: "☀️", desc: "SPF and UV protection products" },
    { slug: "acne-care", name: "Acne Care", icon: "🌿", desc: "Products targeting acne-prone skin" },
    { slug: "deep-hydration", name: "Deep Hydration", icon: "💧", desc: "Intense moisture and hydration" },
    { slug: "oil-control", name: "Oil Control", icon: "🍃", desc: "Manage excess oil and shine" },
    { slug: "brightening", name: "Brightening", icon: "✨", desc: "Radiant and even skin tone" },
    { slug: "anti-aging", name: "Anti-Aging", icon: "🌹", desc: "Reduce signs of aging" },
    { slug: "sensitive-skin", name: "Sensitive Skin", icon: "🛡️", desc: "Gentle formulas for sensitive skin" },
    { slug: "body-care", name: "Body Care", icon: "🧴", desc: "Body lotions, scrubs and care" },
    { slug: "hair-care", name: "Hair Care", icon: "💇", desc: "Shampoos, conditioners and hair care" },
    { slug: "cleansing", name: "Cleansing", icon: "🧼", desc: "Cleansers and face washes" },
    { slug: "lip-care", name: "Lip Care", icon: "💋", desc: "Lip balms and treatments" },
    { slug: "makeup", name: "Makeup", icon: "💄", desc: "Color cosmetics" },
  ];

  for (const f of functions) {
    await prisma.function.upsert({
      where: { slug: f.slug },
      update: {},
      create: { slug: f.slug, name: f.name, icon: f.icon, description: f.desc },
    });
  }
  console.log("✅ Functions seeded");

  // ─── Certifications ──────────────────────────────────
  const certs = [
    { slug: "halal", name: "Halal", desc: "Certified halal, suitable for halal-conscious consumers." },
    { slug: "gmp", name: "GMP", desc: "Good Manufacturing Practice certified facility." },
    { slug: "haccp", name: "HACCP", desc: "Hazard analysis for food-safety-grade production." },
    { slug: "cruelty-free", name: "Cruelty-Free", desc: "Not tested on animals." },
    { slug: "vegan", name: "Vegan", desc: "Contains no animal-derived ingredients." },
    { slug: "thai-fda", name: "Thai FDA", desc: "Registered with the Thai Food and Drug Administration." },
    { slug: "iso", name: "ISO", desc: "International Organization for Standardization certified." },
    { slug: "cfs", name: "Certificate of Free Sale", desc: "Export certification confirming free sale in the country of origin." },
  ];

  for (const c of certs) {
    await prisma.certification.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, description: c.desc },
    });
  }
  console.log("✅ Certifications seeded");

  // ─── Brands ──────────────────────────────────────────
  const brands = [
    {
      slug: "siam-botanics",
      name: "Siam Botanics",
      country: "Thailand",
      desc: "Sample brand — Thai botanical skincare combining traditional herbal ingredients with modern formulation.",
    },
    {
      slug: "orchard-glow",
      name: "Orchard Glow",
      country: "Thailand",
      desc: "Sample brand — brightening and antioxidant formulas inspired by Thai fruits.",
    },
    {
      slug: "lotus-derm",
      name: "Lotus Derm",
      country: "Thailand",
      desc: "Sample brand — gentle, derm-friendly care for sensitive and acne-prone skin.",
    },
    {
      slug: "bangkok-beauty-lab",
      name: "Bangkok Beauty Lab",
      country: "Thailand",
      desc: "Sample brand — innovative body and hair care for international markets.",
    },
    {
      slug: "pure-sachet-co",
      name: "Pure Sachet Co.",
      country: "Thailand",
      desc: "Sample brand — sachet-packaging specialists for lightweight, scalable supply.",
    },
  ];

  for (const b of brands) {
    const existing = await prisma.brand.findUnique({ where: { slug: b.slug } });
    if (!existing) {
      await prisma.brand.create({
        data: { slug: b.slug, name: b.name, description: b.desc, country: b.country },
      });
    }
  }
  console.log("✅ Brands seeded");

  // ─── Products ────────────────────────────────────────
  const brandMap = new Map<string, string>();
  for (const b of brands) {
    const row = await prisma.brand.findUnique({ where: { slug: b.slug } });
    if (row) brandMap.set(b.slug, row.id);
  }
  const fnMap = new Map<string, string>();
  for (const f of functions) {
    const row = await prisma.function.findUnique({ where: { slug: f.slug } });
    if (row) fnMap.set(f.slug, row.id);
  }
  const certMap = new Map<string, string>();
  for (const c of certs) {
    const row = await prisma.certification.findUnique({ where: { slug: c.slug } });
    if (row) certMap.set(c.slug, row.id);
  }

  const products = [
    {
      slug: "siam-botanics-serum-sun-protection",
      brand: "siam-botanics", name: "Botanical SPF 50+ Sun Serum", type: "Serum",
      packaging: "Tube", size: "30ml", moq: 1000, sachet: false, functions: ["sun-protection", "anti-aging"],
      certs: ["gmp", "cruelty-free"], ben: "Broad-spectrum protection with botanical actives.",
    },
    {
      slug: "siam-botanics-herbal-acne-cleanser",
      brand: "siam-botanics", name: "Herbal Acne Control Cleanser", type: "Cleanser",
      packaging: "Bottle", size: "100ml", moq: 500, sachet: false, functions: ["acne-care", "cleansing"],
      certs: ["gmp", "thai-fda"], ben: "Deep cleanses and helps calm breakouts.",
    },
    {
      slug: "siam-botanics-hydration-moisturizer",
      brand: "siam-botanics", name: "Deep Hydration Moisturizer", type: "Moisturizer",
      packaging: "Jar", size: "50ml", moq: 1000, sachet: false, functions: ["deep-hydration"],
      certs: ["vegan", "cruelty-free"], ben: "24-hour intense moisture for dry skin.",
    },
    {
      slug: "orchard-glow-brightening-serum",
      brand: "orchard-glow", name: "Vitamin C Brightening Serum", type: "Serum",
      packaging: "Dropper Bottle", size: "30ml", moq: 500, sachet: false, functions: ["brightening"],
      certs: ["vegan", "iso"], ben: "Reveals a radiant, even-toned complexion.",
    },
    {
      slug: "orchard-glow-oil-control-toner",
      brand: "orchard-glow", name: "Oil Control Purifying Toner", type: "Toner",
      packaging: "Bottle", size: "150ml", moq: 1000, sachet: false, functions: ["oil-control", "acne-care"],
      certs: ["cruelty-free"], ben: "Refines pores and controls excess shine.",
    },
    {
      slug: "lotus-derm-sensitive-soothing-cream",
      brand: "lotus-derm", name: "Calming Cream for Sensitive Skin", type: "Cream",
      packaging: "Tube", size: "40ml", moq: 1000, sachet: false, functions: ["sensitive-skin", "deep-hydration"],
      certs: ["gmp", "halal"], ben: "Soothes redness and calms irritated skin.",
    },
    {
      slug: "lotus-derm-acne-spot-treatment",
      brand: "lotus-derm", name: "Acne Spot Treatment Gel", type: "Gel",
      packaging: "Tube", size: "15ml", moq: 500, sachet: false, functions: ["acne-care"],
      certs: ["thai-fda", "gmp"], ben: "Targeted relief for blemishes.",
    },
    {
      slug: "bangkok-beauty-lab-body-butter",
      brand: "bangkok-beauty-lab", name: "Coconut Body Butter", type: "Body Moisturizer",
      packaging: "Jar", size: "200ml", moq: 1000, sachet: false, functions: ["body-care"],
      certs: ["vegan", "iso"], ben: "Rich, non-greasy all-over body nourishment.",
    },
    {
      slug: "bangkok-beauty-lab-repair-shampoo",
      brand: "bangkok-beauty-lab", name: "Hair Repair Shampoo", type: "Shampoo",
      packaging: "Bottle", size: "300ml", moq: 1000, sachet: false, functions: ["hair-care"],
      certs: ["iso", "cruelty-free"], ben: "Strengthens and repairs damaged hair.",
    },
    {
      slug: "pure-sachet-co-wipe-cleanser",
      brand: "pure-sachet-co", name: "Cleansing Wipe Sachet Pack", type: "Cleanser Sachet",
      packaging: "Sachet", size: "5ml x 20", moq: 5000, sachet: true, functions: ["cleansing"],
      certs: ["gmp", "halal"], ben: "Lightweight, travel-ready cleansing sachets.",
    },
    {
      slug: "pure-sachet-co-sun-pouch",
      brand: "pure-sachet-co", name: "Sun Protection Sachet", type: "Sunscreen Sachet",
      packaging: "Sachet", size: "3ml", moq: 10000, sachet: true, functions: ["sun-protection"],
      certs: ["gmp"], ben: "Portable SPF sachets ideal for retail and promotions.",
    },
    {
      slug: "pure-sachet-co-hydration-pouch",
      brand: "pure-sachet-co", name: "Hydration Serum Sachet", type: "Serum Sachet",
      packaging: "Sachet", size: "2ml", moq: 5000, sachet: true, functions: ["deep-hydration"],
      certs: ["vegan"], ben: "Single-use hydration for easy trial distribution.",
    },
    {
      slug: "orchard-glow-antiaging-serum",
      brand: "orchard-glow", name: "Retinol Renewal Night Serum", type: "Serum",
      packaging: "Dropper Bottle", size: "30ml", moq: 1000, sachet: false, functions: ["anti-aging", "brightening"],
      certs: ["vegan", "iso"], ben: "Supports smooth, youthful-looking skin overnight.",
      bestseller: true,
    },
    {
      slug: "lotus-derm-hydrating-sunscreen",
      brand: "lotus-derm", name: "Gentle SPF 50 Hydrating Sunscreen", type: "Sunscreen",
      packaging: "Tube", size: "50ml", moq: 1500, sachet: false, functions: ["sun-protection", "sensitive-skin", "deep-hydration"],
      certs: ["gmp", "halal", "thai-fda"], ben: "High protection with a comfortable, hydrating finish.",
      featured: true,
    },
    {
      slug: "bangkok-beauty-lab-coconut-shower-gel",
      brand: "bangkok-beauty-lab", name: "Coconut Shower Gel", type: "Body Wash",
      packaging: "Bottle", size: "250ml", moq: 1000, sachet: false, functions: ["body-care", "cleansing"],
      certs: ["vegan", "cruelty-free"], ben: "Softening body wash with a fresh coconut scent.",
    },
    {
      slug: "pure-sachet-co-body-lotion-pouch",
      brand: "pure-sachet-co", name: "Body Lotion Sachet", type: "Body Moisturizer Sachet",
      packaging: "Sachet", size: "10ml", moq: 5000, sachet: true, functions: ["body-care", "deep-hydration"],
      certs: ["gmp"], ben: "Portable body lotion sachets for travel and sampling.",
    },
    {
      slug: "siam-botanics-herbal-face-mask",
      brand: "siam-botanics", name: "Herbal Clay Purifying Mask", type: "Mask",
      packaging: "Jar", size: "100g", moq: 1000, sachet: false, functions: ["acne-care", "cleansing", "oil-control"],
      certs: ["gmp", "thai-fda"], ben: "Draws out impurities with traditional Thai herbal clays.",
      bestseller: true,
    },
    {
      slug: "orchard-glow-lip-balm",
      brand: "orchard-glow", name: "Mango Butter Lip Balm", type: "Lip Balm",
      packaging: "Stick", size: "4g", moq: 5000, sachet: false, functions: ["lip-care"],
      certs: ["vegan", "cruelty-free"], ben: "Nourishing lip care with mango butter.",
    },
    {
      slug: "lotus-derm-calm-toner",
      brand: "lotus-derm", name: "Centella Soothing Toner", type: "Toner",
      packaging: "Bottle", size: "150ml", moq: 1000, sachet: false, functions: ["sensitive-skin", "deep-hydration"],
      certs: ["gmp", "halal"], ben: "Alcohol-free toner that calms and refreshes.",
      featured: true,
    },
    {
      slug: "siam-botanics-herbal-hair-oil",
      brand: "siam-botanics", name: "Herbal Hair & Scalp Oil", type: "Hair Oil",
      packaging: "Bottle", size: "60ml", moq: 1000, sachet: false, functions: ["hair-care"],
      certs: ["gmp", "vegan"], ben: "Traditional Thai herbal oil that nourishes scalp and hair.",
    },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    const brandId = brandMap.get(p.brand)!;
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        brandId,
        productType: p.type,
        packaging: p.packaging,
        size: p.size,
        moq: p.moq,
        shortDescription: p.ben,
        benefits: p.ben,
        ingredients: "Water, botanical extracts, humectants, plant oils. Full INCI list available on request.",
        countryOfOrigin: "Thailand",
        isSachet: p.sachet,
        isExportReady: true,
        isFeatured: i < 8 || (p as any).featured === true,
        isBestseller: (p as any).bestseller === true,
        status: "PUBLISHED",
        availability: "AVAILABLE",
        shelfLife: "24 months",
        leadTime: "15-30 days",
        sampleAvailable: true,
        cartonQuantity: 50,
        unitsPerCarton: 50,
        functions: {
          create: p.functions.map((f) => ({ functionId: fnMap.get(f)! })),
        },
        certifications: {
          create: p.certs.map((c) => ({ certificationId: certMap.get(c)! })),
        },
      },
    });
  }
  console.log("✅ Products seeded");

  // ─── Sample RFQs + Leads ─────────────────────────────
  const publishedProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
  });
  const sampleRfqs = [
    {
      fullName: "Ana Rodrigues", companyName: "Bella Import Ltda", country: "Brazil",
      email: "ana@sample-import.example", phone: "+55 11 90000 0000",
      preferredContact: "email", message: "Sample inquiry — interested in sachet lines for retail distribution.",
    },
    {
      fullName: "Chen Wei", companyName: "Lantern Trading Co.", country: "Singapore",
      email: "chen@sample-trading.example", phone: "+65 9000 0000",
      preferredContact: "whatsapp", message: "Sample inquiry — wholesale pricing for sun protection range.",
    },
    {
      fullName: "Marie Laurent", companyName: "Éclat Import SARL", country: "France",
      email: "marie@sample-ecclat.example", phone: "+33 6 00 00 00 00",
      preferredContact: "both", message: "Sample inquiry — export documentation for EU market.",
    },
  ];

  let rfqSeq = 1;
  for (let i = 0; i < sampleRfqs.length; i++) {
    const s = sampleRfqs[i];
    const existing = await prisma.rFQ.findFirst({ where: { email: s.email } });
    if (existing) continue;
    const product = publishedProducts[i % publishedProducts.length];
    const rfqNumber = `RFQ-2026-${String(rfqSeq).padStart(6, "0")}`;
    rfqSeq++;
    const rfq = await prisma.rFQ.create({
      data: {
        rfqNumber,
        fullName: s.fullName,
        companyName: s.companyName,
        country: s.country,
        email: s.email,
        phone: s.phone,
        preferredContact: s.preferredContact,
        message: s.message,
        status: ["NEW", "CONTACTED", "QUOTATION_SENT"][i] as "NEW" | "CONTACTED" | "QUOTATION_SENT",
        createdAt: new Date(Date.now() - (i + 1) * 86400000),
      },
    });
    if (product) {
      await prisma.rFQItem.create({
        data: { rfqId: rfq.id, productId: product.id, quantity: [1000, 2000, 500][i] },
      });
    }
    await prisma.lead.create({
      data: {
        source: "rfq",
        companyName: s.companyName,
        contactName: s.fullName,
        email: s.email,
        phone: s.phone,
        country: s.country,
        status: ["new", "qualified", "proposal"][i],
      },
    });
  }
  console.log("✅ Sample RFQs + Leads seeded");

  // ─── Site settings ───────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "GulShop",
      siteDescription: "Premium Thai Beauty Wholesale & Export",
      salesEmail: process.env.SALES_EMAIL ?? "sales@gulshop.com",
      generalEmail: process.env.SALES_EMAIL ?? "sales@gulshop.com",
      whatsappNumber: process.env.WHATSAPP_NUMBER ?? "+66123456789",
      address: "Bangkok, Thailand",
      businessHours: "Mon–Fri, 9:00–18:00 (GMT+7)",
    },
  });
  console.log("✅ Settings seeded");

  // ─── Hero slides ─────────────────────────────────────
  const slides = [
    { heading: "Premium Thai Beauty for Global Markets", desc: "Factory-direct wholesale rates, ready for worldwide export." },
    { heading: "Sachet Skincare — Lightweight, Scalable & Export Ready", desc: "Specialized packaging designed for efficient international shipping." },
    { heading: "Authentic Thai Brands. Global Wholesale Supply.", desc: "Direct partnerships with reputable Thai beauty brands." },
  ];
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const existing = await prisma.heroSlide.findFirst({ where: { heading: s.heading } });
    if (!existing) {
      await prisma.heroSlide.create({
        data: { heading: s.heading, description: s.desc, sortOrder: i, isActive: true },
      });
    }
  }
  console.log("✅ Hero slides seeded");

  // ─── FAQ ─────────────────────────────────────────────
  const faqs = [
    { q: "What is your MOQ?", a: "MOQ varies by product and packaging. Many products start from low MOQs, and trial orders are supported. You will receive exact MOQ figures with your quotation." },
    { q: "Do you ship internationally?", a: "Yes. We support international shipping via air freight, sea freight (FCL and LCL), and courier for samples." },
    { q: "Can I order samples?", a: "Sample orders are available for most products. Request samples through our wholesale quote form." },
    { q: "Do you provide export documentation?", a: "Where applicable to each product, we provide documentation such as Certificate of Free Sale, Thai FDA documentation, GMP, and more." },
    { q: "Can you supply sachet products?", a: "Yes. Sachet packaging is one of our specializations, ideal for lightweight and scalable supply." },
    { q: "Can you provide private label / OEM?", a: "Private label and OEM/ODM options are available for many products. Enquire for specifics." },
    { q: "How do I request wholesale pricing?", a: "Use the Request Wholesale Quote button on any product or the RFQ list to send your requirements to our sales team." },
  ];
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    const existing = await prisma.fAQ.findFirst({ where: { question: f.q } });
    if (!existing) {
      await prisma.fAQ.create({ data: { question: f.q, answer: f.a, sortOrder: i } });
    }
  }
  console.log("✅ FAQ seeded");

  // ─── Market landing pages (§54) ──────────────────────
  const marketPages: {
    slug: string;
    title: string;
    content: string;
    thTitle: string;
    thContent: string;
  }[] = [
    {
      slug: "market-saudi-arabia",
      title: "Saudi Arabia & GCC Market Guide",
      content: [
        "GCC buyers can source Thai beauty and personal care products through GulShop's wholesale program.",
        "",
        "What we help with:",
        "- Wholesale pricing and trial orders for Saudi and GCC importers",
        "- Certifications and documentation commonly required for GCC customs (Certificate of Free Sale, origin, GMP, Halal where applicable)",
        "- Labelling and packaging guidance for regional compliance",
        "- Air freight and sea freight (LCL/FCL) options to Jeddah, Dammam and Duba ports",
        "",
        "Export guidelines change frequently and vary per product category. Submit a wholesale inquiry with your target market and our team will confirm which documentation applies to your specific products.",
      ].join("\n"),
      thTitle: "คู่มือตลาดซาอุดีอาระเบียและ GCC",
      thContent: [
        "ผู้นำเข้าจากประเทศในกลุ่ม GCC สามารถจัดซื้อสินค้าความงามและผลิตภัณฑ์ดูแลส่วนตัวจากไทยผ่านโปรแกรมค้าส่งของ GulShop ได้",
        "",
        "สิ่งที่เราช่วยเหลือ:",
        "- ราคาค้าส่งและคำสั่งซื้อทดลองสำหรับผู้นำเข้าในซาอุดีอาระเบียและ GCC",
        "- เอกสารรับรองที่มีความจำเป็นต่อศุลกากร GCC (Certificate of Free Sale, เอกสารแสดงแหล่งกำเนิดสินค้า, GMP, ฮาลาลตามความเหมาะสม)",
        "- คำแนะนำด้านฉลากและบรรจุภัณฑ์เพื่อให้สอดคล้องกับกฎระเบียบของภูมิภาค",
        "- ตัวเลือกการขนส่งทางอากาศและทางเรือ (LCL/FCL) ไปยังท่าเรือสำคัญ",
        "",
        "ข้อกำหนดการส่งออกมีการเปลี่ยนแปลงบ่อยครั้งและแตกต่างกันตามประเภทผลิตภัณฑ์ ส่งคำขอค้าส่งพร้อมระบุตลาดเป้าหมาย เพื่อให้ทีมงานยืนยันเอกสารที่จำเป็นสำหรับผลิตภัณฑ์ของคุณ",
      ].join("\n"),
    },
    {
      slug: "market-uae",
      title: "UAE & Gulf Market Guide",
      content: [
        "Dubai is a major re-export hub for beauty products. GulShop supplies wholesale Thai beauty brands to UAE importers, distributors and online retailers.",
        "",
        "What we help with:",
        "- Wholesale and private label (OEM/ODM) programs for UAE distributors",
        "- GCC-standard documentation: Certificate of Free Sale, GMP, and product registration support",
        "- Compliance info for UAE/SFDA registration and local labelling rules",
        "- Sample orders via courier and full container freight to Jebel Ali Port",
        "",
        "Every product category has different registration requirements in the UAE. Tell us which products and target channel you plan to sell through, and we will map the documentation for you.",
      ].join("\n"),
      thTitle: "คู่มือตลาดสหรัฐอาหรับเอมิเรตส์",
      thContent: [
        "ดูไบเป็นศูนย์กลางการส่งออกซ้ำ (re-export) ที่สำคัญสำหรับสินค้าความงาม GulShop จัดหาสินค้าแบรนด์ความงามไทยแบบค้าส่งให้กับผู้นำเข้า ผู้จัดจำหน่าย และผู้ค้าปลีกออนไลน์ในยูเออี",
        "",
        "สิ่งที่เราช่วยเหลือ:",
        "- โปรแกรมค้าส่งและแบรนด์ส่วนตัว (OEM/ODM) สำหรับผู้จัดจำหน่ายในยูเออี",
        "- เอกสารมาตรฐาน GCC: Certificate of Free Sale, GMP และการสนับสนุนการขึ้นทะเบียนผลิตภัณฑ์",
        "- ข้อมูลการขึ้นทะเบียนกับหน่วยงานที่เกี่ยวข้องของยูเออีและกฎระเบียบฉลากท้องถิ่น",
        "- คำสั่งซื้อตัวอย่างผ่านคูเรียร์ และการขนส่งตู้สินค้าไปยังท่าเรือเจเบลอาลี",
        "",
        "ผลิตภัณฑ์แต่ละประเภทมีข้อกำหนดการขึ้นทะเบียนในยูเออีที่แตกต่างกัน แจ้งผลิตภัณฑ์และช่องทางจำหน่ายเป้าหมายของคุณ เพื่อให้ทีมงานจัดทำเอกสารให้ครบถ้วน",
      ].join("\n"),
    },
    {
      slug: "market-europe",
      title: "Europe Market Guide",
      content: [
        "European importers and brands purchase Thai beauty products for EU distribution, private label programs and retail ranges.",
        "",
        "What we help with:",
        "- Wholesale supply with EU-relevant documentation where applicable (GMP, product certifications)",
        "- Responsible Person (RP) and notification requirements for EU cosmetics",
        "- Ingredient and labelling data to support EU Cosmetics Regulation (EC) No 1223/2009 compliance",
        "- Air freight and ocean freight options to major EU ports",
        "",
        "Thai products must comply with EU cosmetic rules for legal sale in Europe. Contact us with your product list and planned markets, and our team will confirm which documents and data are available for each product.",
      ].join("\n"),
      thTitle: "คู่มือตลาดยุโรป",
      thContent: [
        "ผู้นำเข้าและแบรนด์ในยุโรปจัดซื้อผลิตภัณฑ์ความงามไทยเพื่อจำหน่ายในตลาด EU ผ่านโปรแกรมแบรนด์ส่วนตัวและร้านค้าปลีก",
        "",
        "สิ่งที่เราช่วยเหลือ:",
        "- การจัดหาค้าส่งพร้อมเอกสารที่เกี่ยวข้องกับ EU ตามความเหมาะสม (GMP, ใบรับรองผลิตภัณฑ์)",
        "- คำแนะนำเกี่ยวกับ Responsible Person (RP) และการแจ้งผลิตภัณฑ์เครื่องสำอางใน EU",
        "- ข้อมูลส่วนผสมและฉลากเพื่อสนับสนุนการปฏิบัติตามกฎระเบียบเครื่องสำอาง EU (EC) No 1223/2009",
        "- การขนส่งทางอากาศและทางเรือไปยังท่าเรือหลักในยุโรป",
        "",
        "สินค้าไทยต้องปฏิบัติตามกฎระเบียบเครื่องสำอาง EU จึงจะวางจำหน่ายได้ตามกฎหมาย ติดต่อเราพร้อมรายการสินค้าและตลาดเป้าหมาย เพื่อให้ทีมงานยืนยันเอกสารและข้อมูลที่มีสำหรับแต่ละผลิตภัณฑ์",
      ].join("\n"),
    },
    {
      slug: "market-africa",
      title: "Africa Market Guide",
      content: [
        "Distributors across Africa — including Nigeria, Kenya, South Africa and Ghana — source Thai beauty sachets and personal care for growing retail and wholesale channels.",
        "",
        "What we help with:",
        "- Sachet and single-use formats ideal for high-volume, cost-efficient distribution",
        "- Wholesale pricing and flexible MOQs for emerging-market distributors",
        "- Export documentation and shipping guidance for key African ports",
        "- Packaging advice for tropical climates and distribution chains",
        "",
        "Requirements and payment terms vary widely by country. Send a wholesale inquiry with your country and distribution model so we can share what applies to your market.",
      ].join("\n"),
      thTitle: "คู่มือตลาดแอฟริกา",
      thContent: [
        "ผู้จัดจำหน่ายในแอฟริกา—รวมถึงไนจีเรีย เคนยา แอฟริกาใต้ และกานา—จัดซื้อผลิตภัณฑ์ความงามไทยแบบซองและผลิตภัณฑ์ดูแลส่วนตัวสำหรับช่องทางค้าส่งและค้าปลีกที่เติบโต",
        "",
        "สิ่งที่เราช่วยเหลือ:",
        "- รูปแบบซองและขนาดใช้ครั้งเดียว เหมาะกับการกระจายสินค้าปริมาณมากและคุ้มต้นทุน",
        "- ราคาค้าส่งและ MOQ ที่ยืดหยุ่นสำหรับผู้จัดจำหน่ายในตลาดเกิดใหม่",
        "- เอกสารส่งออกและคำแนะนำการขนส่งสำหรับท่าเรือหลักในแอฟริกา",
        "- คำแนะนำบรรจุภัณฑ์สำหรับสภาพอากาศเขตร้อนและห่วงโซ่การจัดจำหน่าย",
        "",
        "ข้อกำหนดและเงื่อนไขการชำระเงินแตกต่างกันตามประเทศ ส่งคำขอค้าส่งพร้อมระบุประเทศและรูปแบบการจัดจำหน่าย เพื่อให้เราแนะนำสิ่งที่เกี่ยวข้องกับตลาดของคุณ",
      ].join("\n"),
    },
  ];
  for (const mp of marketPages) {
    const existing = await prisma.page.findUnique({ where: { slug: mp.slug } });
    if (!existing) {
      await prisma.page.create({
        data: {
          slug: mp.slug,
          title: mp.title,
          content: mp.content,
          translations: {
            create: { locale: "th", title: mp.thTitle, content: mp.thContent },
          },
        },
      });
    }
  }
  console.log("✅ Market pages seeded");

  // ─── Product documents (§57) ─────────────────────────
  const docProducts = [
    {
      slug: "siam-botanics-serum-sun-protection",
      docs: [
        { name: "Product Specification Sheet", url: "https://example-spec.s3.amazonaws.com/serum-sun-spec.pdf", type: "specification", access: "public" },
        { name: "GMP Certificate (Sample)", url: "https://example-spec.s3.amazonaws.com/serum-sun-gmp.pdf", type: "certificate", access: "public" },
        { name: "Full Technical Dossier", url: "https://example-spec.s3.amazonaws.com/serum-sun-dossier.pdf", type: "ingredient_sheet", access: "after_rfq" },
      ],
    },
    {
      slug: "orchard-glow-brightening-serum",
      docs: [
        { name: "Product Specification Sheet", url: "https://example-spec.s3.amazonaws.com/brightening-spec.pdf", type: "specification", access: "public" },
        { name: "Full Technical Dossier", url: "https://example-spec.s3.amazonaws.com/brightening-dossier.pdf", type: "ingredient_sheet", access: "after_rfq" },
      ],
    },
  ];
  for (const dp of docProducts) {
    const prod = publishedProducts.find((p) => p.slug === dp.slug);
    if (!prod) continue;
    const existingDocs = await prisma.productDocument.count({ where: { productId: prod.id } });
    if (existingDocs === 0) {
      await prisma.productDocument.createMany({
        data: dp.docs.map((d) => ({ ...d, productId: prod.id })),
      });
    }
  }
  console.log("✅ Product documents seeded");

  // ─── Testimonials (sample, clearly fictional) ────────
  const sampleTestimonials = [
    { name: "Sample Buyer Name", role: "Procurement Manager", companyName: "Example Import Co. (Sample)", country: "Singapore", quote: "Sample testimonial — clean documentation and responsive wholesale support during our trial order.", rating: 5 },
    { name: "Sample Buyer Two", role: "Founder", companyName: "Example Beauty Retail (Sample)", country: "UAE", quote: "Sample testimonial — the sachet formats were ideal for our distribution channels.", rating: 5 },
  ];
  if ((await prisma.testimonial.count()) === 0) {
    for (let i = 0; i < sampleTestimonials.length; i++) {
      const t = sampleTestimonials[i];
      await prisma.testimonial.create({ data: { ...t, isVerified: true, sortOrder: i, isActive: true } });
    }
    console.log("✅ Sample testimonials seeded (fictional, admin can edit/remove)");
  }

  // ─── Admin user ──────────────────────────────────────
  const adminEmail = "admin@gulshop.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: { email: adminEmail, name: "Admin", passwordHash: hash, role: "SUPER_ADMIN" },
    });
  }
  console.log("✅ Admin seeded");

  // ─── Analytics events ────────────────────────────────
  const viewSeeds = [
    { slug: "thai-herbal-sun-protection-mask", count: 14, dayOffset: 6 },
    { slug: "tamarind-whitening-body-lotion", count: 11, dayOffset: 4 },
    { slug: "siam-botanics-herbal-hair-oil", count: 9, dayOffset: 3 },
    { slug: "coconut-oil-intense-conditioner", count: 7, dayOffset: 2 },
    { slug: "green-tea-fresh-face-foam", count: 6, dayOffset: 1 },
  ];
  if ((await prisma.analyticsEvent.count()) === 0) {
    for (const v of viewSeeds) {
      if (!publishedProducts.some((p) => p.slug === v.slug)) continue;
      for (let n = 0; n < v.count; n++) {
        await prisma.analyticsEvent.create({
          data: {
            eventType: "PRODUCT_VIEW",
            productSlug: v.slug,
            locale: ["en", "th"][n % 2],
            createdAt: new Date(Date.now() - (v.dayOffset + n) * 86400000),
          },
        });
      }
    }
    const searchSeeds = [
      { query: "sunscreen", count: 8 },
      { query: "jelly mask", count: 5 },
      { query: "sachet", count: 4 },
    ];
    for (const s of searchSeeds) {
      for (let n = 0; n < s.count; n++) {
        await prisma.analyticsEvent.create({
          data: {
            eventType: "SEARCH",
            query: s.query,
            locale: ["en", "th"][n % 2],
            createdAt: new Date(Date.now() - n * 86400000),
          },
        });
      }
    }
    console.log("✅ Analytics events seeded");
  }
}

main()
  .then(() => console.log("🎉 Seed complete"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
