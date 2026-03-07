"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Notification,
  NotificationContextType,
} from "@/lib/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  limit?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  limit = 5,
  position = "top-right",
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const showNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        duration: 2000,
        autoClose: true,
        ...notification,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, limit);
      });

      // Auto close if enabled
      if (newNotification.autoClose && newNotification.duration) {
        setTimeout(() => {
          hideNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [generateId, limit, hideNotification],
  );

  const updateNotification = useCallback(
    (id: string, updates: Partial<Notification>) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, ...updates }
            : notification,
        ),
      );
    },
    [],
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Global error handler for TanStack Query
  const handleGlobalError = useCallback(
    (error: Error) => {
      showNotification({
        type: "error",
        title: "Error",
        message: error.message || "An unexpected error occurred",
        duration: 2000,
      });
    },
    [showNotification],
  );

  const value: NotificationContextType = {
    notifications,
    showNotification,
    hideNotification,
    updateNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      <GlobalErrorHandler onError={handleGlobalError} />
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  );
};

interface GlobalErrorHandlerProps {
  onError: (error: Error) => void;
}

const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ onError }) => {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      onError(error);
    };

    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      onError(error);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
      window.removeEventListener("error", handleError);
    };
  }, [onError]);

  return null;
};

interface NotificationContainerProps {
  position: string;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  position,
}) => {
  const { notifications, hideNotification } = useNotifications();

  const getPositionStyle = (pos: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: 16,
      pointerEvents: "none",
      width: "300px",
    };

    switch (pos) {
      case "top-right":
        return { ...base, top: 16, right: 16 };
      case "top-left":
        return { ...base, top: 16, left: 16 };
      case "bottom-right":
        return { ...base, bottom: 16, right: 16 };
      case "bottom-left":
        return { ...base, bottom: 16, left: 16 };
      case "top-center":
        return {
          ...base,
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
        } as React.CSSProperties;
      case "bottom-center":
        return {
          ...base,
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        } as React.CSSProperties;
      default:
        return { ...base, top: 16, right: 16 };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div style={getPositionStyle(position)}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fallback auto-close timer at the item level to ensure clearing
    if (notification.autoClose !== false && !notification.loading) {
      const timeoutMs = notification.duration ?? 2000;
      const autoTimer = setTimeout(() => {
        // Use animated close for consistency
        setIsLeaving(true);
        setTimeout(onClose, 300);
      }, timeoutMs);
      return () => clearTimeout(autoTimer);
    }
  }, [
    notification.autoClose,
    notification.duration,
    notification.loading,
    onClose,
  ]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = (type: string) => {
    // Explicit colors to avoid parent text color overriding the icon
    const colors: Record<string, string> = {
      success: "#10b981", // emerald-500
      error: "#ef4444", // red-500
      warning: "#f59e0b", // amber-500
      info: "#2563eb", // blue-600
      default: "#6b7280", // gray-500
    };

    const color = colors[type] || colors.default;

    switch (type) {
      case "success":
        return <i className="bi bi-check-circle-fill" style={{ color }}></i>;
      case "error":
        return (
          <i className="bi bi-exclamation-triangle-fill" style={{ color }}></i>
        );
      case "warning":
        return (
          <i className="bi bi-exclamation-circle-fill" style={{ color }}></i>
        );
      case "info":
        return <i className="bi bi-info-circle-fill" style={{ color }}></i>;
      default:
        return <i className="bi bi-info-circle-fill" style={{ color }}></i>;
    }
  };

  return (
    <div
      className={`pointer-events-auto max-w-sm w-full bg-white border rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      } ${getTypeStyles(notification.type)}`}
      style={{ pointerEvents: "auto" }}
    >
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {notification.loading ? (
                <div className="animate-spin">
                  <i className="bi bi-arrow-clockwise text-gray-500"></i>
                </div>
              ) : (
                getIcon(notification.type)
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {notification.title && (
                <h4
                  className="text-sm font-semibold"
                  style={{ margin: 0, marginBottom: 4 }}
                >
                  {notification.title}
                </h4>
              )}
              <p className="text-sm" style={{ margin: 0, lineHeight: 1.4 }}>
                {notification.message}
              </p>

              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                  style={{ marginTop: 8 }}
                >
                  {notification.action.label}
                </button>
              )}
            </div>
          </div>

          <div style={{ flexShrink: 0, alignSelf: "center" }}>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <i className="bi bi-x-lg text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
