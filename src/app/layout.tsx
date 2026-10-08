import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentinelOSINT | Automated Threat Intelligence Aggregator",
  description: "From Open Data to Actionable Intelligence. Automate collection, correlation and analysis of public threat intelligence in an enterprise SOC investigation workspace.",
  keywords: ["OSINT", "Threat Intelligence", "Cybersecurity", "SOC", "IOC Correlation", "Threat Hunting"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100">
        {children}
      </body>
    </html>
  );
}
