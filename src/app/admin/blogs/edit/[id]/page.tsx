"use client";
import React, { useEffect, use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateBlogData } from "@/lib/types/blog";
import {
  useGetBlog,
  useUpdateBlog,
  useNotification,
  useForm,
  useAuth,
  useGetCategories,
  useDebounceValue,
} from "@/lib/hooks";
import { BlogStatus } from "@/lib/enums/blog";
import {
  TextInput,
  Textarea,
  TiptapRichTextEditor,
  Select,
  Checkbox,
  ImageUpload,
  SEOFields,
} from "@/app/Components/Form";
import { Button, Page, Title, Text, Icon } from "@/app/Components/Common";

const EditBlog = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data, isLoading } = useGetBlog(resolvedParams.id);
  const updateBlogMutation = useUpdateBlog();
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();

  const blog = data?.data;
  const initializedRef = useRef(false);

  const form = useForm<UpdateBlogData>({
    initialValues: {
      _id: resolvedParams.id,
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: [],
      featuredImage: "",
      status: BlogStatus.DRAFT,
      featured: false,
      seo: {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      },
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const [tagInput, setTagInput] = useState("");
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

  useEffect(() => {
    if (blog && !initializedRef.current) {
      initializedRef.current = true;
      form.setValues(
        {
          _id: resolvedParams.id,
          title: blog.title || "",
          content: blog.content || "",
          excerpt: blog.excerpt || "",
          author: blog.author || "",
          category: blog.category || "",
          tags: blog.tags || [],
          featuredImage: blog.featuredImage || "",
          status: blog.status,
          featured: blog.featured || false,
          seo: blog.seo || {
            metaTitle: "",
            metaDescription: "",
            slug: "",
            focusKeyword: "",
            ogImage: blog.featuredImage || "",
          },
        },
        { shouldReinitialize: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog, resolvedParams.id]);

  // Set author to logged-in user's name if not already set (e.g., for new drafts)
  useEffect(() => {
    if (user && !form.values.author && initializedRef.current) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (fullName) {
        form.setFieldValue("author", fullName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initializedRef.current]);

  // Debounced Auto-Save
  const debouncedValues = useDebounceValue(form.values, 5000);

  useEffect(() => {
    if (isLoading) return;

    // Only auto-save if the form is dirty
    if (!form.isDirty) return;

    const autoSave = async () => {
      try {
        await updateBlogMutation.mutateAsync({
          ...debouncedValues,
          _id: resolvedParams.id,
        });
        // Sync original values baseline with the saved state to clear dirty flags
        form.setValues(debouncedValues, { baselineSyncOnly: true });
      } catch (err) {
        console.error("[EditBlog] Auto-save failed:", err);
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

  // Ensure SEO object exists
  useEffect(() => {
    if (!form.values.seo) {
      form.setFieldValue("seo", {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: form.values.featuredImage || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = form.handleSubmit(async (values) => {
    // Ensure SEO object has all fields, including focusKeyword
    const submitData = {
      ...values,
      seo: {
        metaTitle: values.seo?.metaTitle ?? "",
        metaDescription: values.seo?.metaDescription ?? "",
        slug: values.seo?.slug ?? "",
        focusKeyword: values.seo?.focusKeyword ?? "",
        ogImage: values.seo?.ogImage ?? "",
      },
    };

    updateBlogMutation.mutate(submitData, {
      onSuccess: () => {
        showSuccess("Blog updated successfully!");
        router.push("/admin/blogs");
      },
      onError: (error) => {
        showError(error.message || "Failed to update blog");
      },
    });
  });

  const addTag = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !form.values.tags?.includes(trimmedValue)) {
      form.setFieldValue("tags", [...(form.values.tags || []), trimmedValue]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    form.setFieldValue(
      "tags",
      (form.values.tags || []).filter((_, i) => i !== index),
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleFeaturedImageChange = (images: string[]) => {
    form.setFieldValue("featuredImage", images.length > 0 ? images[0] : "");
  };

  return (
    <Page
      title="Edit Blog"
      description="Update your blog post details"
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
        <form id="blog-form" onSubmit={handleSubmit} className="tour-form">
          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="info-circle" /> Basic Information
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Essential details about your blog post
              </Text>
            </div>
            <div className="form-grid">
              <TextInput
                label="Blog Title"
                placeholder="e.g., Top 10 Travel Destinations for 2024"
                {...form.getFieldProps("title")}
                required
              />

              <TextInput
                label="Author"
                placeholder="e.g., John Doe"
                {...form.getFieldProps("author")}
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
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="file-earmark-text" /> Content
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Write your blog post content and excerpt
              </Text>
            </div>
            <div className="form-group">
              <Textarea
                label="Excerpt"
                description="Brief description that appears in blog listings and previews"
                {...form.getFieldProps("excerpt")}
                placeholder="e.g., Discover the most amazing travel destinations for 2024. From tropical paradises to cultural hotspots, this guide covers everything you need to know."
                rows={3}
                maxLength={300}
                showCharCount
                required
              />
            </div>
            <div className="form-group">
              <TiptapRichTextEditor
                label="Full Content"
                description="Main blog post content that appears on the blog details page"
                {...form.getFieldProps("content")}
                placeholder="e.g., Start writing your blog post here. You can format text, add headings, lists, and more using the toolbar above."
                rows={12}
                maxLength={10000}
                showCharCount
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="tag" /> Tags
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Add relevant tags to help readers find your blog post
              </Text>
            </div>
            <div className="form-group">
              <TextInput
                label="Add Tags"
                description="Type a tag and press Enter to add it"
                placeholder="e.g., travel, adventure, tips"
                value={tagInput}
                onChange={(value) => setTagInput(value)}
                onKeyDown={handleTagKeyDown}
              />
              <div className="d-flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  color="primary"
                  size="sm"
                  onClick={() => addTag(tagInput)}
                >
                  <Icon name="plus-circle" /> Add Tag
                </Button>
              </div>
            </div>
            {form.values.tags && form.values.tags.length > 0 && (
              <div className="form-group">
                <label className="form-label">Current Tags</label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {form.values.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-primary d-flex align-items-center gap-2"
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="subtle"
                        size="xs"
                        onClick={() => removeTag(index)}
                        aria-label="Remove tag"
                        style={{
                          padding: 0,
                          minWidth: "auto",
                          height: "auto",
                          color: "white",
                        }}
                      >
                        <Icon name="x" />
                      </Button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="image" /> Featured Image
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Upload a featured image for your blog post
              </Text>
            </div>
            <ImageUpload
              label="Featured Image"
              description="Upload a high-quality image that represents your blog post. This will be used as the cover image."
              value={
                form.values.featuredImage ? [form.values.featuredImage] : []
              }
              onChange={handleFeaturedImageChange}
              maxFiles={1}
              maxSize={5}
              multiple={false}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="gear" /> Settings
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Configure blog post settings and visibility
              </Text>
            </div>
            <div className="form-grid">
              <Select
                label="Status"
                value={form.values.status}
                onChange={(value) => form.setFieldValue("status", value)}
                data={[
                  { value: BlogStatus.DRAFT, label: "Draft" },
                  { value: BlogStatus.PUBLISHED, label: "Published" },
                ]}
              />
              <div className="form-group">
                <Checkbox
                  label="Featured Blog"
                  description="Display this blog prominently on the homepage"
                  checked={form.values.featured || false}
                  onChange={(checked) =>
                    form.setFieldValue("featured", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="search" /> SEO Settings
              </Title>
              <Text color="dimmed" size="sm" className="section-description">
                Optimize your blog post for search engines and social media
                sharing
              </Text>
            </div>
            <SEOFields
              values={
                form.values.seo || {
                  metaTitle: "",
                  metaDescription: "",
                  slug: "",
                  focusKeyword: "",
                  ogImage: form.values.featuredImage || "",
                }
              }
              onChange={(seo) => {
                // Ensure we always update the SEO object with all fields
                // Use ?? to preserve empty strings (not convert them to empty string if undefined)
                form.setFieldValue("seo", {
                  metaTitle: seo.metaTitle ?? "",
                  metaDescription: seo.metaDescription ?? "",
                  slug: seo.slug ?? "",
                  focusKeyword: seo.focusKeyword ?? "",
                  ogImage: seo.ogImage ?? "",
                });
              }}
              firstImageUrl={form.values.featuredImage}
              onSlugManuallyEdited={() => {
                slugManuallyEditedRef.current = true;
              }}
              onMetaTitleManuallyEdited={() => {
                metaTitleManuallyEditedRef.current = true;
              }}
              showSectionHeader={false}
              title={form.values.title}
              shortDescription={form.values.excerpt}
              enableAutoGeneration={true}
            />
          </div>

          <div className="form-actions">
            <div className="actions-container">
              <Button
                color="secondary"
                leftIcon={<Icon name="arrow-left" />}
                onClick={() => router.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateBlogMutation.isPending}
                leftIcon={
                  !updateBlogMutation.isPending ? (
                    <Icon name="check-lg" />
                  ) : undefined
                }
                disabled={updateBlogMutation.isPending}
              >
                {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditBlog;
