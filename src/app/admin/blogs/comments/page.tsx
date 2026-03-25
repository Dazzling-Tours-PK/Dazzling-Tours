"use client";
import React, { useState } from "react";
import {
  useGetComments,
  useUpdateComment,
  useDeleteComment,
  useBulkUpdateComments,
} from "@/lib/hooks";
import {
  Page,
  Stack,
  Group,
  Table,
  Button,
  Badge,
  ConfirmModal,
  Title,
  Text,
  Icon,
} from "@/app/Components/Common";
import { TextInput, Select } from "@/app/Components/Form";

const CommentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
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

  const { data: commentsData, isLoading: loading } = useGetComments();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const bulkUpdateCommentsMutation = useBulkUpdateComments();

  const comments = commentsData?.data || [];

  const updateCommentStatus = (id: string, status: string) => {
    updateCommentMutation.mutate({
      _id: id,
      status,
    });
  };

  const deleteComment = (id: string) => {
    setConfirmModalConfig({
      opened: true,
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment and all its replies? This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteCommentMutation.mutate(id, {
          onSuccess: () => {
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
          onError: () => setConfirmModalConfig((prev) => ({ ...prev, opened: false }))
        });
      },
      loading: deleteCommentMutation.isPending,
    });
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedComments.length === 0) {
      alert("Please select comments to update");
      return;
    }

    bulkUpdateCommentsMutation.mutate(
      {
        ids: selectedComments,
        action: "updateStatus",
        data: { status },
      },
      {
        onSuccess: () => {
          setSelectedComments([]);
        },
      },
    );
  };

  const bulkDelete = () => {
    if (selectedComments.length === 0) {
      alert("Please select comments to delete");
      return;
    }

    setConfirmModalConfig({
      opened: true,
      title: "Delete Multiple Comments",
      message: `Are you sure you want to delete ${selectedComments.length} selected comments and their replies? This action cannot be undone.`,
      confirmLabel: `Delete ${selectedComments.length} Items`,
      onConfirm: () => {
        bulkUpdateCommentsMutation.mutate(
          {
            ids: selectedComments,
            action: "delete",
          },
          {
            onSuccess: () => {
              setSelectedComments([]);
              setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
            },
            onError: () => setConfirmModalConfig((prev) => ({ ...prev, opened: false }))
          },
        );
      },
      loading: bulkUpdateCommentsMutation.isPending,
    });
  };

  const toggleCommentSelection = (id: string) => {
    setSelectedComments((prev) =>
      prev.includes(id)
        ? prev.filter((commentId) => commentId !== id)
        : [...prev, id],
    );
  };

  const selectAllComments = () => {
    const filteredCommentIds = filteredComments.map((comment) => comment._id);
    setSelectedComments(
      selectedComments.length === filteredCommentIds.length
        ? []
        : filteredCommentIds,
    );
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.blogId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || comment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "status-badge success";
      case "Pending":
        return "status-badge warning";
      case "Rejected":
        return "status-badge danger";
      default:
        return "status-badge secondary";
    }
  };

  return (
    <Page
      title="Comments Management"
      description="Moderate and manage blog comments across your site"
      loading={loading}
      headerActions={
        <Group>
          <Button
            onClick={() => bulkUpdateStatus("Approved")}
            color="success"
            disabled={selectedComments.length === 0}
            size="sm"
          >
            <Icon name="check-circle" /> Approve Selected
          </Button>
          <Button
            onClick={() => bulkUpdateStatus("Rejected")}
            color="warning"
            disabled={selectedComments.length === 0}
            size="sm"
          >
            <Icon name="x-circle" /> Reject Selected
          </Button>
          <Button
            onClick={bulkDelete}
            color="error"
            disabled={selectedComments.length === 0}
            size="sm"
          >
            <Icon name="trash" /> Delete Selected
          </Button>
        </Group>
      }
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <Icon name="chat-left-text" color="#1976d2" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Total Comments
              </Title>
              <Text weight={700} size="lg">
                {comments.length}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <Icon name="clock" color="#f57c00" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Pending
              </Title>
              <Text weight={700} size="lg">
                {comments.filter((c) => c.status === "Pending").length}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <Icon name="check-circle" color="#388e3c" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Approved
              </Title>
              <Text weight={700} size="lg">
                {comments.filter((c) => c.status === "Approved").length}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#ffebee" }}>
              <Icon name="x-circle" color="#d32f2f" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Rejected
              </Title>
              <Text weight={700} size="lg">
                {comments.filter((c) => c.status === "Rejected").length}
              </Text>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            leftIcon={<Icon name="search" />}
            style={{ flex: 1 }}
          />
          <Select
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            data={[
              { value: "all", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
            ]}
            style={{ minWidth: "200px" }}
          />
        </Group>

        <Table verticalSpacing="sm" horizontalSpacing="md">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedComments.length === filteredComments.length &&
                    filteredComments.length > 0
                  }
                  onChange={selectAllComments}
                />
              </th>
              <th>Comment</th>
              <th>Blog Post</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment) => (
              <tr key={comment._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment._id)}
                    onChange={() => toggleCommentSelection(comment._id)}
                  />
                </td>
                <td>
                  <div className="comment-content">
                    <Text className="comment-text">{comment.content}</Text>
                    {comment.parentId && (
                      <div className="reply-indicator">
                        <Icon name="reply" /> Reply to: {comment.parentId}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="blog-info">
                    <Text weight={700} size="sm">
                      {comment.blogId}
                    </Text>
                  </div>
                </td>
                <td>
                  <div className="author-info">
                    <Text weight={700} size="sm">
                      {comment.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {comment.email}
                    </Text>
                    {comment.website && (
                      <Text size="xs" color="dimmed">
                        <a
                          href={comment.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {comment.website}
                        </a>
                      </Text>
                    )}
                  </div>
                </td>
                <td>
                  <Badge
                    variant="filled"
                    color={
                      comment.status === "Approved"
                        ? "success"
                        : comment.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {comment.status}
                  </Badge>
                </td>
                <td>
                  <div className="date-info">
                    {new Date(comment.createdAt).toLocaleDateString()}
                    <br />
                    <small>
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                </td>
                <td>
                  <Group spacing={8} style={{ justifyContent: "flex-end" }}>
                    {comment.status !== "Approved" && (
                      <Button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Approved")
                        }
                        variant="outline"
                        color="success"
                        size="xs"
                        title="Approve"
                      >
                        <Icon name="check-lg" />
                      </Button>
                    )}
                    {comment.status !== "Rejected" && (
                      <Button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Rejected")
                        }
                        variant="outline"
                        color="warning"
                        size="xs"
                        title="Reject"
                      >
                        <Icon name="x-lg" />
                      </Button>
                    )}
                    {comment.status !== "Pending" && (
                      <Button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Pending")
                        }
                        variant="outline"
                        color="secondary"
                        size="xs"
                        title="Set Pending"
                      >
                        <Icon name="clock" />
                      </Button>
                    )}
                      <Button
                        onClick={() => deleteComment(comment._id)}
                        variant="outline"
                        color="error"
                        size="xs"
                        title="Delete"
                      >
                        <Icon name="trash" />
                      </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filteredComments.length === 0 && (
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <Icon
              name="chat-left-text"
              size={48}
              color="dimmed"
              style={{ marginBottom: "1rem" }}
            />
            <Text>No comments found</Text>
          </div>
        )}
      </Stack>

      <ConfirmModal
        opened={confirmModalConfig.opened}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, opened: false }))}
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

export default CommentsList;
