import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YourApp",
  description: "A crisp Next.js + Tailwind starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-white text-gray-900 antialiased">
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
