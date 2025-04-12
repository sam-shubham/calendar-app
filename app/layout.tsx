import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calender App",
  description: "Developed by Sam Shubham",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
