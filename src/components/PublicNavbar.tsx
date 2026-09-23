"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setSolid(currentScrollY > 40);

      if (currentScrollY < 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const eraSlugMatch = pathname.match(/^\/timeline\/([^/]+)/);
  const currentEraSlug = eraSlugMatch ? eraSlugMatch[1] : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible || menuOpen ? "translate-y-0" : "-translate-y-full"
      } ${
        solid || menuOpen
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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`text-sm hover:text-accent transition ${
              pathname === "/" ? "text-accent" : "text-text-muted"
            }`}
          >
            Home
          </Link>
          <Link
            href="/timeline"
            aria-current={pathname.startsWith("/timeline") ? "page" : undefined}
            className={`text-sm hover:text-accent transition ${
              pathname.startsWith("/timeline")
                ? "text-accent"
                : "text-text-muted"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/calendar"
            aria-current={pathname === "/calendar" ? "page" : undefined}
            className={`text-sm hover:text-accent transition ${
              pathname === "/calendar" ? "text-accent" : "text-text-muted"
            }`}
          >
            Calendar
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-text-primary"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="public-mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="public-mobile-menu"
          className="md:hidden px-6 pb-4 flex flex-col gap-4 border-t border-border"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/" ? "page" : undefined}
            className={`text-sm pt-4 ${
              pathname === "/" ? "text-accent" : "text-text-muted"
            }`}
          >
            Home
          </Link>
          <Link
            href="/timeline"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname.startsWith("/timeline") ? "page" : undefined}
            className={`text-sm ${
              pathname.startsWith("/timeline")
                ? "text-accent"
                : "text-text-muted"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/calendar"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/calendar" ? "page" : undefined}
            className={`text-sm ${
              pathname === "/calendar" ? "text-accent" : "text-text-muted"
            }`}
          >
            Calendar
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === "/about" ? "page" : undefined}
            className={`text-sm ${
              pathname === "/about" ? "text-accent" : "text-text-muted"
            }`}
          >
            About
          </Link>
          {currentEraSlug && (
            <span className="text-xs font-heading text-galaxy-gold border border-galaxy-gold/30 rounded-full px-3 py-1 self-start">
              {currentEraSlug}
            </span>
          )}
        </div>
      )}
    </nav>
  );
}
