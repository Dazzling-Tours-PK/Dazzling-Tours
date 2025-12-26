"use client";
import { usePathname } from "next/navigation";
import Header1 from "../Header/Header1";
import Footer from "../Footer/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Check if the current path is an admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  // If it's an admin route, render children without header/footer
  // The admin layout will handle its own structure
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For all other routes, render with website header and footer
  return (
    <div className="main-page-area">
      <Header1 />
      {children}
      <Footer />
    </div>
  );
};

export default ConditionalLayout;
