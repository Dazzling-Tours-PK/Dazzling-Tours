"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreateTourData } from "@/lib/types/tour";
import {
  useCreateTour,
  useNotification,
  useForm,
  useGetCategories,
} from "@/lib/hooks";
import {
  TourStatus,
  TOUR_STATUS_OPTIONS,
  TourDifficulty,
  TOUR_DIFFICULTY_OPTIONS,
} from "@/lib/enums";
import {
  TextInput,
  NumberInput,
  Textarea,
  TiptapRichTextEditor,
  Select,
  Checkbox,
  ListManager,
  ItineraryManager,
  ImageUpload,
  SEOFields,
} from "@/app/Components/Form";
import { Button, Page } from "@/app/Components/Common";
import { createTourSchema } from "@/lib/validation/tour";

const AddTour = () => {
  const router = useRouter();
  const createTourMutation = useCreateTour();
  const { showSuccess, showError } = useNotification();
  const slugManuallyEditedRef = useRef(false);
  const metaTitleManuallyEditedRef = useRef(false);

  // Fetch categories for the select dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryOptions = React.useMemo(() => {
    const categories = categoriesData?.data || [];
    return categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
  }, [categoriesData]);

  const form = useForm<CreateTourData>({
    initialValues: {
      title: "",
      description: "",
      shortDescription: "",
      price: 0,
      duration: "",
      location: "",
      category: "",
      images: [],
      highlights: [],
      itinerary: [],
      includes: [],
      excludes: [],
      difficulty: TourDifficulty.EASY,
      groupSize: 10,
      rating: 0,
      reviews: 0,
      featured: false,
      status: TourStatus.ACTIVE,
      seo: {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      },
    },
    validate: (values) => {
      const result = createTourSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Ensure SEO object exists (auto-generation is now handled in SEOFields component)
  useEffect(() => {
    if (!form.values.seo) {
      form.setFieldValue("seo", {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-set OG image to first tour image
  useEffect(() => {
    if (
      form.values.images &&
      form.values.images.length > 0 &&
      form.values.seo &&
      !form.values.seo.ogImage
    ) {
      form.setFieldValue("seo", {
        ...form.values.seo,
        ogImage: form.values.images[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.images]);

  // Character counters for SEO fields

  const handleSubmit = form.handleSubmit(async (values) => {
    createTourMutation.mutate(values, {
      onSuccess: () => {
        showSuccess("Tour created successfully!");
        router.push("/admin/tours");
      },
      onError: (error) => {
        showError(error.message || "Failed to create tour");
      },
    });
  });

  return (
    <Page
      title="Add New Tour"
      description="Create a new tour package with all necessary details"
      headerActions={
        <Button
          color="secondary"
          leftIcon={<i className="bi bi-arrow-left"></i>}
          onClick={() => router.back()}
        >
          Back
        </Button>
      }
    >
      <div className="form-container">
        <form id="tour-form" onSubmit={handleSubmit} className="tour-form">
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-info-circle"></i> Basic Information
              </h3>
              <p className="section-description">
                Essential details about your tour package
              </p>
            </div>
            <div className="form-grid">
              <TextInput
                label="Tour Title"
                placeholder="e.g., Amazing 3-Day Cultural Heritage Tour"
                {...form.getFieldProps("title")}
                required
              />

              <NumberInput
                label="Price (USD)"
                placeholder="299"
                {...form.getFieldProps("price")}
                min={0}
                step={0.01}
                required
              />

              <TextInput
                label="Duration"
                placeholder="e.g., 3 days, 5 days, 1 week"
                {...form.getFieldProps("duration")}
                required
              />

              <TextInput
                label="Location/Destination"
                placeholder="e.g., Paris, France or Bali, Indonesia"
                {...form.getFieldProps("location")}
                required
              />

              <Select
                label="Category"
                {...form.getFieldProps("category")}
                placeholder="Select Category"
                data={categoryOptions}
                required
                searchable
              />

              <NumberInput
                label="Maximum Group Size"
                placeholder="15"
                {...form.getFieldProps("groupSize")}
                min={1}
                max={50}
              />

              <Select
                label="Difficulty Level"
                {...form.getFieldProps("difficulty")}
                data={TOUR_DIFFICULTY_OPTIONS}
              />

              <Select
                label="Status"
                value={form.values.status}
                onChange={(value) =>
                  form.setFieldValue("status", value as TourStatus)
                }
                data={TOUR_STATUS_OPTIONS}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-images"></i> Tour Images
              </h3>
              <p className="section-description">
                Upload high-quality images showcasing your tour destinations and
                activities
              </p>
            </div>
            <ImageUpload
              label="Tour Images"
              description="Upload multiple images to showcase your tour. First image will be used as the main cover image."
              {...form.getFieldProps("images")}
              maxFiles={5}
              maxSize={5}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-file-text"></i> Tour Descriptions
              </h3>
              <p className="section-description">
                Provide detailed information about your tour
              </p>
            </div>
            <div className="form-group">
              <Textarea
                label="Short Description"
                description="Brief overview (2-3 sentences) that appears in tour listings"
                {...form.getFieldProps("shortDescription")}
                placeholder="e.g., Discover the rich cultural heritage of ancient temples and bustling markets in this immersive 3-day journey through historic landmarks and local traditions."
                rows={3}
                maxLength={200}
                showCharCount
                required
              />
            </div>
            <div className="form-group">
              <TiptapRichTextEditor
                label="Full Description"
                description="Detailed description that appears on the tour details page"
                {...form.getFieldProps("description")}
                placeholder="e.g., Embark on an unforgettable journey through centuries of history and culture. This comprehensive tour takes you through ancient temples, traditional villages, and modern cities, offering a perfect blend of historical exploration and contemporary experiences. Our expert guides will share fascinating stories and insights about local traditions, architecture, and way of life. You'll have the opportunity to interact with local communities, taste authentic cuisine, and participate in traditional activities. The tour includes comfortable accommodations, all meals, and transportation, ensuring a hassle-free and enriching experience."
                rows={6}
                maxLength={2000}
                showCharCount
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-star"></i> Highlights
              </h3>
              <p className="section-description">
                Add key features and attractions that make this tour special
              </p>
            </div>

            <ListManager
              label="Highlights"
              description="Add key features and attractions that make this tour special"
              placeholder="e.g., Visit ancient temples, Scenic mountain views, Local cultural experience"
              addButtonText="Add Highlight"
              emptyStateText="No highlights added yet"
              emptyStateIcon={<i className="bi bi-star"></i>}
              items={form.values.highlights || []}
              onAdd={(item) =>
                form.setFieldValue("highlights", [
                  ...(form.values.highlights || []),
                  item,
                ])
              }
              onRemove={(index) =>
                form.setFieldValue(
                  "highlights",
                  (form.values.highlights || []).filter((_, i) => i !== index)
                )
              }
              maxItems={10}
              error={form.errors.highlights}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-calendar-check"></i> Itinerary
              </h3>
              <p className="section-description">
                Create a detailed day-by-day schedule for your tour
              </p>
            </div>
            <ItineraryManager
              label="Itinerary"
              description="Create a detailed day-by-day schedule for your tour"
              items={form.values.itinerary || []}
              onAdd={(item) =>
                form.setFieldValue("itinerary", [
                  ...(form.values.itinerary || []),
                  item,
                ])
              }
              onRemove={(index) =>
                form.setFieldValue(
                  "itinerary",
                  (form.values.itinerary || []).filter((_, i) => i !== index)
                )
              }
              maxItems={15}
              error={form.errors.itinerary}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-check-circle"></i> Includes
              </h3>
              <p className="section-description">
                List what&apos;s included in the tour price (meals,
                transportation, accommodation, etc.)
              </p>
            </div>
            <ListManager
              label="Includes"
              description="List what's included in the tour price (meals, transportation, accommodation, etc.)"
              placeholder="e.g., All meals included, Professional guide, Hotel accommodation, Airport transfers"
              addButtonText="Add Include"
              emptyStateText="No includes added yet"
              emptyStateIcon={<i className="bi bi-check-circle"></i>}
              items={form.values.includes || []}
              onAdd={(item) =>
                form.setFieldValue("includes", [
                  ...(form.values.includes || []),
                  item,
                ])
              }
              onRemove={(index) =>
                form.setFieldValue(
                  "includes",
                  (form.values.includes || []).filter((_, i) => i !== index)
                )
              }
              maxItems={15}
              error={form.errors.includes}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-x-circle"></i> Excludes
              </h3>
              <p className="section-description">
                List what&apos;s NOT included in the tour price (optional
                activities, personal expenses, etc.)
              </p>
            </div>
            <ListManager
              label="Excludes"
              description="List what's NOT included in the tour price (optional activities, personal expenses, etc.)"
              placeholder="e.g., International flights, Travel insurance, Personal expenses, Optional activities"
              addButtonText="Add Exclude"
              emptyStateText="No excludes added yet"
              emptyStateIcon={<i className="bi bi-x-circle"></i>}
              items={form.values.excludes || []}
              onAdd={(item) =>
                form.setFieldValue("excludes", [
                  ...(form.values.excludes || []),
                  item,
                ])
              }
              onRemove={(index) =>
                form.setFieldValue(
                  "excludes",
                  (form.values.excludes || []).filter((_, i) => i !== index)
                )
              }
              maxItems={15}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-gear"></i> Additional Options
              </h3>
              <p className="section-description">
                Configure additional tour settings
              </p>
            </div>
            <Checkbox
              label="Featured Tour"
              description="Display this tour prominently on the homepage"
              checked={form.values.featured}
              onChange={(checked) => form.setFieldValue("featured", checked)}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-search"></i> SEO Settings
              </h3>
              <p className="section-description">
                Optimize your tour for search engines and social media sharing
              </p>
            </div>
            <SEOFields
              values={
                form.values.seo || {
                  metaTitle: "",
                  metaDescription: "",
                  slug: "",
                  focusKeyword: "",
                  ogImage: "",
                }
              }
              onChange={(seo) => form.setFieldValue("seo", seo)}
              firstImageUrl={form.values.images?.[0]}
              onSlugManuallyEdited={() => {
                slugManuallyEditedRef.current = true;
              }}
              onMetaTitleManuallyEdited={() => {
                metaTitleManuallyEditedRef.current = true;
              }}
              showSectionHeader={false}
              title={form.values.title}
              location={form.values.location}
              shortDescription={form.values.shortDescription}
              price={form.values.price}
              duration={form.values.duration}
              enableAutoGeneration={true}
            />
          </div>

          <div className="form-actions">
            <div className="actions-container">
              <Button
                color="secondary"
                leftIcon={<i className="bi bi-arrow-left"></i>}
                onClick={() => router.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createTourMutation.isPending}
                leftIcon={
                  !createTourMutation.isPending ? (
                    <i className="bi bi-check-lg"></i>
                  ) : undefined
                }
                disabled={createTourMutation.isPending}
              >
                {createTourMutation.isPending ? "Creating..." : "Create Tour"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default AddTour;
