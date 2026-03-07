"use client";
import React, { useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { UpdateTestimonialData } from "@/lib/types/testimonial";
import {
  useUpdateTestimonial,
  useNotification,
  useForm,
  useGetTestimonial,
} from "@/lib/hooks";
import { useGetTours } from "@/lib/hooks/useTours";
import { Page, Button } from "@/app/Components/Common";
import {
  TestimonialStatus,
  TESTIMONIAL_STATUS_OPTIONS,
} from "@/lib/enums/testimonial";
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  ImageUpload,
  StarRating,
} from "@/app/Components/Form";

const EditTestimonial = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const updateTestimonialMutation = useUpdateTestimonial();
  const { showSuccess, showError } = useNotification();
  const { data: toursData, isLoading: toursLoading } = useGetTours();
  const { data: testimonialData, isLoading: testimonialLoading } =
    useGetTestimonial(resolvedParams.id);

  const form = useForm<UpdateTestimonialData>({
    initialValues: {
      _id: resolvedParams.id,
      name: "",
      content: "",
      rating: 5,
      image: "",
      location: "",
      tourId: "",
      status: TestimonialStatus.ACTIVE,
      featured: false,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.name?.trim()) errors.name = "Name is required";
      if (!values.content?.trim()) errors.content = "Content is required";
      if (!values.rating || values.rating < 1 || values.rating > 5)
        errors.rating = "Rating must be between 1 and 5";
      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Memoize testimonial data
  const testimonial = useMemo(() => {
    return testimonialData?.data || null;
  }, [testimonialData?.data]);

  // Helper function to extract tour ID
  const getTourId = (
    tourId: string | { _id: string; title: string } | undefined,
  ): string => {
    if (typeof tourId === "string") return tourId;
    if (tourId && typeof tourId === "object" && tourId._id) return tourId._id;
    return "";
  };

  // Update form values when testimonial data is loaded
  useEffect(() => {
    if (testimonial) {
      form.setValues({
        _id: testimonial._id,
        name: testimonial.name,
        content: testimonial.content,
        rating: testimonial.rating,
        image: testimonial.image || "",
        location: testimonial.location || "",
        tourId: getTourId(testimonial.tourId),
        status: testimonial.status as TestimonialStatus,
        featured: testimonial.featured,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonial]);

  // Memoize tours data to prevent unnecessary re-computations
  const tours = useMemo(() => {
    return toursData?.data || [];
  }, [toursData?.data]);

  // Memoize tour options for the Select component
  const tourOptions = useMemo(() => {
    return [
      { value: "", label: "Select a tour (optional)" },
      ...tours.map((tour) => ({
        value: tour._id,
        label: tour.title,
      })),
    ];
  }, [tours]);

  const handleSubmit = form.handleSubmit(async (values) => {
    updateTestimonialMutation.mutate(values, {
      onSuccess: () => {
        showSuccess("Testimonial updated successfully!");
        router.push("/admin/testimonials");
      },
      onError: (error) => {
        showError(error.message || "Failed to update testimonial");
      },
    });
  });

  if (!testimonial) {
    return (
      <Page
        title="Edit Testimonial"
        description="Update testimonial information"
        headerActions={
          <Button
            color="secondary"
            variant="outline"
            leftIcon={<i className="bi bi-arrow-left"></i>}
            onClick={() => router.back()}
          >
            Back
          </Button>
        }
      >
        <div className="card">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h3 className="mt-3">Testimonial Not Found</h3>
            <p className="text-muted">
              The testimonial you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Button
              color="primary"
              leftIcon={<i className="bi bi-arrow-left"></i>}
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Edit Testimonial"
      description="Update testimonial information"
      loading={testimonialLoading || toursLoading}
      headerActions={
        <Button
          color="secondary"
          variant="outline"
          leftIcon={<i className="bi bi-arrow-left"></i>}
          onClick={() => router.back()}
        >
          Back
        </Button>
      }
    >
      <div className="form-container">
        <form
          id="testimonial-form"
          onSubmit={handleSubmit}
          className="testimonial-form"
        >
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-person-circle"></i> Basic Information
              </h3>
              <p className="section-description">
                Essential details about the person giving the testimonial
              </p>
            </div>
            <div className="form-grid">
              <TextInput
                label="Name"
                placeholder="e.g., John Smith"
                value={form.values.name}
                onChange={(value) => form.setFieldValue("name", value)}
                error={form.errors.name}
                required
              />
              <TextInput
                label="Location"
                placeholder="City, Country (optional)"
                value={form.values.location}
                onChange={(value) => form.setFieldValue("location", value)}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-image"></i> Profile Image
              </h3>
              <p className="section-description">
                Upload a profile image for the testimonial
              </p>
            </div>
            <ImageUpload
              label="Profile Image"
              description="Upload a profile image for the testimonial. This will be displayed alongside the testimonial."
              value={form.values.image ? [form.values.image] : []}
              onChange={(images) =>
                form.setFieldValue("image", images[0] || "")
              }
              maxFiles={1}
              maxSize={5}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-chat-quote"></i> Testimonial Content
              </h3>
              <p className="section-description">
                The testimonial content and rating
              </p>
            </div>
            <div className="form-group">
              <Textarea
                label="Content"
                placeholder="Write the testimonial content here..."
                value={form.values.content}
                onChange={(value) => form.setFieldValue("content", value)}
                rows={6}
                error={form.errors.content}
                required
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <StarRating
                rating={form.values.rating || 5}
                onRatingChange={(rating) =>
                  form.setFieldValue("rating", rating)
                }
                maxStars={5}
                size="md"
              />
              {form.errors.rating && (
                <div className="invalid-feedback">{form.errors.rating}</div>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-map"></i> Tour Association
              </h3>
              <p className="section-description">
                Link this testimonial to a specific tour (optional)
              </p>
            </div>
            <Select
              label="Related Tour"
              value={form.values.tourId}
              onChange={(value) => form.setFieldValue("tourId", value)}
              data={tourOptions}
              searchable={true}
              clearable={true}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="bi bi-gear"></i> Settings
              </h3>
              <p className="section-description">
                Configure testimonial visibility and status
              </p>
            </div>
            <div className="form-row">
              <Checkbox
                label="Featured Testimonial"
                description="Display this testimonial prominently on the homepage"
                checked={form.values.featured}
                onChange={(checked) => form.setFieldValue("featured", checked)}
              />
              <Select
                label="Status"
                value={form.values.status}
                onChange={(value) =>
                  form.setFieldValue("status", value as TestimonialStatus)
                }
                data={TESTIMONIAL_STATUS_OPTIONS}
              />
            </div>
          </div>
        </form>

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
              form="testimonial-form"
              loading={updateTestimonialMutation.isPending}
              leftIcon={
                !updateTestimonialMutation.isPending ? (
                  <i className="bi bi-check-lg"></i>
                ) : undefined
              }
              disabled={updateTestimonialMutation.isPending}
            >
              {updateTestimonialMutation.isPending
                ? "Updating..."
                : "Update Testimonial"}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EditTestimonial;
