// Root Layout Component - Main Application Layout
// Provides global styling, fonts, context providers, and persistent UI elements
import { Geist, Geist_Mono } from "next/font/google";
import Navbar, { MobileMenu } from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import AuthProvider from "@/shared/components/AuthProvider";
import { Toaster } from "sonner";
import "./styles/globals.css";

// Font configurations for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata for the application
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "HimaNest - Find Properties. Find Your Place.",
  description: "Discover properties across India. Buy, rent, or sell homes, flats, plots, commercial spaces, and more on HimaNest.",
  keywords: "real estate, property, property listings, buy property, rent property, sell property, homes for sale, flats for rent, plots for sale, commercial property, property dealers, Indian real estate",
  icons: {
    icon: "/logos/himalayan-white.png",
    apple: "/logos/himalayan-white.png",
    shortcut: "/logos/himalayan-white.png",
  },
  openGraph: {
    title: "HimaNest - Find Properties. Find Your Place.",
    description: "Discover, compare, and connect with properties across India. Buy, rent, or sell homes, flats, plots, and commercial spaces.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "HimaNest",
    images: [{ url: "/logos/himalayan-white.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "HimaNest - Find Properties. Find Your Place.",
    description: "Discover, compare, and connect with properties across India.",
    images: ["/logos/himalayan-white.png"],
  },
};

// Root layout that wraps all pages
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-0`}
      >
        <AuthProvider>
          {/* Persistent navigation header */}
          <Navbar />

          {/* Main content area with bottom padding for mobile menu */}
          <main>
            {children}
          </main>

          {/* Mobile-only bottom navigation */}
          <MobileMenu />

          {/* Site footer */}
          <Footer />

          {/* Global loading indicator */}
          <LoadingSpinner />

          {/* Global toast notifications */}
          <Toaster position="bottom-left" richColors />

        </AuthProvider>
      </body>
    </html>
  );
}
