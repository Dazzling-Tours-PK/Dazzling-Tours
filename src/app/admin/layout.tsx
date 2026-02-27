"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/contexts/AuthContext";
import "./styles/admin-theme.css";
import "./admin.css";
import Image from "next/image";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/admin/login");
      } else if (isAuthenticated && pathname === "/admin/login") {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page for unauthenticated users on protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show children for authenticated users or public routes
  return <>{children}</>;
};

// Main admin layout using CSS classes from admin.css
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  // Public routes that don't need sidebar
  const publicRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "bi bi-speedometer2" },
    { href: "/admin/categories", label: "Categories", icon: "bi bi-folder" },
    { href: "/admin/tours", label: "Tours", icon: "bi bi-map" },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      icon: "bi bi-chat-quote",
    },
    { href: "/admin/blogs", label: "Blogs", icon: "bi bi-journal-text" },

    { href: "/admin/contact", label: "Contact", icon: "bi bi-telephone" },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Image
            src="/assets/img/logo dazzling/Dazzling Tours Png.png"
            alt="Dazzling Tours"
            width={80}
            height={80}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          />
          <h3 style={{ color: "white" }}>Dazzling Tours</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  <i className={item.icon} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <HeaderBar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

// Header bar with user menu
const HeaderBar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/admin/login");
  };

  return (
    <header className="admin-header" style={{ position: "relative" }}>
      <div>
        <h1 className="admin-title">Admin Management Panel</h1>
        {/* <p className="admin-subtitle">Management Portal</p> */}
      </div>

      <div style={{ marginLeft: "auto", position: "relative" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="admin-btn admin-btn-secondary"
          style={{ width: "auto", padding: "0.4rem 0.75rem" }}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <i className="bi bi-person" style={{ marginRight: 8 }}></i>
          <span style={{ fontWeight: 600 }}>{user?.email || "User"}</span>
          <i
            className="bi bi-caret-down-fill"
            style={{ marginLeft: 8, fontSize: 10 }}
          ></i>
        </button>

        {open && (
          <div
            role="menu"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              minWidth: 200,
              zIndex: 100,
              padding: 8,
            }}
          >
            <div
              style={{ padding: "8px 10px", fontSize: 12, color: "#6b7280" }}
            >
              Signed in as
              <div style={{ fontWeight: 600, color: "#111827" }}>
                {user?.email || "User"}
              </div>
            </div>
            <div
              style={{ height: 1, background: "#e5e7eb", margin: "4px 0" }}
            ></div>
            <Link
              href="/admin/change-password"
              className="admin-nav-item"
              onClick={() => setOpen(false)}
              role="menuitem"
              style={{ display: "block" }}
            >
              <i className="bi bi-gear" style={{ marginRight: 8 }}></i>
              User Settings
            </Link>
            <button
              onClick={handleLogout}
              className="admin-btn admin-btn-link"
              role="menuitem"
              style={{ display: "block", width: "100%", textAlign: "left" }}
            >
              <i
                className="bi bi-box-arrow-right"
                style={{ marginRight: 8 }}
              ></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// Root admin layout with providers
const RootAdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayout>{children}</AdminLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default RootAdminLayout;
