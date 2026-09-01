"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setSolid(currentScrollY > 40);

      if (currentScrollY < 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Extract current era slug from pathname, e.g. /timeline/2026 -> "2026"
  const eraSlugMatch = pathname.match(/^\/timeline\/([^/]+)/);
  const currentEraSlug = eraSlugMatch ? eraSlugMatch[1] : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        solid
          ? "bg-bg-primary/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-lg text-text-primary hover:text-accent transition"
        >
          Farisy
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/timeline"
            className={`text-sm hover:text-accent transition ${
              pathname.startsWith("/timeline")
                ? "text-accent"
                : "text-text-muted"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/about"
            className={`text-sm hover:text-accent transition ${
              pathname === "/about" ? "text-accent" : "text-text-muted"
            }`}
          >
            About
          </Link>
          {currentEraSlug && (
            <span className="text-xs font-heading text-galaxy-gold border border-galaxy-gold/30 rounded-full px-3 py-1">
              {currentEraSlug}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
