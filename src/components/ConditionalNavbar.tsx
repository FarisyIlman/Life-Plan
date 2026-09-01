"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return <PublicNavbar />;
}
