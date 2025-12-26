import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  setMobileToggle: (value: boolean) => void;
}

export default function Nav({ setMobileToggle }: NavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/about-us",
      label: "About Us",
    },
    {
      href: "/tours",
      label: "Tours",
    },
    {
      href: "/blogs",
      label: "Blogs",
    },
    {
      href: "/contact",
      label: "Contact",
    },
  ];

  const handleLinkClick = () => {
    setMobileToggle(false);
  };

  return (
    <ul className="cs_nav_list fw-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className={isActive ? "active" : ""}
              aria-label={`${item.label}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
