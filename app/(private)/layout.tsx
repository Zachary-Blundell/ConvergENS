import NavBarAdmin from "@/components/NavBarAdmin";
import "@/styles/globals.css";
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
    <main id="main" className="min-h-dvh flex flex-col bg-surface-1">
      <NavBarAdmin />
      <div className="flex-1">{children}</div>
    </main>
  );
}
