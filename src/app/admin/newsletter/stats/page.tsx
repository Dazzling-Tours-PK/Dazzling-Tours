"use client";
import React from "react";
import { useGetNewsletterStats } from "@/lib/hooks";
import { Page, Stack } from "@/app/Components/Common";

const NewsletterStats = () => {
  const { data: statsData, isLoading: loading } = useGetNewsletterStats();

  const stats = statsData?.data;

  return (
    <Page
      title="Newsletter Statistics"
      description="View detailed statistics about newsletter subscriptions"
      loading={loading}
    >
      {stats && (
        <Stack>
          {/* Overview Cards */}
          <div className="stats-grid" style={{ marginBottom: "2rem" }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#e3f2fd" }}>
                <i className="bi bi-envelope" style={{ color: "#1976d2" }}></i>
              </div>
              <div className="stat-content">
                <h4>Total Subscribers</h4>
                <p>{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#e8f5e9" }}>
                <i
                  className="bi bi-check-circle"
                  style={{ color: "#388e3c" }}
                ></i>
              </div>
              <div className="stat-content">
                <h4>Active Subscriptions</h4>
                <p>{stats.active}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#f3e5f5" }}>
                <i className="bi bi-x-circle" style={{ color: "#7b1fa2" }}></i>
              </div>
              <div className="stat-content">
                <h4>Unsubscribed</h4>
                <p>{stats.unsubscribed}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fff3e0" }}>
                <i className="bi bi-clock" style={{ color: "#f57c00" }}></i>
              </div>
              <div className="stat-content">
                <h4>Recent (7 Days)</h4>
                <p>{stats.recentSubscriptions}</p>
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
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
                marginBottom: "1.5rem",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Monthly Subscription Trends
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #e5e7eb",
                      textAlign: "left",
                    }}
                  >
                    <th
                      style={{
                        padding: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Month
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Subscriptions
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Visual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthlyTrends.map((trend, index) => {
                    const maxCount = Math.max(
                      ...stats.monthlyTrends.map((t) => t.count)
                    );
                    const percentage =
                      maxCount > 0 ? (trend.count / maxCount) * 100 : 0;

                    return (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #f3f4f6",
                        }}
                      >
                        <td style={{ padding: "0.75rem" }}>{trend.month}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                          {trend.count}
                        </td>
                        <td style={{ padding: "0.75rem", width: "200px" }}>
                          <div
                            style={{
                              background: "#e5e7eb",
                              borderRadius: "4px",
                              height: "24px",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                background: "#1976d2",
                                height: "100%",
                                width: `${percentage}%`,
                                borderRadius: "4px",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Stack>
      )}
    </Page>
  );
};

export default NewsletterStats;
