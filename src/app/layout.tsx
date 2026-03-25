import { Manrope, Work_Sans, Kalam } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
import "./globals.css";
import ConditionalLayout from "./Components/Common/ConditionalLayout";
import { QueryProvider } from "./Components/Common/QueryProvider";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--body-color-font",
  display: "swap",
});

const work_sans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--body-color-font",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--heading-font",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Dazzling Tours - Explore the nature",
  description: "Dazzling Tours - Explore the nature",
  openGraph: {
    title: "Dazzling Tours - Explore the nature",
    description: "Dazzling Tours - Explore the nature",
  },
  icons: {
    icon: [
      { url: "/favicon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png?v=2" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Dazzling Tours" />
        <meta name="apple-mobile-web-app-title" content="Dazzling Tours" />
      </head>
      <body
        className={`${manrope.variable} ${work_sans.variable} ${kalam.variable}`}
        suppressHydrationWarning
      >
        <NotificationProvider>
          <QueryProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </QueryProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
