import { Providers } from "./providers";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import {
  Space_Grotesk,
  Inter,
  Orbitron,
  Rajdhani,
  Cinzel,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-galaxy",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-racing",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-voyage",
});

export const metadata: Metadata = {
  title: "Farisy — Through The Time",
  description: "An immersive, story-driven personal Life Journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${cinzel.variable} font-body bg-bg-primary text-text-primary`}
      >
        <Providers>
          <ConditionalNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
