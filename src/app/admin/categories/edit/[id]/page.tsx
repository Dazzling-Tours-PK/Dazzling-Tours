"use client";
import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { UpdateCategoryData } from "@/lib/types/category";
import {
  useGetCategory,
  useUpdateCategory,
  useNotification,
  useForm,
} from "@/lib/hooks";
import { TextInput, Textarea } from "@/app/Components/Form";
import { Button, Page, Title, Text, Icon } from "@/app/Components/Common";
import { generateSlug } from "@/lib/utils/dataCleaning";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";
import { getErrorMessage } from "@/lib/utils/errorHandling";

const EditCategory = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data, isLoading } = useGetCategory(resolvedParams.id);
  const updateCategoryMutation = useUpdateCategory();
  const { showSuccess, showError } = useNotification();

  const category = data?.data;
  const initializedRef = React.useRef(false);

  const form = useForm<UpdateCategoryData>({
    initialValues: {
      _id: resolvedParams.id,
      name: "",
      slug: "",
      description: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.name) {
        errors.name = "Category name is required";
      }

      if (!values.slug) {
        errors.slug = "Slug is required";
      } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
        errors.slug =
          "Slug can only contain lowercase letters, numbers, and hyphens";
      }

      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (category && !initializedRef.current) {
      form.setValues({
        _id: category._id,
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
      });
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Auto-generate slug from name if slug is empty
  useEffect(() => {
    if (form.values.name && !form.values.slug && initializedRef.current) {
      const generatedSlug = generateSlug(form.values.name);
      form.setFieldValue("slug", generatedSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.name]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await updateCategoryMutation.mutateAsync(values);
      showSuccess("Category updated successfully!");
      router.push("/admin/categories");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to update category"));
    }
  });

  if (isLoading) {
    return (
      <Page
        title="Edit Category"
        description="Update category details"
        loading={true}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading category...</p>
        </div>
      </Page>
    );
  }

  if (!category) {
    return (
      <Page title="Edit Category" description="Update category details">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Category not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </Page>
    );
  }

  // Prevent editing "Uncategorized" category
  if (category.name === UNCATEGORIZED_CATEGORY_NAME) {
    return (
      <Page title="Edit Category" description="Update category details">
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Icon
            name="shield-lock"
            style={{ fontSize: "3rem", color: "#f57c00", marginBottom: "1rem" }}
          />
          <Title order={3} style={{ marginBottom: "0.5rem" }}>
            Cannot Edit System Category
          </Title>
          <Text color="dimmed" style={{ marginBottom: "1.5rem" }}>
            The &ldquo;{UNCATEGORIZED_CATEGORY_NAME}&rdquo; category is a system
            category and cannot be edited or deleted.
          </Text>
          <Button onClick={() => router.push("/admin/categories")} leftIcon={<Icon name="arrow-left" />}>
            Back to Categories
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Edit Category"
      description="Update category details"
      headerActions={
        <Button variant="outline" onClick={() => router.back()} leftIcon={<Icon name="arrow-left" />}>
          Back
        </Button>
      }
    >
      <div className="form-container">
        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-section">
            <div className="section-header">
              <Title order={3}>
                <Icon name="folder" /> Category Information
              </Title>
              <Text className="section-description" color="dimmed">
                Update the basic details for this category. Categories help
                organize tours and blogs.
              </Text>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <TextInput
                  label="Category Name"
                  placeholder="e.g., Adventure Tours"
                  {...form.getFieldProps("name")}
                  required
                  description="The display name for this category"
                  readOnly={category?.name === UNCATEGORIZED_CATEGORY_NAME}
                  style={
                    category?.name === UNCATEGORIZED_CATEGORY_NAME
                      ? { background: "#f9fafb", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>

              <div className="form-group">
                <TextInput
                  label="Slug"
                  placeholder="e.g., adventure-tours"
                  {...form.getFieldProps("slug")}
                  required
                  description="URL-friendly version of the name"
                  readOnly={category?.name === UNCATEGORIZED_CATEGORY_NAME}
                  style={
                    category?.name === UNCATEGORIZED_CATEGORY_NAME
                      ? { background: "#f9fafb", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1.5rem" }}>
              <Textarea
                label="Description"
                placeholder="Optional description for this category"
                {...form.getFieldProps("description")}
                rows={4}
                description="Optional description that helps identify this category"
              />
            </div>
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
                loading={updateCategoryMutation.isPending}
                leftIcon={
                  !updateCategoryMutation.isPending ? (
                    <Icon name="check-lg" />
                  ) : undefined
                }
                disabled={
                  !form.values.name ||
                  !form.values.slug ||
                  !!form.errors.name ||
                  !!form.errors.slug ||
                  updateCategoryMutation.isPending
                }
              >
                {updateCategoryMutation.isPending
                  ? "Updating..."
                  : "Update Category"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditCategory;
