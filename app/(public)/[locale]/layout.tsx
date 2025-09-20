import { hasLocale, NextIntlClientProvider } from "next-intl";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "YourApp",
  description: "A crisp Next.js + Tailwind starter",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <main id="main" className="min-h-dvh flex flex-col bg-surface-1">
      <NextIntlClientProvider>
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </NextIntlClientProvider>
    </main>
  );
}
