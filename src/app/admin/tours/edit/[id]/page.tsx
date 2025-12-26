"use client";
import React, { useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { UpdateTourData } from "@/lib/types/tour";
import {
  useGetTour,
  useUpdateTour,
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
import { updateTourSchema } from "@/lib/validation/tour";

const EditTour = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data, isLoading } = useGetTour(resolvedParams.id);
  const updateTourMutation = useUpdateTour();
  const { showSuccess, showError } = useNotification();

  const tour = data?.data;
  const initializedRef = useRef(false);

  // Fetch categories for the select dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryOptions = React.useMemo(() => {
    const categories = categoriesData?.data || [];
    return categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
  }, [categoriesData]);

  const form = useForm<UpdateTourData>({
    initialValues: {
      _id: resolvedParams.id,
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
      const result = updateTourSchema.safeParse(values);
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

  useEffect(() => {
    if (tour && !initializedRef.current) {
      initializedRef.current = true;
      form.setValues({
        _id: resolvedParams.id,
        title: tour.title || "",
        description: tour.description || "",
        shortDescription: tour.shortDescription || "",
        price: tour.price || 0,
        duration: tour.duration || "",
        location: tour.location || "",
        category: tour.category || "",
        images: tour.images || [],
        highlights: tour.highlights || [],
        itinerary: tour.itinerary || [],
        includes: tour.includes || [],
        excludes: tour.excludes || [],
        difficulty: tour.difficulty || TourDifficulty.EASY,
        groupSize: tour.groupSize || 10,
        rating: tour.rating || 0,
        reviews: tour.reviews || 0,
        featured: tour.featured || false,
        status: tour.status || TourStatus.ACTIVE,
        seo: tour.seo || {
          metaTitle: "",
          metaDescription: "",
          slug: "",
          focusKeyword: "",
          ogImage: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, resolvedParams.id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    // Ensure SEO object is included in submission
    const submitData: UpdateTourData = {
      ...values,
      seo: values.seo || {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      },
    };

    updateTourMutation.mutate(submitData, {
      onSuccess: () => {
        showSuccess("Tour updated successfully!");
        router.push("/admin/tours");
      },
      onError: (error) => {
        showError(error.message || "Failed to update tour");
      },
    });
  });

  if (!tour) {
    return <div className="error">Tour not found</div>;
  }

  return (
    <Page
      title="Edit Tour"
      description="Update tour details and settings"
      loading={isLoading}
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
        <form id="edit-tour-form" onSubmit={handleSubmit} className="tour-form">
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
            <div className="form-grid">
              <NumberInput
                label="Rating"
                {...form.getFieldProps("rating")}
                min={0}
                max={5}
                step={0.1}
                precision={1}
              />

              <NumberInput
                label="Reviews Count"
                {...form.getFieldProps("reviews")}
                min={0}
              />

              <Checkbox
                label="Featured Tour"
                description="Display this tour prominently on the homepage"
                checked={form.values.featured}
                onChange={(checked) => form.setFieldValue("featured", checked)}
              />
            </div>
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
              onChange={(seo) => {
                // Ensure we always update the SEO object, even if it's empty
                form.setFieldValue("seo", {
                  metaTitle: seo.metaTitle || "",
                  metaDescription: seo.metaDescription || "",
                  slug: seo.slug || "",
                  focusKeyword: seo.focusKeyword || "",
                  ogImage: seo.ogImage || "",
                });
              }}
              firstImageUrl={form.values.images?.[0]}
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateTourMutation.isPending}
                leftIcon={
                  !updateTourMutation.isPending ? (
                    <i className="bi bi-check-lg"></i>
                  ) : undefined
                }
                disabled={updateTourMutation.isPending}
              >
                {updateTourMutation.isPending ? "Saving..." : "Update Tour"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditTour;
