"use client";
import React from "react";
import Link from "next/link";
import { useGetDashboardStats } from "@/lib/hooks";
import {
  Page,
  Stack,
  Title,
  Text,
  Icon,
  Button,
} from "@/app/Components/Common";

const AdminDashboard = () => {
  const { data: statsData, isLoading: loading } = useGetDashboardStats();
  const stats = statsData?.data;

  const statCards = stats
    ? [
        {
          title: "Total Tours",
          value: stats.tours.total,
          subtitle: `${stats.tours.published} Published`,
          icon: "map",
          color: "primary",
          link: "/admin/tours",
        },
        {
          title: "Total Blogs",
          value: stats.blogs.total,
          subtitle: `${stats.blogs.published} Published`,
          icon: "journal-text",
          color: "info",
          link: "/admin/blogs",
        },
        {
          title: "Contact Queries",
          value: stats.contacts.total,
          subtitle: `${stats.contacts.new} New`,
          icon: "envelope",
          color: "warning",
          link: "/admin/contact",
        },

        {
          title: "Testimonials",
          value: stats.testimonials.total,
          subtitle: `${stats.testimonials.published} Published`,
          icon: "chat-quote",
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
                  <Icon
                    name={stat.icon as never}
                    color={
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
                                : "#c2185b"
                    }
                  />
                </div>
                <div className="stat-content">
                  <Title order={4} size="h6">
                    {stat.title}
                  </Title>
                  <Text
                    weight={700}
                    style={{ fontSize: "2rem", lineHeight: 1 }}
                  >
                    {stat.value}
                  </Text>
                  {stat.subtitle && (
                    <Text
                      size="sm"
                      color="dimmed"
                      style={{ marginTop: "0.25rem" }}
                    >
                      {stat.subtitle}
                    </Text>
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
          <Title order={3} size="h5" style={{ marginBottom: "1rem" }}>
            Quick Actions
          </Title>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/admin/tours">
              <Button
                color="primary"
                style={{ flex: "1 1 auto", minWidth: "200px" }}
              >
                <Icon name="plus-circle" /> Add New Tour
              </Button>
            </Link>
            <Link href="/admin/blogs/add">
              <Button
                color="success"
                style={{ flex: "1 1 auto", minWidth: "200px" }}
              >
                <Icon name="plus-circle" /> Add New Blog
              </Button>
            </Link>

            <Link href="/admin/contact">
              <Button
                color="warning"
                style={{ flex: "1 1 auto", minWidth: "200px" }}
              >
                <Icon name="envelope" /> Contact Queries
              </Button>
            </Link>
          </div>
        </div>
      </Stack>
    </Page>
  );
};

export default AdminDashboard;
