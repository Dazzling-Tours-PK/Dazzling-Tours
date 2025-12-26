import { Manrope, Work_Sans, Kalam } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
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
  title: {
    absolute: "",
    default: "Dazzling Tours - Travel & Tour Agency",
    template: "%s | Dazzling Tours - Travel & Tour Agency",
  },
  description: "Dazzling Tours - Travel & Tour Agency",
  openGraph: {
    title: "Dazzling Tours - Travel & Tour Agency",
    description: "Dazzling Tours - Travel & Tour Agency",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Dazzling Tours" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
