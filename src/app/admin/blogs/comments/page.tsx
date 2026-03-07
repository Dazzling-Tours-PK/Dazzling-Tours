"use client";
import React, { useState } from "react";
import {
  useGetComments,
  useUpdateComment,
  useDeleteComment,
  useBulkUpdateComments,
} from "@/lib/hooks";

const CommentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

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
    if (
      confirm(
        "Are you sure you want to delete this comment and all its replies?",
      )
    ) {
      deleteCommentMutation.mutate(id);
    }
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

    if (
      confirm(
        `Are you sure you want to delete ${selectedComments.length} comments?`,
      )
    ) {
      bulkUpdateCommentsMutation.mutate(
        {
          ids: selectedComments,
          action: "delete",
        },
        {
          onSuccess: () => {
            setSelectedComments([]);
          },
        },
      );
    }
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

  if (loading) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comments-list">
      <div className="page-header">
        <h1>Comments Management</h1>
        <div className="header-actions">
          <button
            onClick={() => bulkUpdateStatus("Approved")}
            className="btn btn-success"
            disabled={selectedComments.length === 0}
          >
            <i className="bi bi-check-circle"></i> Approve Selected
          </button>
          <button
            onClick={() => bulkUpdateStatus("Rejected")}
            className="btn btn-warning"
            disabled={selectedComments.length === 0}
          >
            <i className="bi bi-x-circle"></i> Reject Selected
          </button>
          <button
            onClick={bulkDelete}
            className="btn btn-danger"
            disabled={selectedComments.length === 0}
          >
            <i className="bi bi-trash"></i> Delete Selected
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Comments Table */}
      <div className="comments-table">
        <table>
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
                    <p className="comment-text">{comment.content}</p>
                    {comment.parentId && (
                      <div className="reply-indicator">
                        <i className="bi bi-reply"></i> Reply to:{" "}
                        {comment.parentId}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="blog-info">
                    <strong>{comment.blogId}</strong>
                  </div>
                </td>
                <td>
                  <div className="author-info">
                    <strong>{comment.name}</strong>
                    <br />
                    <small>{comment.email}</small>
                    {comment.website && (
                      <>
                        <br />
                        <small>
                          <a
                            href={comment.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {comment.website}
                          </a>
                        </small>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClass(comment.status)}>
                    {comment.status}
                  </span>
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
                  <div className="action-buttons">
                    {comment.status !== "Approved" && (
                      <button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Approved")
                        }
                        className="btn btn-sm btn-outline-success"
                        title="Approve"
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    )}
                    {comment.status !== "Rejected" && (
                      <button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Rejected")
                        }
                        className="btn btn-sm btn-outline-warning"
                        title="Reject"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                    {comment.status !== "Pending" && (
                      <button
                        onClick={() =>
                          updateCommentStatus(comment._id, "Pending")
                        }
                        className="btn btn-sm btn-outline-info"
                        title="Set Pending"
                      >
                        <i className="bi bi-clock"></i>
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredComments.length === 0 && (
        <div className="no-data">
          <p>No comments found</p>
        </div>
      )}

      {/* Statistics */}
      <div className="comments-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Comments</h4>
            <p>{comments.length}</p>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <p>{comments.filter((c) => c.status === "Pending").length}</p>
          </div>
          <div className="stat-card">
            <h4>Approved</h4>
            <p>{comments.filter((c) => c.status === "Approved").length}</p>
          </div>
          <div className="stat-card">
            <h4>Rejected</h4>
            <p>{comments.filter((c) => c.status === "Rejected").length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
