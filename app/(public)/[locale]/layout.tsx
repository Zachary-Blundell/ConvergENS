import { hasLocale, NextIntlClientProvider } from "next-intl";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "YourApp",
  description: "A crisp Next.js + Tailwind starter",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  console.log("Locale:", locale);
  console.log("Locales in routing:", routing.locales);
  return (
    <main id="main" className="flex-1">
      <NextIntlClientProvider>
        <NavBar />
        {children}
      </NextIntlClientProvider>
    </main>
  );
}
