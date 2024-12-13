import type { Metadata } from "next";
import "./globals.css";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";

export const metadata: Metadata = {
  title: "My App",
  description: "A sample Next.js app with a persistent left navigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='flex bg-white min-h-screen'>
        {/* Left Navigation */}
        <LeftNavigation />

        {/* Page Content */}
        <main className='flex-grow p-4'>{children}</main>
      </body>
    </html>
  );
}
