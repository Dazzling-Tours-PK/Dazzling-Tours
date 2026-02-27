"use client";
import React from "react";
import Link from "next/link";
import { useGetDashboardStats } from "@/lib/hooks";
import { Page, Stack } from "@/app/Components/Common";

const AdminDashboard = () => {
  const { data: statsData, isLoading: loading } = useGetDashboardStats();
  const stats = statsData?.data;

  const statCards = stats
    ? [
        {
          title: "Total Tours",
          value: stats.tours.total,
          subtitle: `${stats.tours.published} Published`,
          icon: "bi bi-map",
          color: "primary",
          link: "/admin/tours",
        },
        {
          title: "Total Blogs",
          value: stats.blogs.total,
          subtitle: `${stats.blogs.published} Published`,
          icon: "bi bi-journal-text",
          color: "info",
          link: "/admin/blogs",
        },
        {
          title: "Contact Queries",
          value: stats.contacts.total,
          subtitle: `${stats.contacts.new} New`,
          icon: "bi bi-envelope",
          color: "warning",
          link: "/admin/contact",
        },

        {
          title: "Testimonials",
          value: stats.testimonials.total,
          subtitle: `${stats.testimonials.published} Published`,
          icon: "bi bi-chat-quote",
          color: "purple",
          link: "/admin/testimonials",
        },
      ]
    : [];

  return (
    <Page
      title="Dashboard"
      description="Welcome to Dazzling Tours CMS - Overview of your content and activities"
      loading={loading}
    >
      <Stack>
        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="stat-card" style={{ cursor: "pointer" }}>
                <div
                  className="stat-icon"
                  style={{
                    background:
                      stat.color === "primary"
                        ? "#e3f2fd"
                        : stat.color === "info"
                          ? "#e1f5fe"
                          : stat.color === "warning"
                            ? "#fff3e0"
                            : stat.color === "success"
                              ? "#e8f5e9"
                              : stat.color === "secondary"
                                ? "#f3e5f5"
                                : "#fce4ec",
                  }}
                >
                  <i
                    className={stat.icon}
                    style={{
                      color:
                        stat.color === "primary"
                          ? "#1976d2"
                          : stat.color === "info"
                            ? "#0288d1"
                            : stat.color === "warning"
                              ? "#f57c00"
                              : stat.color === "success"
                                ? "#388e3c"
                                : stat.color === "secondary"
                                  ? "#7b1fa2"
                                  : "#c2185b",
                    }}
                  ></i>
                </div>
                <div className="stat-content">
                  <h4>{stat.title}</h4>
                  <p
                    style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}
                  >
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6c757d",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "1rem",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Quick Actions
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin/tours/add"
              className="btn btn-primary"
              style={{
                flex: "1 1 auto",
                minWidth: "200px",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-plus-circle"></i> Add New Tour
            </Link>
            <Link
              href="/admin/blogs/add"
              className="btn btn-success"
              style={{
                flex: "1 1 auto",
                minWidth: "200px",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-plus-circle"></i> Add New Blog
            </Link>

            <Link
              href="/admin/contact"
              className="btn btn-warning"
              style={{
                flex: "1 1 auto",
                minWidth: "200px",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-envelope"></i> Contact Queries
            </Link>
          </div>
        </div>
      </Stack>
    </Page>
  );
};

export default AdminDashboard;
