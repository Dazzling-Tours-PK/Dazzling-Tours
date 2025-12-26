"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "bi bi-speedometer2",
    },
    {
      title: "Tours",
      href: "/admin/tours",
      icon: "bi bi-map",
      children: [
        { title: "All Tours", href: "/admin/tours" },
        { title: "Add Tour", href: "/admin/tours/add" },
      ],
    },
    {
      title: "Blogs",
      href: "/admin/blogs",
      icon: "bi bi-journal-text",
      children: [
        { title: "All Blogs", href: "/admin/blogs" },
        { title: "Add Blog", href: "/admin/blogs/add" },
        { title: "Comments", href: "/admin/blogs/comments" },
      ],
    },
    {
      title: "Testimonials",
      href: "/admin/testimonials",
      icon: "bi bi-chat-quote",
      children: [
        { title: "All Testimonials", href: "/admin/testimonials" },
        { title: "Add Testimonial", href: "/admin/testimonials/add" },
      ],
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: "bi bi-envelope",
      children: [
        { title: "Subscribers", href: "/admin/newsletter" },
        { title: "Statistics", href: "/admin/newsletter/stats" },
      ],
    },
    {
      title: "Campaigns",
      href: "/admin/campaigns",
      icon: "bi bi-megaphone",
      children: [
        { title: "All Campaigns", href: "/admin/campaigns" },
        { title: "Create Campaign", href: "/admin/campaigns/create" },
      ],
    },
    {
      title: "Contact",
      href: "/admin/contact",
      icon: "bi bi-telephone",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <i className={`bi bi-chevron-${isCollapsed ? "right" : "left"}`}></i>
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <i className="bi bi-person text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <i
                  className={`${item.icon} ${isCollapsed ? "text-lg" : "mr-3"}`}
                ></i>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>

              {/* Submenu */}
              {!isCollapsed && item.children && isActive(item.href) && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.title}>
                      <Link
                        href={child.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === child.href
                            ? "bg-indigo-500 text-white"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="space-y-2">
          <Link
            href="/admin/change-password"
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              pathname === "/admin/change-password"
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            title={isCollapsed ? "Change Password" : undefined}
          >
            <i className={`bi bi-key ${isCollapsed ? "text-lg" : "mr-3"}`}></i>
            {!isCollapsed && <span>Change Password</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            title={isCollapsed ? "Logout" : undefined}
          >
            <i
              className={`bi bi-box-arrow-right ${
                isCollapsed ? "text-lg" : "mr-3"
              }`}
            ></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
