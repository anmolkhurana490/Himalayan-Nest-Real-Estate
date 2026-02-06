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
  title: "Himalayan Nest - Your Trusted Real Estate Partner",
  description: "Find your perfect property in Uttarakhand. Buy, rent, or list properties in Roorkee, Haridwar, Dehradun, Rishikesh and nearby areas.",
  keywords: "real estate, property, Uttarakhand, Roorkee, Haridwar, Dehradun, Rishikesh, buy property, rent property, property listing",
  icons: {
    icon: "/logos/himalayan-white.png",
    apple: "/logos/himalayan-white.png",
    shortcut: "/logos/himalayan-white.png",
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
