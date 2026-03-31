"use client";
import React, { useState, useMemo } from "react";
import {
  useGetComments,
  useUpdateComment,
  useDeleteComment,
  useBulkUpdateComments,
  useNotification,
} from "@/lib/hooks";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select, Checkbox } from "@/app/Components/Form";
import {
  Group,
  Stack,
  Page,
  Button,
  ActionIcon,
  Text,
  ConfirmModal,
  Table,
  Icon,
  Badge,
} from "@/app/Components/Common";
import { CommentStatus, getCommentStatuses } from "@/lib/types/enums";

const CommentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    opened: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    loading?: boolean;
    color?: string;
  }>({
    opened: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { data: commentsData, isLoading: loading } = useGetComments({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchTerm || undefined,
  });

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const bulkUpdateCommentMutation = useBulkUpdateComments();
  const { showSuccess, showError } = useNotification();

  const comments = useMemo(
    () => commentsData?.data || [],
    [commentsData?.data],
  );
  const pagination = commentsData?.pagination;

  const handleDeleteComment = (id: string) => {
    setConfirmModalConfig({
      opened: true,
      title: "Delete Comment",
      message:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      confirmLabel: "Delete",
      color: "error",
      onConfirm: () => {
        deleteCommentMutation.mutate(id, {
          onSuccess: () => {
            showSuccess("Comment deleted successfully!");
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
          onError: (error) => {
            showError(error.message || "Failed to delete comment");
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
        });
      },
      loading: deleteCommentMutation.isPending,
    });
  };

  const updateStatus = (id: string, newStatus: string) => {
    updateCommentMutation.mutate(
      {
        _id: id,
        status: newStatus as CommentStatus,
      },
      {
        onSuccess: () => {
          showSuccess(`Comment marked as ${newStatus} successfully!`);
        },
        onError: (error) => {
          showError(error.message || "Failed to update comment status");
        },
      },
    );
  };

  const bulkAction = (action: string, status?: string) => {
    if (selectedComments.length === 0) {
      showError("Please select comments first");
      return;
    }

    bulkUpdateCommentMutation.mutate(
      {
        ids: selectedComments,
        action,
        data: status ? { status } : undefined,
      },
      {
        onSuccess: () => {
          showSuccess(
            `${selectedComments.length} comment(s) ${action === "delete" ? "deleted" : "updated"} successfully!`,
          );
          setSelectedComments([]);
          setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
        },
        onError: (error) => {
          showError(error.message || `Failed to perform bulk ${action}`);
        },
      },
    );
  };

  const confirmBulkDelete = () => {
    setConfirmModalConfig({
      opened: true,
      title: "Delete Multiple Comments",
      message: `Are you sure you want to delete ${selectedComments.length} selected comments? This cannot be undone.`,
      confirmLabel: "Delete Selected",
      color: "error",
      onConfirm: () => bulkAction("delete"),
      loading: bulkUpdateCommentMutation.isPending,
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedComments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((c) => c._id));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <Page
      title="Comments Management"
      description="Review and manage user comments on your blog posts"
      loading={loading}
    >
      <Stack>
        {/* Bulk Actions Bar */}
        {selectedComments.length > 0 && (
          <div
            className="bulk-actions-alert"
            style={{
              background: "rgba(253, 126, 20, 0.1)",
              border: "1px solid #fd7e14",
              borderRadius: "8px",
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Icon name="check2-circle" color="#fd7e14" />
              <Text weight={600} color="primary">
                {selectedComments.length} comments selected
              </Text>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                size="sm"
                color="success"
                onClick={() => bulkAction("approve")}
                leftIcon={<Icon name="check-lg" />}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                color="error"
                onClick={() => bulkAction("reject")}
                leftIcon={<Icon name="x-lg" />}
              >
                Reject
              </Button>
              <Button
                size="sm"
                color="error"
                onClick={confirmBulkDelete}
                leftIcon={<Icon name="trash" />}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="subtle"
                color="secondary"
                onClick={() => setSelectedComments([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search by name, email, or comment content..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Icon name="search" />}
            style={{ flex: 1, minWidth: "400px" }}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              ...getCommentStatuses(),
            ]}
            style={{ minWidth: "180px" }}
          />
        </Group>

        {/* Comments Table */}
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <Checkbox
                  checked={
                    selectedComments.length === comments.length &&
                    comments.length > 0
                  }
                  onChange={selectAll}
                />
              </th>
              <th style={{ width: "180px" }}>User</th>
              <th>Comment Content</th>
              <th style={{ width: "180px" }}>Blog Post</th>
              <th style={{ width: "150px" }}>Status</th>
              <th style={{ width: "130px" }}>Date</th>
              <th style={{ width: "100px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td>
                  <Checkbox
                    checked={selectedComments.includes(comment._id)}
                    onChange={() => toggleSelection(comment._id)}
                  />
                </td>
                <td>
                  <Stack spacing={0}>
                    <Text size="sm" weight={700}>
                      {comment.name}
                    </Text>
                    <Text
                      size="xs"
                      color="dimmed"
                      style={{ wordBreak: "break-all" }}
                    >
                      {comment.email}
                    </Text>
                  </Stack>
                </td>
                <td>
                  <Stack spacing={4}>
                    <Text size="sm" style={{ lineHeight: 1.5 }}>
                      {comment.content}
                    </Text>
                    {comment.parentId && (
                      <Badge size="xs" variant="light" color="secondary">
                        Reply to: {comment.parentId.name}
                      </Badge>
                    )}
                  </Stack>
                </td>
                <td>
                  <Text size="sm" weight={500}>
                    {comment.blogId?.title || "Unknown Blog"}
                  </Text>
                </td>
                <td>
                  <Select
                    size="sm"
                    value={comment.status}
                    onChange={(val) => updateStatus(comment._id, val)}
                    data={getCommentStatuses()}
                    style={{ minWidth: "120px" }}
                  />
                </td>
                <td>
                  <Text size="xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-muted">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Text>
                </td>
                <td style={{ textAlign: "center" }}>
                  <ActionIcon
                    color="error"
                    variant="light"
                    onClick={() => handleDeleteComment(comment._id)}
                    title="Delete Comment"
                  >
                    <Icon name="trash" />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {comments.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <Icon
              name="chat-dots"
              size={48}
              color="dimmed"
              style={{ marginBottom: "1rem" }}
            />
            <Text color="dimmed" size="lg">
              No comments found matching your criteria.
            </Text>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <PaginationComponent
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
          />
        )}

        {/* Confirm Dialog */}
        <ConfirmModal
          opened={confirmModalConfig.opened}
          onClose={() =>
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }))
          }
          onConfirm={confirmModalConfig.onConfirm}
          title={confirmModalConfig.title}
          confirmLabel={confirmModalConfig.confirmLabel}
          color={confirmModalConfig.color as never}
          loading={confirmModalConfig.loading}
        >
          {confirmModalConfig.message}
        </ConfirmModal>
      </Stack>
    </Page>
  );
};

export default CommentsManagement;
