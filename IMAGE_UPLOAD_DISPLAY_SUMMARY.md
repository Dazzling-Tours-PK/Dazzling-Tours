# Image Upload and Display Summary

This document summarizes all pages and components that handle image uploads and displays in the Dazzling Tours application.

## Image Upload Pages

### 1. **Tours Management**

#### Add Tour (`/admin/tours/add`)
- **Component**: `ImageUpload`
- **Field**: `images` (array)
- **Configuration**:
  - Multiple images: Yes (max 3)
  - Max size: 5MB per image
  - Accepted types: JPEG, PNG, WebP
- **Storage**: Cloudinary URLs stored in `tour.images[]` array
- **Usage**: First image is used as cover image

#### Edit Tour (`/admin/tours/edit/[id]`)
- **Component**: `ImageUpload`
- **Field**: `images` (array)
- **Configuration**:
  - Multiple images: Yes (max 5)
  - Max size: 5MB per image
  - Accepted types: JPEG, PNG, WebP
- **Behavior**: Displays existing Cloudinary URLs, allows adding/removing images

### 2. **Blogs Management**

#### Add Blog (`/admin/blogs/add`)
- **Component**: `ImageUpload`
- **Field**: `featuredImage` (string)
- **Configuration**:
  - Multiple images: No (single image)
  - Max size: 5MB
  - Accepted types: JPEG, PNG, WebP
- **Storage**: Cloudinary URL stored in `blog.featuredImage`

#### Edit Blog (`/admin/blogs/edit/[id]`)
- **Component**: `ImageUpload`
- **Field**: `featuredImage` (string)
- **Configuration**: Same as Add Blog
- **Behavior**: Displays existing Cloudinary URL, allows replacement

### 3. **Testimonials Management**

#### Add Testimonial (`/admin/testimonials/add`)
- **Component**: `ImageUpload`
- **Field**: `image` (string)
- **Configuration**:
  - Multiple images: No (single image)
  - Max size: 5MB
  - Accepted types: JPEG, PNG, WebP
- **Storage**: Cloudinary URL stored in `testimonial.image`

#### Edit Testimonial (`/admin/testimonials/edit/[id]`)
- **Component**: `ImageUpload`
- **Field**: `image` (string)
- **Configuration**: Same as Add Testimonial
- **Behavior**: Displays existing Cloudinary URL, allows replacement

### 4. **SEO Fields Component**

#### Used in: Tours, Blogs
- **Component**: `ImageUpload` (via `SEOFields`)
- **Field**: `seo.ogImage` (string)
- **Configuration**:
  - Multiple images: No (single image)
  - Max size: 5MB
  - Accepted types: JPEG, PNG, WebP
- **Storage**: Cloudinary URL stored in `seo.ogImage`

## Image Display Pages

### 1. **Public-Facing Pages**

#### Tour Details (`/tours/[slug]`)
- **Component**: `TourDetails`
- **Images Displayed**: 
  - Main image: `tour.images[0]`
  - Gallery images: `tour.images[1-4]` (up to 4 additional)
- **Component**: Next.js `Image` component
- **Fallback**: `/assets/img/details/tour-details.jpg`

#### Testimonials Section (Homepage)
- **Component**: `Testimonial`
- **Images Displayed**: `testimonial.image`
- **Component**: Next.js `Image` component
- **Fallback**: `/assets/img/testimonial/01.jpg`

### 2. **Admin Pages**

#### Tours List (`/admin/tours`)
- **Images**: Not displayed in list view (only title, location, price, etc.)

#### Tour View (`/admin/tours/view/[id]`)
- **Images Displayed**: 
  - Main image: `tour.images[0]` (large display)
  - Thumbnail gallery: `tour.images[1+]` (grid layout)
- **Component**: Next.js `Image` component
- **Styling**: Custom CSS for gallery layout

#### Testimonials List (`/admin/testimonials`)
- **Images Displayed**: `testimonial.image` (avatar in table)
- **Component**: `Avatar` component
- **Size**: Small (sm)

## Image Upload Flow

### Current Implementation (Cloudinary)

1. **User selects files** → `ImageUpload` component
2. **Files validated** → Size, type, count checks
3. **Files uploaded** → `/api/upload` endpoint
4. **API processes** → Converts to base64, uploads to Cloudinary
5. **Cloudinary returns** → Secure URLs (`secure_url`)
6. **URLs stored** → Saved to database (MongoDB)
7. **Images displayed** → Next.js `Image` component with Cloudinary URLs

### Image Storage Format

- **New uploads**: Cloudinary URLs (e.g., `https://res.cloudinary.com/...`)
- **Legacy data**: May contain data URLs (base64) - still supported for display
- **Database field**: String or String array depending on entity

## Configuration

### Next.js Image Configuration (`next.config.mjs`)

```javascript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "**" },
    { protocol: "http", hostname: "**" }
  ],
  unoptimized: false
}
```

✅ **Cloudinary URLs are supported** - All HTTPS URLs are allowed

### Cloudinary Configuration

- **Folder structure**: `dazzling-tours/` (default)
- **Transformations**: Auto quality, auto format
- **Storage**: Cloud-based CDN

## Backward Compatibility

The `ImageUpload` component and image display components handle both:
- ✅ **Cloudinary URLs** (new format): `https://res.cloudinary.com/...`
- ✅ **Data URLs** (legacy format): `data:image/jpeg;base64,...`

Both formats work with Next.js `Image` component and are displayed correctly.

## API Endpoints

### Upload Endpoint
- **Route**: `/api/upload`
- **Method**: POST
- **Input**: FormData with `files` array
- **Output**: Array of Cloudinary URLs
- **Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "...",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 123456
    }
  ],
  "count": 1
}
```

## Image Display Components

### Next.js Image Component
- Used throughout for optimized image rendering
- Supports Cloudinary URLs via `remotePatterns`
- Automatic optimization and lazy loading

### Avatar Component
- Used in testimonials list
- Displays circular profile images
- Supports Cloudinary URLs

## Notes

1. **Image URLs are stored as strings** in the database
2. **No image deletion on Cloudinary** when removed from forms (consider cleanup)
3. **All images are publicly accessible** via Cloudinary URLs
4. **Image optimization** is handled by Cloudinary and Next.js
5. **Fallback images** are used when no image is provided

## Potential Improvements

1. **Image Cleanup**: Delete images from Cloudinary when removed from database
2. **Image Optimization**: Use Cloudinary transformations for different sizes
3. **Lazy Loading**: Already implemented via Next.js Image
4. **Error Handling**: Add fallback images for broken Cloudinary URLs
5. **Image Validation**: Add server-side validation for image URLs

