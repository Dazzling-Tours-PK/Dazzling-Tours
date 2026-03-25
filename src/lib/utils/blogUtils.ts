import { BlogStatus } from "@/lib/enums/blog";

/**
 * Get the CSS class for a blog status badge
 */
export const getStatusBadgeClass = (status: BlogStatus): string => {
  switch (status) {
    case BlogStatus.PUBLISHED:
      return "status-published";
    case BlogStatus.DRAFT:
      return "status-draft";
    default:
      return "status-default";
  }
};

/**
 * Get a consistent badge color for a blog category based on its name
 */
export const getCategoryBadgeColor = (
  category: string,
): "primary" | "secondary" | "success" | "warning" | "error" | "blue" => {
  const colors: (
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "blue"
  )[] = ["primary", "secondary", "success", "warning", "error", "blue"];

  const hash = (category || "").split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get explicit foreground color for status button based on status
 */
export const getStatusColor = (status: BlogStatus): string => {
  return status === BlogStatus.PUBLISHED ? "#28a745" : "#ffc107";
};
