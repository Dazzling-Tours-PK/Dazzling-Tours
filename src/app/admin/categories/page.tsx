"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetCategories,
  useDeleteCategory,
  useNotification,
} from "@/lib/hooks";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Checkbox } from "@/app/Components/Form";
import {
  Group,
  Stack,
  Page,
  Button,
  Table,
  ConfirmModal,
  Text,
  Icon,
} from "@/app/Components/Common";
import { getErrorMessage } from "@/lib/utils/errorHandling";

const CategoriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    opened: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    loading?: boolean;
  }>({
    opened: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { data: categoriesData, isLoading: loading } = useGetCategories({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
  });

  const deleteCategoryMutation = useDeleteCategory();
  const { showSuccess, showError } = useNotification();

  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData?.data],
  );
  const pagination = categoriesData?.pagination;

  const deleteCategory = (id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category?.name === UNCATEGORIZED_CATEGORY_NAME) {
      showError(`Cannot delete the '${UNCATEGORIZED_CATEGORY_NAME}' category`);
      return;
    }

    setConfirmModalConfig({
      opened: true,
      title: "Delete Category",
      message: `Are you sure you want to delete this category? Tours and blogs using this category will be set to '${UNCATEGORIZED_CATEGORY_NAME}'.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteCategoryMutation.mutate(id, {
          onSuccess: () => {
            showSuccess("Category deleted successfully");
            setSelectedCategories((prev) =>
              prev.filter((catId) => catId !== id),
            );
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
          onError: () =>
            setConfirmModalConfig((prev) => ({ ...prev, opened: false })),
        });
      },
      loading: deleteCategoryMutation.isPending,
    });
  };

  const toggleSelect = (id: string) => {
    const category = categories.find((cat) => cat._id === id);
    // Prevent selecting "Uncategorized"
    if (category?.name === UNCATEGORIZED_CATEGORY_NAME) {
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    // Exclude "Uncategorized" from selection
    const selectableCategories = categories.filter(
      (cat) => cat.name !== UNCATEGORIZED_CATEGORY_NAME,
    );
    const selectableIds = selectableCategories.map((cat) => cat._id);

    if (selectedCategories.length === selectableIds.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...selectableIds]);
    }
  };

  const bulkDelete = () => {
    if (selectedCategories.length === 0) return;

    // Filter out "Uncategorized" from selected categories
    const categoriesToDelete = selectedCategories.filter((id) => {
      const category = categories.find((cat) => cat._id === id);
      return category?.name !== UNCATEGORIZED_CATEGORY_NAME;
    });

    if (categoriesToDelete.length === 0) {
      showError(`Cannot delete the '${UNCATEGORIZED_CATEGORY_NAME}' category`);
      return;
    }

    setConfirmModalConfig({
      opened: true,
      title: "Delete Multiple Categories",
      message: `Are you sure you want to delete ${categoriesToDelete.length} selected category(ies)? Tours and blogs using these categories will be set to '${UNCATEGORIZED_CATEGORY_NAME}'.`,
      confirmLabel: `Delete ${categoriesToDelete.length} Items`,
      onConfirm: () => {
        Promise.all(
          categoriesToDelete.map((id) =>
            deleteCategoryMutation.mutateAsync(id),
          ),
        )
          .then(() => {
            showSuccess(
              `${categoriesToDelete.length} category(ies) deleted successfully`,
            );
            setSelectedCategories([]);
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          })
          .catch((error: unknown) => {
            showError(
              getErrorMessage(error, "Failed to delete some categories"),
            );
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          });
      },
      loading: deleteCategoryMutation.isPending,
    });
  };

  return (
    <Page
      title="Categories"
      description="Manage tour and blog categories"
      headerActions={
        <Link href="/admin/categories/add">
          <Button>
            <Icon name="plus-circle" /> Add Category
          </Button>
        </Link>
      }
      loading={loading}
    >
      <Stack>
        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            style={{ flex: 1 }}
          />
        </Group>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text size="sm" weight={500}>
              {selectedCategories.length} category(ies) selected
            </Text>
            <Group>
              <Button
                variant="outline"
                onClick={() => setSelectedCategories([])}
              >
                Clear Selection
              </Button>
              <Button variant="filled" color="error" onClick={bulkDelete}>
                <Icon name="trash" /> Delete Selected
              </Button>
            </Group>
          </div>
        )}

        {/* Table */}
        {categories.length > 0 ? (
          <>
            <Table verticalSpacing="sm" horizontalSpacing="md">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <Checkbox
                      checked={
                        categories.filter(
                          (cat) => cat.name !== UNCATEGORIZED_CATEGORY_NAME,
                        ).length > 0 &&
                        selectedCategories.length ===
                          categories.filter(
                            (cat) => cat.name !== UNCATEGORIZED_CATEGORY_NAME,
                          ).length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      <Checkbox
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => toggleSelect(category._id)}
                        disabled={category.name === UNCATEGORIZED_CATEGORY_NAME}
                        style={{
                          cursor:
                            category.name === UNCATEGORIZED_CATEGORY_NAME
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            category.name === UNCATEGORIZED_CATEGORY_NAME
                              ? 0.5
                              : 1,
                        }}
                      />
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                      {category.name}
                      {category.name === UNCATEGORIZED_CATEGORY_NAME && (
                        <Text
                          color="dimmed"
                          size="xs"
                          italic
                          component="span"
                          style={{ marginLeft: "0.5rem" }}
                        >
                          (System)
                        </Text>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem", color: "#6c757d" }}>
                      {category.slug}
                    </td>
                    <td style={{ padding: "0.75rem", color: "#6c757d" }}>
                      {category.description || "-"}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <Group style={{ justifyContent: "flex-end" }}>
                        {category.name !== UNCATEGORIZED_CATEGORY_NAME && (
                          <Link href={`/admin/categories/edit/${category._id}`}>
                            <Button variant="outline" size="sm">
                              <Icon name="pencil" /> Edit
                            </Button>
                          </Link>
                        )}
                        {category.name !== UNCATEGORIZED_CATEGORY_NAME && (
                          <Button
                            variant="filled"
                            color="error"
                            size="sm"
                            onClick={() => deleteCategory(category._id)}
                          >
                            <Icon name="trash" /> Delete
                          </Button>
                        )}
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                pagination={pagination}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Icon
              name="folder-x"
              size={48}
              color="#9ca3af"
              style={{ marginBottom: "1rem" }}
            />
            <Text color="dimmed" style={{ margin: 0 }}>
              {searchTerm
                ? "No categories found matching your search"
                : "No categories yet. Create your first category to get started."}
            </Text>
          </div>
        )}
      </Stack>

      <ConfirmModal
        opened={confirmModalConfig.opened}
        onClose={() =>
          setConfirmModalConfig((prev) => ({ ...prev, opened: false }))
        }
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        confirmLabel={confirmModalConfig.confirmLabel}
        color="error"
        loading={confirmModalConfig.loading}
      >
        {confirmModalConfig.message}
      </ConfirmModal>
    </Page>
  );
};

export default CategoriesList;
