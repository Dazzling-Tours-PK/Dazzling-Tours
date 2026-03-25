"use client";
import React, { useEffect, useRef, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { UpdateTourData } from "@/lib/types/tour";
import {
  useGetTour,
  useUpdateTour,
  useNotification,
  useForm,
  useGetCategories,
  useDebounceValue,
} from "@/lib/hooks";
import { TourStatus, TourDifficulty, TourPriceType } from "@/lib/enums";
import {
  Checkbox,
  ItineraryManager,
  ImageUpload,
  SEOFields,
} from "@/app/Components/Form";
import { Button, Page, Title, Text, Icon } from "@/app/Components/Common";
import { updateTourSchema } from "@/lib/validation/tour";
import {
  filterValidImageUrls,
  filterValidImageUrl,
} from "@/lib/utils/imageUtils";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { DescriptionsSection } from "./components/DescriptionsSection";
import { ListsSection } from "./components/ListsSection";

const ManageTour = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data, isLoading } = useGetTour(resolvedParams.id);
  const updateTourMutation = useUpdateTour();
  const { showSuccess, showError } = useNotification();

  const tour = data?.data;
  const initializedRef = useRef(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const debouncedCategorySearch = useDebounceValue(categorySearchTerm, 500);

  // Fetch categories for the select dropdown with search
  const { data: categoriesData } = useGetCategories({
    limit: 1000,
    search: debouncedCategorySearch || undefined,
  });
  const categoryOptions = useMemo(() => {
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
      priceType: TourPriceType.PER_PERSON,
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
      featured: false,
      status: TourStatus.DRAFT,
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

      // Filter out data URLs from existing images - only keep Cloudinary URLs (or any HTTP/HTTPS URLs)
      let filteredImages: string[] = [];
      if (tour.images && Array.isArray(tour.images)) {
        filteredImages = filterValidImageUrls(tour.images);
      }

      // Filter out data URL from SEO ogImage if present
      let filteredOgImage = "";
      if (tour.seo?.ogImage) {
        filteredOgImage = filterValidImageUrl(tour.seo.ogImage);
      }

      form.setValues(
        {
          _id: resolvedParams.id,
          title: tour.title || "",
          description: tour.description || "",
          shortDescription: tour.shortDescription || "",
          price: tour.price || 0,
          priceType: tour.priceType,
          duration: tour.duration || "",
          location: tour.location || "",
          category: tour.category || "",
          images: filteredImages, // Use filtered images (no data URLs)
          highlights: tour.highlights || [],
          itinerary: tour.itinerary || [],
          includes: tour.includes || [],
          excludes: tour.excludes || [],
          difficulty: tour.difficulty,
          groupSize: tour.groupSize || 10,
          featured: tour.featured || false,
          status: tour.status,
          seo: {
            metaTitle: tour.seo?.metaTitle || "",
            metaDescription: tour.seo?.metaDescription || "",
            slug: tour.seo?.slug || "",
            focusKeyword: tour.seo?.focusKeyword || "",
            ogImage: filteredOgImage, // Use filtered ogImage (no data URLs)
          },
        },
        { shouldReinitialize: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, resolvedParams.id]);

  // Debounced Auto-Save
  const debouncedValues = useDebounceValue(form.values, 5000);

  useEffect(() => {
    if (isLoading) return;

    // Only auto-save if the form is dirty.
    // We check form.isDirty here rather than in the dependencies to avoid
    // triggering a save with stale debouncedValues when the form first becomes dirty.
    if (!form.isDirty) return;

    const autoSave = async () => {
      try {
        await updateTourMutation.mutateAsync({
          ...debouncedValues,
          _id: resolvedParams.id,
        });
        // Sync original values baseline with the saved state to clear dirty flags
        // We use baselineSyncOnly: true to prevent overwriting user's active typing
        form.setValues(debouncedValues, { baselineSyncOnly: true });
      } catch (err) {
        console.error("[ManageTour] Auto-save failed:", err);
      }
    };

    autoSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, resolvedParams.id, isLoading]);

  // Navigation Guard: Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.isDirty]);

  const handleSubmit = form.handleSubmit(async (values) => {
    // ImageUpload component already uploads to Cloudinary and returns only Cloudinary URLs
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
      title="Manage Tour"
      description="Update tour details, manage images, and configure settings"
      loading={isLoading}
      headerActions={
        <Button
          color="secondary"
          leftIcon={<Icon name="arrow-left" />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      }
    >
      <div className="form-container">
        <form id="edit-tour-form" onSubmit={handleSubmit} className="tour-form">
          <BasicInfoSection
            form={form}
            categoryOptions={categoryOptions}
            setCategorySearchTerm={setCategorySearchTerm}
          />

          <div className="form-section">
            <div className="section-header">
              <Title
                order={3}
                weight={600}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Icon
                  name="images"
                  style={{ color: "#fd7d02", fontSize: "1.2rem" }}
                />{" "}
                Tour Images
              </Title>
              <Text size="md" color="dimmed" style={{ marginTop: "0.5rem" }}>
                Upload high-quality images showcasing your tour destinations and
                activities
              </Text>
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

          <DescriptionsSection form={form} />

          <ListsSection form={form} />

          <div className="form-section">
            <div className="section-header">
              <Title
                order={3}
                weight={600}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Icon
                  name="calendar-check"
                  style={{ color: "#fd7d02", fontSize: "1.2rem" }}
                />{" "}
                Itinerary
              </Title>
              <Text size="md" color="dimmed" style={{ marginTop: "0.5rem" }}>
                Create a detailed day-by-day schedule for your tour
              </Text>
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
                  (form.values.itinerary || []).filter((_, i) => i !== index),
                )
              }
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title
                order={3}
                weight={600}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Icon
                  name="gear"
                  style={{ color: "#fd7d02", fontSize: "1.2rem" }}
                />{" "}
                Additional Options
              </Title>
              <Text size="md" color="dimmed" style={{ marginTop: "0.5rem" }}>
                Configure additional tour settings
              </Text>
            </div>
            <div className="form-grid">
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
              <Title
                order={3}
                weight={600}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Icon
                  name="search"
                  style={{ color: "#fd7d02", fontSize: "1.2rem" }}
                />{" "}
                SEO Settings
              </Title>
              <Text size="md" color="dimmed" style={{ marginTop: "0.5rem" }}>
                Optimize your tour for search engines and social media sharing
              </Text>
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
                leftIcon={<Icon name="arrow-left" />}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateTourMutation.isPending}
                leftIcon={
                  !updateTourMutation.isPending ? (
                    <Icon name="check-lg" />
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

export default ManageTour;
