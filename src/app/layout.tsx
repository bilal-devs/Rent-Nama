import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Rent Nama — Rental Management Portal",
    template: "%s | Rent Nama",
  },
  description:
    "A modern rental management portal for landlords and tenants. Manage properties, contracts, rent schedules, payments, and analytics in one place.",
  keywords: ["rent", "property management", "landlord", "tenant", "rental portal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans min-h-full flex flex-col antialiased bg-background text-on-background`}
      >
        {children}
      </body>
    </html>
  );
}
