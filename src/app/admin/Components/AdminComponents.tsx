import React from "react";
import "../styles/admin-theme.css";

// Admin Layout Components
export interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-container ${className}`}>{children}</div>;
};

export interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-card ${className}`}>{children}</div>;
};

export interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`admin-header ${className}`}>
      <h1 className="admin-title">{title}</h1>
      {subtitle && <p className="admin-subtitle">{subtitle}</p>}
    </div>
  );
};

// Admin Form Components
export interface AdminFormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminFormGroup: React.FC<AdminFormGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-form-group ${className}`}>{children}</div>;
};

export interface AdminFormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const AdminFormLabel: React.FC<AdminFormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = "",
}) => {
  return (
    <label htmlFor={htmlFor} className={`admin-form-label ${className}`}>
      {children}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
  );
};

export interface AdminFormControlProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  successMessage?: string;
  size?: "sm" | "md" | "lg";
}

export const AdminFormControl: React.FC<AdminFormControlProps> = ({
  error = false,
  errorMessage,
  success = false,
  successMessage,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClass = size === "lg" ? "admin-form-control-lg" : "";
  const errorClass = error ? "error" : "";
  const successClass = success ? "success" : "";

  return (
    <div>
      <input
        className={`admin-form-control ${sizeClass} ${errorClass} ${successClass} ${className}`}
        {...props}
      />
      {error && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      {success && successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

// Admin Button Components
export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const variantClass = `admin-btn-${variant}`;
  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "";
  const widthClass = fullWidth ? "w-100" : "";
  const loadingClass = isLoading ? "admin-loading" : "";

  return (
    <button
      className={`admin-btn ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && loadingText ? (
        <>
          <span className="admin-spinner me-2"></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Admin Alert Components
export interface AdminAlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export const AdminAlert: React.FC<AdminAlertProps> = ({
  type,
  message,
  className = "",
}) => {
  const typeClass = `admin-alert-${type}`;

  return (
    <div className={`admin-alert ${typeClass} ${className}`} role="alert">
      {message}
    </div>
  );
};

// Admin Navigation Components
export interface AdminNavProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminNav: React.FC<AdminNavProps> = ({
  children,
  className = "",
}) => {
  return <nav className={`admin-nav ${className}`}>{children}</nav>;
};

export interface AdminNavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({
  href,
  children,
  active = false,
  className = "",
}) => {
  const activeClass = active ? "active" : "";

  return (
    <a href={href} className={`admin-nav-item ${activeClass} ${className}`}>
      {children}
    </a>
  );
};

// Admin Sidebar Components
export interface AdminSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  children,
  className = "",
}) => {
  return <aside className={`admin-sidebar ${className}`}>{children}</aside>;
};

export interface AdminSidebarItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const AdminSidebarItem: React.FC<AdminSidebarItemProps> = ({
  href,
  children,
  active = false,
  className = "",
}) => {
  const activeClass = active ? "active" : "";

  return (
    <a href={href} className={`admin-sidebar-item ${activeClass} ${className}`}>
      {children}
    </a>
  );
};

// Admin Table Components
export interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  children,
  className = "",
}) => {
  return <table className={`admin-table ${className}`}>{children}</table>;
};

// Admin Modal Components
export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className={`admin-modal ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export interface AdminModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminModalHeader: React.FC<AdminModalHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-modal-header ${className}`}>{children}</div>;
};

export interface AdminModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminModalBody: React.FC<AdminModalBodyProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-modal-body ${className}`}>{children}</div>;
};

export interface AdminModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminModalFooter: React.FC<AdminModalFooterProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-modal-footer ${className}`}>{children}</div>;
};
