import { useNotifications } from "@/lib/contexts/NotificationContext";
import { useCallback } from "react";

export const useNotification = () => {
  const { showNotification, hideNotification, updateNotification, clearAll } =
    useNotifications();

  const showSuccess = useCallback(
    (
      message: string,
      options?: {
        title?: string;
        duration?: number;
        action?: { label: string; onClick: () => void };
      },
    ) => {
      return showNotification({
        type: "success",
        message,
        title: options?.title,
        duration: options?.duration,
        action: options?.action,
      });
    },
    [showNotification],
  );

  const showError = useCallback(
    (
      message: string,
      options?: {
        title?: string;
        duration?: number;
        action?: { label: string; onClick: () => void };
      },
    ) => {
      return showNotification({
        type: "error",
        message,
        title: options?.title,
        duration: options?.duration,
        action: options?.action,
      });
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (
      message: string,
      options?: {
        title?: string;
        duration?: number;
        action?: { label: string; onClick: () => void };
      },
    ) => {
      return showNotification({
        type: "warning",
        message,
        title: options?.title,
        duration: options?.duration,
        action: options?.action,
      });
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (
      message: string,
      options?: {
        title?: string;
        duration?: number;
        action?: { label: string; onClick: () => void };
      },
    ) => {
      return showNotification({
        type: "info",
        message,
        title: options?.title,
        duration: options?.duration,
        action: options?.action,
      });
    },
    [showNotification],
  );

  const showLoading = useCallback(
    (message: string, options?: { title?: string }) => {
      return showNotification({
        type: "info",
        message,
        title: options?.title,
        loading: true,
        autoClose: false,
      });
    },
    [showNotification],
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    hideNotification,
    updateNotification,
    clearAll,
  };
};
