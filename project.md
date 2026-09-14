# PROJECT: B2B T-BEAUTY WHOLESALE SHOWROOM

You are a senior full-stack architect, UI/UX designer, frontend engineer, backend engineer, database architect, SEO specialist and security engineer.

Your task is to design and develop a production-ready B2B online catalog and showroom for authentic Thai Beauty products.

The website is NOT a B2C e-commerce store.

There must be NO:

* Add to Cart
* Buy Now
* Checkout
* Payment Gateway
* Customer shopping cart
* Retail purchasing flow
* Retail prices displayed publicly

The primary commercial action throughout the website is:

**REQUEST WHOLESALE QUOTE**

The website should function as a premium international B2B product showroom and wholesale lead-generation platform.

The visual quality should be comparable to premium beauty platforms such as Sephora, Konvy and modern international cosmetic distributor websites, while maintaining a distinctive Thai Beauty identity.

---

# 1. BUSINESS OBJECTIVE

The platform represents a wholesale distributor/exporter specializing in authentic Thai beauty products, especially:

* Thai skincare
* Sachet skincare
* Facial care
* Sun protection
* Acne care
* Hydration
* Oil control
* Brightening products
* Body care
* Hair care
* Beauty products

The target customers are:

* International distributors
* Importers
* Wholesalers
* Retail chains
* Pharmacies
* Beauty stores
* Supermarket chains
* Online retailers
* Regional distributors
* Procurement companies
* Hospitality businesses
* Middle Eastern buyers
* European buyers
* African buyers
* Asian buyers
* International trading companies

The website should immediately communicate:

1. Authenticity
2. Thai origin
3. Professional wholesale capability
4. Export readiness
5. Regulatory compliance
6. Low MOQ availability
7. Factory/direct sourcing capability
8. Sachet expertise
9. International logistics capability
10. Professional B2B communication

---

# 2. TECHNOLOGY STACK

Use the following architecture unless there is a strong technical reason to improve it.

Frontend:

* Next.js
* TypeScript
* React
* Tailwind CSS
* Modern component architecture
* Responsive design
* Server-side rendering where appropriate

Backend:

* Next.js server/API routes OR separate backend where justified
* PostgreSQL
* Prisma ORM

Authentication:

* Secure admin authentication
* Session-based authentication
* Password hashing
* Protected admin routes
* Role-based access control

Email:

Use a transactional email provider such as:

* Resend
* SMTP
* SendGrid

The system must support configurable business email addresses.

Images:

Use optimized image storage such as:

* Cloudinary
* Amazon S3
* compatible object storage

Do not hardcode image URLs throughout the application.

SEO:

* Next.js metadata API
* Open Graph
* Twitter/X cards
* XML sitemap
* robots.txt
* canonical URLs
* JSON-LD structured data

Deployment should be compatible with:

* Vercel
* Railway
* Render
* VPS
* Docker

---

# 3. DESIGN DIRECTION

Create a premium, elegant international beauty aesthetic.

Design characteristics:

* Minimal
* Clean
* Premium
* Modern
* Spacious
* Professional
* Trustworthy
* International
* Editorial beauty aesthetic

Avoid:

* Cheap-looking marketplace design
* Excessive gradients
* Excessive animations
* Overcrowded UI
* Generic SaaS appearance
* Excessive rounded cards
* Excessive shadows
* Bright childish colors

Use:

* White / off-white backgrounds
* Black / charcoal typography
* Subtle Thai-inspired accent colors
* Premium typography
* Large product photography
* Generous whitespace
* Fine borders
* Elegant hover states
* Subtle animations

The site should feel like:

"International Beauty Trade Showroom"

rather than:

"Online Store".

---

# 4. GLOBAL NAVIGATION

Desktop header:

LEFT:

* Company logo

CENTER:

* Large search bar

RIGHT:

* Language switcher: EN / TH
* WhatsApp
* Email

Navigation:

* Home
* Brands
* Shop by Functions
* Shop by Certifications
* Products
* About Us
* Export & Wholesale
* Request a Quote

Use dropdown / mega-menu navigation.

---

# 5. HEADER BEHAVIOR

Desktop:

Sticky header.

When scrolling:

* Header becomes slightly smaller
* Add subtle backdrop blur
* Maintain navigation accessibility

Mobile:

* Logo
* Search icon
* WhatsApp icon
* Hamburger menu

Mobile menu should contain:

* Home
* Brands
* Products
* Functions
* Certifications
* Export & Wholesale
* About
* Request a Quote

The Request a Quote CTA must remain highly visible on mobile.

---

# 6. HOMEPAGE

Build the homepage with the following sections.

## SECTION 1 — HERO

Full-width premium hero section.

Use large high-quality Thai beauty imagery.

Primary headline:

"Your Ultimate Source for Premium Thai Beauty & Sachet Skincare."

Secondary headline:

"Factory-Direct Wholesale Rates, Ready for Worldwide Export."

Primary CTA:

"Request Wholesale Quote"

Secondary CTA:

"Explore Products"

Hero should support:

* Desktop
* Tablet
* Mobile
* Image/video background if enabled
* Multiple slides

Hero slider should not be excessive.

Use approximately 3 slides.

Possible slides:

1.

"Premium Thai Beauty for Global Markets"

2.

"Sachet Skincare — Lightweight, Scalable & Export Ready"

3.

"Authentic Thai Brands. Global Wholesale Supply."

Each slide must contain:

* Heading
* Short description
* CTA

---

# 7. TRUST / VALUE PROPOSITION

Create a four-column trust section.

Cards:

### 100% Authentic Brands

Direct partnerships with reputable Thai beauty brands.

### Global Export Compliance

Products selected for international market requirements, including relevant certifications and documentation.

### Low MOQ & Flexible Freight

Support trial orders, LCL and scalable wholesale shipments.

### Sachet Packaging Experts

Lightweight packaging designed for efficient international shipping and high retail potential.

Each card:

* Minimal icon
* Heading
* Short description

---

# 8. SHOP BY FUNCTION

Create a visual category section.

Categories:

* Sun Protection
* Acne Care
* Deep Hydration
* Oil Control
* Brightening
* Anti-Aging
* Sensitive Skin
* Body Care
* Hair Care
* Cleansing
* Lip Care
* Makeup
* Sachet Products

Each category should contain:

* Icon/image
* Category title
* Product count
* Link

Example:

Sun Protection
"24 Products"

Clicking opens filtered product catalog.

---

# 9. SHOP BY CERTIFICATION

Create premium certification badges.

Required filters:

* Halal Certified
* GMP
* HACCP
* Cruelty-Free
* Vegan
* Thai FDA
* Certificate of Free Sale
* ISO

Important:

Do NOT claim that a product has a certification unless the product record explicitly contains that certification.

Certifications must be database-driven.

Each certification has:

* Name
* Description
* Logo/badge
* Products associated with certification

Clicking a certification should open:

`/products?certification=halal`

---

# 10. PRODUCT CATALOG

Create a complete B2B product catalog.

Route:

`/products`

Features:

* Search
* Brand filter
* Category filter
* Function filter
* Certification filter
* Packaging filter
* Product type filter
* MOQ filter
* Country/market suitability filter
* Sort options

Sort:

* Featured
* Newest
* Most Popular
* Brand
* Product Name

Do NOT show retail price.

Instead show:

"Wholesale pricing available on request."

Product card must include:

* Product image
* Brand
* Product name
* Product type
* Short benefit
* Packaging type
* Certifications
* MOQ
* "Request Wholesale Quote"

---

# 11. ADVANCED PRODUCT FILTERING

Filters should be combinable.

Example:

Halal + Sachet + Sun Protection

or:

GMP + Acne Care + Sachet

or:

Thai FDA + Vegan + Skincare

URL state must reflect filters.

Example:

`/products?function=acne-care&certification=halal&packaging=sachet`

This is important for:

* SEO
* Sharing
* Procurement users
* International buyers

---

# 12. PRODUCT DETAIL PAGE

Every product should have a dedicated SEO-friendly page.

Example:

`/products/brand-name-product-name`

Page structure:

## Product Gallery

* Main image
* Thumbnail images
* Packaging image
* Ingredient image
* Certification image where applicable

## Product Information

* Brand
* Product name
* Product type
* Key benefits
* Product description
* Key ingredients
* Skin type
* Packaging
* Available sizes
* MOQ
* Shelf life
* Country of origin
* Certifications
* Export documentation
* Target markets

Never expose private supplier information.

---

# 13. B2B PRODUCT INFORMATION

Add a dedicated section:

"Wholesale Information"

Display:

* MOQ
* Carton quantity
* Units per carton
* Available packaging
* Lead time
* Sample availability
* Private label availability
* OEM/ODM availability
* Shipping options
* Export documentation

Do not display wholesale price publicly.

Instead:

"Contact us for current wholesale pricing."

CTA:

"Request Wholesale Quote"

---

# 14. RFQ SYSTEM

This is the core business functionality.

Every product must have:

**REQUEST WHOLESALE QUOTE**

button.

Clicking opens an RFQ modal or dedicated inquiry form.

Fields:

Required:

* Full Name
* Company Name
* Country
* Email
* WhatsApp / Phone
* Product
* Requested Quantity

Optional:

* Target price
* Preferred packaging
* Delivery destination
* Additional requirements
* Message

Add:

"Preferred Contact Method"

Options:

* Email
* WhatsApp
* Both

Form must include:

* GDPR/privacy consent checkbox
* Anti-spam protection
* CAPTCHA or Turnstile
* Validation

After submission:

1. Save RFQ in database.
2. Generate unique RFQ number.
3. Send email to business sales email.
4. Send confirmation email to buyer.
5. Display success screen.
6. Track inquiry timestamp.
7. Associate RFQ with product.

Example RFQ number:

`RFQ-2026-000123`

---

# 15. RFQ EMAIL

Business email should receive a professionally formatted email.

Subject:

`New Wholesale RFQ – RFQ-2026-000123`

Email should contain:

* RFQ number
* Date/time
* Customer name
* Company
* Country
* Email
* Phone/WhatsApp
* Product
* Quantity
* Destination
* Message
* Product URL

Include a button:

"View RFQ in Admin"

---

# 16. BUYER CONFIRMATION EMAIL

After submitting:

"Thank you for your wholesale inquiry."

Include:

* RFQ number
* Product requested
* Quantity
* Company
* Expected response time

Do not promise a specific response time unless configured by admin.

---

# 17. GENERAL REQUEST A QUOTE PAGE

Create:

`/request-a-quote`

This page is for buyers who want to inquire about multiple products or general sourcing.

Fields:

* Full Name
* Company
* Country
* Email
* WhatsApp
* Product interests
* Estimated order quantity
* Product categories
* Destination port/country
* Certifications required
* Message

Optional:

"Upload Product List"

Allow:

* CSV
* XLSX
* PDF

Apply:

* File size limits
* MIME validation
* Malware/security considerations

---

# 18. MULTI-PRODUCT RFQ

This is highly recommended.

Instead of a traditional shopping cart, create:

**RFQ LIST**

The user can add multiple products to an inquiry list.

Button:

"Add to RFQ"

NOT:

"Add to Cart"

Example:

RFQ List:

* Product A — 5,000 units
* Product B — 10,000 units
* Product C — 2,000 units

Then:

"Request Quote for Selected Products"

This is one of the most important B2B features.

The RFQ list must NOT behave like an e-commerce shopping cart.

No checkout.

No payment.

No retail pricing.

---

# 19. RFQ LIST UI

Desktop:

Floating RFQ button:

"RFQ List (3)"

Mobile:

Sticky bottom CTA:

"RFQ List · 3 Products"

RFQ list page:

* Product image
* Product name
* Brand
* Quantity field
* Remove
* Additional note
* Submit RFQ

The quantity should be editable per product.

---

# 20. BRAND DIRECTORY

Create:

`/brands`

Display all partner brands.

Brand cards:

* Logo
* Brand name
* Country
* Product count
* Short description

Create brand detail pages:

`/brands/brand-name`

Brand page:

* Brand logo
* Brand story
* Product categories
* Featured products
* Certifications
* Market positioning
* Export availability

---

# 21. BRAND PARTNERS SHOWCASE

Homepage should contain a horizontal scrolling brand logo ticker.

Use grayscale logos.

On hover:

* Logo becomes normal
* Slight scale animation

Clicking logo:

`/brands/{slug}`

Do not use logos without appropriate authorization.

---

# 22. EXPORT & WHOLESALE PAGE

Create:

`/export-wholesale`

This page is extremely important for international B2B buyers.

Sections:

### Why Source Thai Beauty?

Explain Thai beauty market positioning.

### Wholesale Supply

Explain:

* Wholesale sourcing
* Bulk orders
* Brand distribution
* Sachet products
* Low MOQ
* Trial orders

### Export Documentation

Explain available documentation such as:

* Certificate of Free Sale
* Product information
* Ingredient documentation
* Thai FDA documentation where applicable
* GMP
* HACCP
* Halal
* Commercial invoice
* Packing list
* Certificate of Origin

Do not claim universal availability.

Documentation must depend on individual products.

### Shipping

Explain:

* Air freight
* Sea freight
* LCL
* FCL
* Courier samples

### Global Markets

Show example markets:

* Middle East
* Europe
* Africa
* Asia
* Americas

Do not make unsupported legal/regulatory claims.

---

# 23. SACHET SPECIALIZATION PAGE

Create:

`/sachet-skincare`

This should be a dedicated landing page.

Explain advantages:

* Lightweight
* Low shipping volume
* Low unit packaging cost
* Easy trial distribution
* Suitable for impulse retail
* Suitable for pharmacies
* Suitable for supermarkets
* Suitable for travel retail
* Suitable for promotional campaigns

Add:

* Featured sachet products
* Sachet brands
* Packaging options
* MOQ information
* RFQ CTA

---

# 24. ABOUT US

Create:

`/about`

Sections:

* Company overview
* Thai Beauty expertise
* Sourcing network
* Quality control
* Export capability
* International buyers
* Mission

Include real company information only.

Do not generate fake:

* Certifications
* Offices
* Partnerships
* Years of experience
* Factory relationships
* Customer numbers

All company claims must be editable through admin.

---

# 25. CONTACT PAGE

Create:

`/contact`

Display:

* Company name
* Business email
* WhatsApp
* Phone
* Office address
* Business hours
* Country
* Social media if available

CTA:

"Request Wholesale Quote"

WhatsApp button should use configurable WhatsApp number.

Do not hardcode numbers.

---

# 26. LANGUAGE SYSTEM

Support:

* English
* Thai

Architecture must support future languages.

Potential future languages:

* Arabic
* French
* German
* Spanish

Do not duplicate components for each language.

Use translation dictionaries / i18n.

URLs should support language:

`/en/...`

`/th/...`

or another SEO-friendly architecture.

Language switcher should preserve current page.

Example:

English product page → Thai version of same product page.

---

# 27. ADMIN DASHBOARD

Create a secure admin panel.

Dashboard:

* Total products
* Active brands
* RFQs today
* RFQs this month
* Pending RFQs
* Recent inquiries
* Top requested products
* Top requested brands
* Countries generating RFQs

---

# 28. PRODUCT MANAGEMENT

Admin can:

* Create product
* Edit product
* Delete product
* Publish/unpublish
* Feature product
* Upload images
* Assign brand
* Assign categories
* Assign functions
* Assign certifications
* Set MOQ
* Set packaging
* Set shelf life
* Set product specifications
* Set SEO metadata

Product fields:

* Name
* Slug
* Brand
* SKU/internal reference
* Description
* Short description
* Benefits
* Ingredients
* Skin type
* Product category
* Functions
* Certifications
* Packaging
* Size
* MOQ
* Carton quantity
* Shelf life
* Country of origin
* Export markets
* Lead time
* Sample availability
* OEM/ODM availability
* Featured status
* Published status
* Images
* SEO title
* SEO description

---

# 29. BRAND MANAGEMENT

Admin can:

* Add brand
* Edit brand
* Delete brand
* Upload logo
* Add description
* Add website
* Add country
* Add certifications
* Assign products
* Publish/unpublish

---

# 30. CERTIFICATION MANAGEMENT

Admin can create:

* Halal
* GMP
* HACCP
* Vegan
* Cruelty-Free
* Thai FDA
* ISO
* CFS
* Other certifications

Each certification should have:

* Name
* Description
* Logo
* Verification/document reference if appropriate
* Associated products

---

# 31. RFQ MANAGEMENT

Admin should have:

`/admin/rfqs`

Columns:

* RFQ number
* Date
* Buyer
* Company
* Country
* Product(s)
* Quantity
* Status

Statuses:

* New
* Contacted
* Quotation Sent
* Negotiation
* Won
* Lost
* Archived

Admin can:

* Open RFQ
* Change status
* Add internal notes
* Contact buyer
* Export RFQ
* Search
* Filter
* Sort

Internal notes must NEVER be visible to customers.

---

# 32. LEAD MANAGEMENT

Create a lightweight CRM layer.

Each RFQ should become a lead.

Fields:

* Lead source
* Country
* Company
* Contact
* RFQ history
* Products requested
* Status
* Internal notes
* Last contact date
* Assigned sales representative

Future-ready for:

* Sales pipeline
* Multiple sales users
* Follow-up reminders

---

# 33. ANALYTICS

Track:

* Product page views
* RFQ clicks
* RFQ submissions
* Brand page views
* Search queries
* Most viewed products
* Most requested products
* Country distribution
* Conversion from product view → RFQ

Do not track unnecessary personal data.

Add cookie/privacy compliance where required.

---

# 34. SEARCH ENGINE

Implement global search.

Search:

* Product name
* Brand
* Function
* Ingredient
* Certification
* Category

Search suggestions:

When user types:

"sun"

show:

* Sun Protection
* Sunscreen products
* Relevant brands

Search results should be fast.

Implement debouncing.

---

# 35. SEO

Every public page must have:

* Unique title
* Meta description
* Canonical URL
* Open Graph metadata
* Structured data

Product pages should use:

Product structured data where appropriate.

Brand pages should use:

Organization/Brand structured data where appropriate.

Add:

* sitemap.xml
* robots.txt
* breadcrumbs
* internal linking
* semantic HTML

Avoid fake SEO content.

---

# 36. SEO-FRIENDLY URLS

Use clean URLs.

Examples:

`/products`

`/products/sachet`

`/products/brand-product`

`/brands`

`/brands/brand-name`

`/functions/acne-care`

`/certifications/halal`

`/request-a-quote`

`/export-wholesale`

Avoid:

`/product?id=123`

---

# 37. MOBILE EXPERIENCE

Mobile is extremely important.

Optimize for:

* iPhone
* Android
* Tablets
* Desktop

On mobile:

* Sticky RFQ CTA
* Easy WhatsApp access
* Large product images
* Swipe product gallery
* Accordion product information
* Mobile filters
* Bottom navigation where appropriate

Do not simply shrink desktop UI.

Create proper mobile UX.

---

# 38. WHATSAPP INTEGRATION

Add configurable WhatsApp CTA.

Buttons:

"Chat on WhatsApp"

and:

"Request Quote via WhatsApp"

When product-specific:

Generate a prefilled message such as:

"Hello, I am interested in the wholesale supply of [PRODUCT NAME]. Please provide MOQ and wholesale pricing."

Do not expose private customer data.

---

# 39. EMAIL CONFIGURATION

Create admin configuration for:

* Sales email
* General email
* Support email
* WhatsApp number
* Company phone
* Company address

Do not hardcode these values in components.

Store configuration centrally.

---

# 40. CMS-LIKE CONTENT MANAGEMENT

Admin should be able to edit:

* Homepage hero slides
* Homepage sections
* About page
* Export page
* Sachet page
* Contact information
* Footer
* SEO metadata
* Announcement banners

Avoid requiring code changes for normal content updates.

---

# 41. LEGAL PAGES

Create:

* Privacy Policy
* Terms & Conditions
* Cookie Policy
* Disclaimer

Use placeholders for legal/company information.

Do not fabricate legal language claiming compliance with specific jurisdictions.

---

# 42. SECURITY

Implement:

* Secure authentication
* Password hashing
* CSRF protection where applicable
* Rate limiting
* Input validation
* Server-side validation
* SQL injection prevention through ORM
* XSS prevention
* File upload validation
* MIME validation
* File size limits
* CAPTCHA/Turnstile
* Secure headers
* Environment variables
* No secrets in frontend
* Admin route protection

Never expose:

* Database credentials
* SMTP credentials
* API keys
* Private supplier information

---

# 43. DATABASE MODEL

Design a normalized relational database.

Minimum entities:

User

Role

Product

Brand

Category

Function

Certification

ProductCertification

ProductFunction

ProductImage

RFQ

RFQItem

RFQNote

Lead

SiteSettings

HeroSlide

Page

Translation

SEO metadata

AuditLog

Suggested relationships:

Brand → Products

Product → Certifications

Product → Functions

RFQ → RFQItems

RFQItem → Product

Lead → RFQs

---

# 44. PRODUCT STATUS

Products should support:

* Draft
* Published
* Archived

Only published products appear publicly.

---

# 45. PRODUCT VISIBILITY

Add:

* Featured
* New
* Bestseller
* Sachet
* Export Ready

These should be database attributes.

---

# 46. MOQ DISPLAY

Never invent MOQ.

If MOQ is known:

"MOQ: 1,000 units"

If not:

"MOQ: Contact us"

Do not display fabricated numbers.

---

# 47. CERTIFICATION CLAIMS

This is critical.

Never automatically label a product:

"Halal"

"Vegan"

"FDA Registered"

"GMP"

etc.

unless the product database explicitly contains that certification.

The admin must control certification assignments.

---

# 48. INVENTORY

This is NOT a retail inventory system.

Do not build complex B2C inventory unless needed.

Instead support:

* Available
* Limited availability
* On request
* Temporarily unavailable

Optional:

Internal stock quantity visible only to admin.

---

# 49. NO RETAIL PRICING

The frontend must never display:

* Retail price
* Discount price
* Sale price
* Cart subtotal
* Checkout total

Instead use:

"Wholesale pricing available on request."

---

# 50. NO PAYMENT

Do NOT implement:

* Stripe
* PayPal
* Credit card checkout
* Bank checkout
* Apple Pay
* Google Pay
* B2C payment processing

The website's commercial conversion is RFQ submission.

---

# 51. HOMEPAGE PRODUCT SECTION

Create:

"Featured Thai Beauty"

and:

"Trending Sachet Products"

Each grid:

4 columns desktop

2 columns tablet

2 / 1 columns mobile depending on screen width.

Product cards must have:

* Image
* Brand
* Product
* Benefit
* Certification badges
* RFQ button

---

# 52. SOCIAL PROOF

Add optional section:

"Trusted by International Buyers"

However:

Do not create fake customer logos, fake reviews or fake testimonials.

Admin must be able to add verified testimonials later.

---

# 53. FAQ

Create B2B FAQ.

Questions:

* What is your MOQ?
* Do you ship internationally?
* Can I order samples?
* Do you provide export documentation?
* Do you support LCL shipping?
* Can you supply sachet products?
* Can you provide private label/OEM?
* Which countries do you export to?
* How do I request wholesale pricing?
* How long does quotation processing take?

Answers must be editable through admin.

---

# 54. COUNTRY / MARKET LANDING PAGES

Prepare architecture for future pages such as:

`/markets/saudi-arabia`

`/markets/uae`

`/markets/europe`

`/markets/africa`

These pages should be CMS-driven.

Do not make unsupported regulatory claims.

---

# 55. INTERNATIONAL PROCUREMENT UX

The site should be designed for procurement officers.

Therefore prioritize:

* MOQ
* Packaging
* Certifications
* Documentation
* Lead time
* Export capability
* Product specifications
* Wholesale inquiry
* Company information

Do not prioritize retail features.

---

# 56. PRODUCT COMPARISON

Add optional B2B comparison functionality.

Users can select up to 3 products.

Compare:

* Product type
* Packaging
* MOQ
* Certifications
* Key benefits
* Size
* Shelf life
* Availability

CTA:

"Request Quote for Selected Products"

---

# 57. DOWNLOADABLE PRODUCT INFORMATION

Each product may optionally have:

* Product specification PDF
* Ingredient sheet
* Certificate PDF
* Product catalog PDF

Access should be controlled.

Admin decides whether each document is:

* Public
* Available after RFQ
* Admin only

Never expose confidential supplier documentation publicly.

---

# 58. CONTACT FORM ANTI-SPAM

All forms should have:

* Server-side validation
* Honeypot
* Rate limiting
* CAPTCHA/Turnstile
* Email validation
* Required fields
* Sanitization

---

# 59. PERFORMANCE

Target:

* Lighthouse Performance 90+
* Lighthouse SEO 90+
* Lighthouse Accessibility 90+
* Lighthouse Best Practices 90+

Optimize:

* Images
* Lazy loading
* Fonts
* JS bundles
* Server rendering
* Caching
* Database queries

Do not load unnecessary libraries.

---

# 60. ACCESSIBILITY

Follow WCAG principles.

Implement:

* Keyboard navigation
* Focus states
* Semantic HTML
* Alt text
* Accessible forms
* Proper labels
* ARIA only where needed
* Sufficient contrast

---

# 61. ANIMATIONS

Use subtle premium animations.

Examples:

* Fade-in
* Image zoom
* Card hover
* Logo ticker
* Hero transition
* Modal transition

Avoid:

* Excessive parallax
* Heavy motion
* Slow loading animations
* Distracting effects

Respect:

`prefers-reduced-motion`

---

# 62. ERROR STATES

Create professional:

* 404 page
* 500 page
* Empty search state
* Empty RFQ state
* Form validation errors
* API errors
* Upload errors
* Email failure handling

---

# 63. LOADING STATES

Use:

* Skeleton loaders
* Button loading states
* Form submission state
* Image placeholders

Never leave the UI visually frozen.

---

# 64. ADMIN AUDIT LOG

Track important administrative actions:

* Product created
* Product edited
* Product deleted
* RFQ status changed
* User login
* Settings changed

Include:

* User
* Action
* Timestamp

---

# 65. ENVIRONMENT VARIABLES

Create `.env.example`.

Include placeholders for:

DATABASE_URL

AUTH_SECRET

EMAIL_API_KEY

EMAIL_FROM

SALES_EMAIL

WHATSAPP_NUMBER

CLOUDINARY_URL

TURNSTILE_SITE_KEY

TURNSTILE_SECRET_KEY

Do not commit `.env`.

---

# 66. PROJECT STRUCTURE

Use a clean scalable architecture.

Suggested:

`/app`

`/components`

`/lib`

`/server`

`/db`

`/prisma`

`/public`

`/emails`

`/types`

`/config`

`/translations`

`/admin`

Separate:

* UI
* business logic
* database
* validation
* email
* authentication

Avoid giant components.

---

# 67. COMPONENT ARCHITECTURE

Create reusable components:

Header

MegaMenu

SearchBar

HeroSlider

TrustCards

FunctionCard

CertificationBadge

ProductCard

ProductGrid

ProductFilter

ProductSearch

ProductGallery

RFQModal

RFQButton

RFQList

RFQForm

BrandCard

BrandTicker

Footer

WhatsAppButton

LanguageSwitcher

Breadcrumbs

FAQ

AdminSidebar

AdminDataTable

AdminProductForm

AdminRFQTable

---

# 68. ADMIN UI

Admin should look like a professional B2B management system.

Sidebar:

Dashboard

Products

Brands

Categories

Functions

Certifications

RFQs

Leads

Pages

Media

Translations

Settings

Users

Audit Logs

---

# 69. RESPONSIVE ADMIN

Admin should work on:

* Desktop
* Tablet

Mobile admin can be simplified but should remain usable.

---

# 70. DATABASE SEEDING

Create seed data for development.

Use realistic but clearly fictional/sample data.

Do NOT use fake real-world certifications.

Create:

* 5 sample brands
* 20 sample products
* 8 functions
* 6 certifications
* sample RFQs

Clearly mark sample data.

---

# 71. DEVELOPMENT PHASES

Do NOT attempt to build the entire application blindly in one step.

Follow this order.

PHASE 1:

Project setup

* Next.js
* TypeScript
* Tailwind
* Prisma
* PostgreSQL
* Environment configuration

PHASE 2:

Database

* Schema
* Migrations
* Seed

PHASE 3:

Design system

* Typography
* Colors
* Buttons
* Cards
* Forms
* Responsive system

PHASE 4:

Public frontend

* Header
* Homepage
* Products
* Product detail
* Brands
* Certifications
* Functions
* About
* Export
* Contact

PHASE 5:

RFQ

* RFQ modal
* RFQ list
* RFQ form
* Database
* Email
* Confirmation

PHASE 6:

Admin

* Authentication
* Dashboard
* Product management
* Brand management
* Certification management
* RFQ management

PHASE 7:

SEO

* Metadata
* Sitemap
* Structured data
* Canonicals

PHASE 8:

Security

* Validation
* Rate limiting
* CAPTCHA
* Upload security

PHASE 9:

Testing

* Unit tests
* API tests
* Form tests
* RFQ flow tests
* Responsive tests

PHASE 10:

Production optimization

* Performance
* Caching
* Image optimization
* Error handling
* Deployment

---

# 72. TESTING REQUIREMENTS

Create tests for:

1. Product creation
2. Product filtering
3. Product search
4. Brand filtering
5. Certification filtering
6. RFQ creation
7. RFQ validation
8. Email notification
9. Buyer confirmation
10. Admin authentication
11. Unauthorized admin access
12. File upload validation
13. Mobile navigation
14. Language switching

Critical E2E scenario:

Visitor → Product → Request Quote → Fill Form → Submit → Database → Admin Email → Buyer Confirmation → Admin RFQ Dashboard.

This complete flow must work.

---

# 73. IMPORTANT BUSINESS RULES

Rule 1:

This is NOT an e-commerce website.

Rule 2:

There is no checkout.

Rule 3:

There is no payment.

Rule 4:

There is no public price.

Rule 5:

RFQ is the primary conversion.

Rule 6:

Multi-product RFQ replaces shopping cart.

Rule 7:

All product information must be database-driven.

Rule 8:

Certification claims must be explicitly assigned by admin.

Rule 9:

MOQ must never be fabricated.

Rule 10:

Company claims must never be fabricated.

Rule 11:

Supplier/private information must never be exposed publicly.

Rule 12:

The website must be designed for international B2B procurement users.

---

# 74. HOMEPAGE FINAL ORDER

The homepage should use this exact hierarchy:

1. Announcement Bar
2. Header
3. Hero
4. Trust / Value Proposition
5. Shop by Function
6. Shop by Certification
7. Featured Products
8. Sachet Expertise Banner
9. Why Thai Beauty?
10. Export & Wholesale Process
11. Brand Partners
12. B2B FAQ
13. Request Wholesale Quote CTA
14. Footer

---

# 75. EXPORT PROCESS SECTION

Create a visual 5-step process:

01 — Discover Products

02 — Submit RFQ

03 — Receive Wholesale Quote

04 — Confirm Order

05 — Global Shipment

Use a clean horizontal process on desktop and vertical timeline on mobile.

---

# 76. GLOBAL CTA STRATEGY

Primary CTA throughout website:

"Request Wholesale Quote"

Secondary:

"Explore Products"

Third:

"Contact Sales"

Never use:

"Buy Now"

"Add to Cart"

"Checkout"

"Purchase"

"Shop Now"

unless "Shop" is used purely for catalog browsing and does not imply checkout.

---

# 77. FOOTER

Footer columns:

### Company

About Us

Export & Wholesale

Contact

### Products

Skincare

Sachet Products

Sun Protection

Acne Care

### Resources

FAQ

Certifications

Shipping

Request a Quote

### Legal

Privacy Policy

Terms & Conditions

Cookie Policy

Include:

* Company name
* Business email
* WhatsApp
* Address
* Social links

---

# 78. FINAL QUALITY STANDARD

The final application must look like a real international B2B beauty company, not an AI-generated template.

The UI should have:

* Strong visual hierarchy
* Consistent spacing
* Professional typography
* High-quality product presentation
* Excellent mobile UX
* Fast performance
* Clear B2B conversion funnel

Do not use generic placeholder layouts when a proper component can be implemented.

---

# 79. IMPORTANT AI CODING RULE

Before implementing any major feature:

1. Inspect the existing project.
2. Understand the architecture.
3. Do not unnecessarily rewrite working code.
4. Reuse components where appropriate.
5. Keep database schema normalized.
6. Keep business logic separate from UI.
7. Validate all user input.
8. Handle errors explicitly.
9. Do not invent business information.
10. Ask for clarification only when absolutely necessary.
11. Otherwise make reasonable technical assumptions and document them.
12. After each major phase, run tests and fix errors before continuing.

---

# 80. DELIVERABLE

Deliver a production-ready application including:

* Premium B2B frontend
* Responsive design
* Product catalog
* Brand directory
* Certification system
* Function categories
* Advanced filtering
* Product detail pages
* Multi-product RFQ
* RFQ modal
* RFQ database
* Email notifications
* Buyer confirmation
* Admin dashboard
* Lead management
* CMS-like content management
* TH/EN localization
* SEO
* Structured data
* Security
* Analytics-ready architecture
* Legal pages
* Error states
* Loading states
* Test suite
* Seed data
* Documentation
* `.env.example`
* Database migrations
* Production deployment instructions

At the end, provide:

1. Architecture explanation
2. Database ERD explanation
3. Folder structure
4. Environment variables
5. Installation instructions
6. Development commands
7. Database migration commands
8. Seed commands
9. Production deployment instructions
10. Admin credentials for development ONLY
11. Known limitations
12. Future improvement recommendations

Do not stop after creating a visual prototype.

The goal is a functional B2B wholesale platform where an international buyer can discover Thai beauty products, evaluate certifications and wholesale information, create a multi-product RFQ and submit it to the company's sales team.
