# 📸 Dazzling Tours — Website Image Specification Document

> **Document Purpose:** Handover specifications for the graphic designer. Contains exact dimensions, display aspect ratios, safe zones, and visual references for all static/main website images (excluding dynamic backend blog/tour uploads).

---

## 📊 Quick Master Cheat-Sheet

| # | Placement | File Key / URL Path | Live Upload Dimensions | Target Designer Export Size | Aspect Ratio | Format |
|---|---|---|---|---|---|---|
| **1** | **Landing Page Hero Banner** | `/assets/img/hero/hero2.webp` | **1369 × 768 px** | **1920 × 1080 px** *(or 2560 × 1440)* | **16:9** | WebP / JPG |
| **2** | **Tours Page Header** | `/assets/img/tours/tourspage.png` | **6000 × 1281 px** | **1920 × 600 px** *(or 2400 × 600)* | **16:5** (~4:1) | WebP / JPG |
| **3** | **About Us Page Header** | `/assets/img/breadcrumb/aboutpage.png` | **6000 × 1281 px** | **1920 × 600 px** *(or 2400 × 600)* | **16:5** (~4:1) | WebP / JPG |
| **4** | **Contact Page Header** | `/assets/img/contact/ContactUs.png` | **6000 × 1281 px** | **1920 × 600 px** *(or 2400 × 600)* | **16:5** (~4:1) | WebP / JPG |
| **5** | **Blogs Page Header** | `/assets/img/blogs/BlogsPage.webp` | **1240 × 826 px** | **1920 × 600 px** *(or 2400 × 600)* | **16:5** (~4:1) | WebP / JPG |
| **6** | **About Section: Main Center** | `/assets/img/about/about1.webp` | **1240 × 826 px** | **800 × 800 px** | **1:1** (Square) | WebP / JPG |
| **7** | **About Section: Bottom Badge** | `/assets/img/about/about2.webp` | **1240 × 826 px** | **500 × 500 px** | **1:1** (Square) | WebP / JPG |
| **8** | **About Section: Top Badge** | `/assets/img/about/about3.webp` | **1240 × 826 px** | **500 × 500 px** | **1:1** (Square) | WebP / JPG |
| **9** | **Why Choose Us Showcase** | `/assets/img/choose/Choose1.webp` | **718 × 898 px** | **800 × 1000 px** *(or 1000 × 1250)* | **4:5** (Vertical) | WebP / JPG |
| **10** | **CTA Video & Section Banner** | `/assets/img/cta/mountain-trip-family.jpg`| **5472 × 3648 px** | **1920 × 800 px** | **12:5** (~2.4:1)| WebP / JPG |
| **11** | **Brand Logo (Dark / Standard)** | `/assets/img/logo-dazzling/Logo_Black.png` | **4546 × 3654 px** | **500 × 400 px** (or SVG) | ~1.24:1 | PNG / SVG |
| **12** | **Brand Logo (White / Sticky)** | `/assets/img/logo-dazzling/Logo_White.png` | **4546 × 3654 px** | **500 × 400 px** (or SVG) | ~1.24:1 | PNG / SVG |

---

## 1. Landing Page Hero Banner

* **Path:** `/assets/img/hero/hero2.webp`
* **Live File Size / Dimensions:** `1369 × 768 px` (~241 KB)
* **Target Designer Canvas:** **1920 × 1080 px** (Full HD 16:9) or **2560 × 1440 px** (2K)
* **Aspect Ratio:** **16:9**
* **Container Code:** `min-h-[90vh]` full-viewport height background image with dark gradient overlays (`from-black/80 via-black/50 to-transparent`).
* **Design Guideline:** The headline *"Explore the Nature"* and CTA buttons sit on the left half of the screen. Keep the primary scenic subject / focal point centered or toward the right half.
* **Preview Reference:** `public/images_spec/previews/landing_hero.jpg`

---

## 2. Inner Page Headers (Breadcrumb Strip Banners)

Used on **Tours**, **About Us**, **Contact Us**, and **Blogs** header bars across the top of inner pages.

* **Paths:**
  * **Tours:** `/assets/img/tours/tourspage.png`
  * **About Us:** `/assets/img/breadcrumb/aboutpage.png`
  * **Contact:** `/assets/img/contact/ContactUs.png`
  * **Blogs:** `/assets/img/blogs/BlogsPage.webp`
* **Live File Dimensions:** `6000 × 1281 px` (~1.6 MB – 2.0 MB)
* **Target Designer Canvas:** **1920 × 600 px** (or **2400 × 600 px** for ultra-wide displays)
* **Aspect Ratio:** **16:5** (approx **3.2:1** to **4:1**)
* **Container Code:** `min-h-[380px]` (mobile) to `min-h-[460px]` (desktop) with gradient overlay `bg-gradient-to-b from-black/60 via-black/40 to-black/70`.
* **Design Guideline:** The page title (e.g. "Tours", "About Us") is centered with breadcrumb pills. Choose sweeping wide landscape photos with the main interest centered vertically.
* **Preview References:**
  * Tours: `public/images_spec/previews/tours_header.jpg`
  * About Us: `public/images_spec/previews/about_header.jpg`
  * Contact: `public/images_spec/previews/contact_header.jpg`
  * Blogs: `public/images_spec/previews/blogs_header.jpg`

---

## 3. Homepage "About Us" 3-Image Collage

* **Code Location:** `src/app/Components/About/About.tsx`
* **Layout Structure:** An artistic overlapping composition featuring 1 large square hero image and 2 floating badge photos with white borders and tilt rotations.

### A. Main Center Image
* **Path:** `/assets/img/about/about1.webp`
* **Live File Dimensions:** `1240 × 826 px` (displayed cropped to square in CSS: `aspect-square max-w-[400px]`)
* **Target Designer Canvas:** **800 × 800 px**
* **Aspect Ratio:** **1:1 (Square)**
* **Design Guideline:** Centered subject (travelers, couple, or tour guide). Edges are rounded with `rounded-3xl`.
* **Preview Reference:** `public/images_spec/previews/about_main.jpg`

### B. Floating Badge — Bottom-Right
* **Path:** `/assets/img/about/about2.webp`
* **Live File Dimensions:** `1240 × 826 px` (displayed cropped in CSS: `w-36 h-36` to `w-44 h-44` with a 6px white border and 2° rotation)
* **Target Designer Canvas:** **500 × 500 px**
* **Aspect Ratio:** **1:1 (Square)**
* **Preview Reference:** `public/images_spec/previews/about_badge_bottom.jpg`

### C. Floating Badge — Top-Left
* **Path:** `/assets/img/about/about3.webp`
* **Live File Dimensions:** `1240 × 826 px` (displayed cropped in CSS: `w-44 h-44` to `w-52 h-52` with a 6px white border and -6° rotation)
* **Target Designer Canvas:** **500 × 500 px**
* **Aspect Ratio:** **1:1 (Square)**
* **Preview Reference:** `public/images_spec/previews/about_badge_top.jpg`

---

## 4. Homepage "Why Choose Us" Vertical Showcase

* **Path:** `/assets/img/choose/Choose1.webp`
* **Live File Dimensions:** `718 × 898 px` (~56.7 KB)
* **Target Designer Canvas:** **800 × 1000 px** (or **1000 × 1250 px**)
* **Aspect Ratio:** **4:5 (Portrait / Vertical)**
* **Container Code:** `min-h-[400px]` with rounded corners `rounded-3xl` and `border-4 border-white shadow-2xl`.
* **Design Guideline:** Vertical framing of stunning scenery (Hunza valley, Attabad lake, pass, or mountains).
* **Preview Reference:** `public/images_spec/previews/choose_side.jpg`

---

## 5. Homepage Call-To-Action (CTA) & Video Section

* **Path:** `/assets/img/cta/mountain-trip-family.jpg`
* **Live File Dimensions:** `5472 × 3648 px` (~3.6 MB)
* **Target Designer Canvas:** **1920 × 800 px**
* **Aspect Ratio:** **12:5 (~2.4:1 Wide Landscape)**
* **Container Code:** `py-24 bg-cover` with `bg-black/60` dark overlay for white title text and play video button.
* **Design Guideline:** Emotional, adventurous family or friends group travel shot. Central action looks best.
* **Preview Reference:** `public/images_spec/previews/cta_video_bg.jpg`

---

## 6. Official Brand Logos

* **Paths:**
  * Dark/Black logo (top header transparent & footer): `/assets/img/logo-dazzling/Logo_Black.png`
  * White/Orange logo (sticky header): `/assets/img/logo-dazzling/Logo_White.png`
* **Live File Dimensions:** `4546 × 3654 px` (~765 KB each)
* **Target Designer Canvas:** **500 × 400 px** (Native aspect ratio `1.24:1`), or vector **SVG** (Recommended).
* **Format:** PNG with transparent background (or SVG).
* **Preview Reference:** `public/images_spec/previews/logo_black.jpg`

---

## 💡 Guidelines for the Designer

1. **File Formats:** Deliver in **WebP** (80-85% quality) or high-quality **JPG** for photos, and transparent **PNG / SVG** for logos.
2. **File Size Budget:**
   * Full Hero & Page Headers: Keep between **200 KB and 350 KB**.
   * About Collage & Side Cards: Keep under **120 KB**.
   * Logos: Under **50 KB**.
3. **Naming Convention:** When ready to upload to ImageKit / media assets, keep the same paths/filenames as listed to automatically reflect without code changes.
