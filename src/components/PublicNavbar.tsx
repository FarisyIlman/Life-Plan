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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const eraSlugMatch = pathname.match(/^\/timeline\/([^/]+)/);
  const currentEraSlug = eraSlugMatch ? eraSlugMatch[1] : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-text-primary"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 border-t border-border">
          <Link
            href="/timeline"
            className={`text-sm pt-4 ${
              pathname.startsWith("/timeline")
                ? "text-accent"
                : "text-text-muted"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/about"
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
