import React from "react";
import "../../styles/admin-theme.css";
import { Card, Text, Title } from "@/app/Components/Common";

// Icon Components
export interface IconProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const LockIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--primary-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--success-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export const ErrorIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--error-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Layout Components
export interface LoginCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#fdfaf8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#fd7d02] rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#026df7] rounded-full filter blur-[100px] opacity-5 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-[400px] w-full z-10 transition-all duration-500">
        <Card
          padding="md"
          variant="shadow"
          className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-orange-100/50 overflow-hidden"
        >
          <div className="p-2 sm:p-4">{children}</div>
        </Card>
      </div>
    </div>
  );
};

export interface CardHeaderProps {
  title: string;
  subtitle: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="mb-4">
        <Text
          size="xs"
          weight={900}
          italic
          transform="uppercase"
          className="tracking-tighter opacity-80"
        >
          DAZZLING<span className="text-[#fd7d02]">TOURS</span>
        </Text>
      </div>
      {icon && (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-[#fff5eb] mb-6 text-[#fd7d02] shadow-inner shadow-orange-100/50">
          {icon}
        </div>
      )}
      <Title
        order={5}
        weight={800}
        align="center"
        className="mb-1 text-gray-900"
      >
        {title}
      </Title>
      <Text
        size="xs"
        color="dimmed"
        align="center"
        weight={500}
        className="px-4"
      >
        {subtitle}
      </Text>
    </div>
  );
};
