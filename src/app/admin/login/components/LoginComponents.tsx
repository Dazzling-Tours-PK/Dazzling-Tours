import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Text, Title } from "@/app/Components/Common";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";

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
    <div
      className={`min-h-screen flex items-center justify-center bg-[#fdfaf8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}
    >
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
      <div className="mb-5 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center transition-transform hover:scale-105"
          title="Back to Homepage"
        >
          <Image
            src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`}
            alt="Dazzling Tours"
            width={160}
            height={55}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>
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
