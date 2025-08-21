import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AssociationRows, { Association } from "../components/AssoRow";
import { ThemeProvider } from "next-themes";

const associations: Association[] = [
  {
    name: "ACME Labs",
    href: "/associations/acme",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Open Data",
    href: "/associations/open-data",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Tech Innovators",
    href: "/associations/tech-innovators",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Green Future",
    href: "/associations/green-future",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Health Connect",
    href: "/associations/health-connect",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Creative Minds",
    href: "/associations/creative-minds",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Global Education Network",
    href: "/associations/global-education",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Sustainable Solutions",
    href: "/associations/sustainable-solutions",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Digital Arts Collective",
    href: "/associations/digital-arts",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Future Tech Alliance",
    href: "/associations/future-tech",
    logoSrc: "/placeholder.png",
  },
  {
    name: "ACME Labs",
    href: "/associations/acme",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Open Data",
    href: "/associations/open-data",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Tech Innovators",
    href: "/associations/tech-innovators",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Green Future",
    href: "/associations/green-future",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Health Connect",
    href: "/associations/health-connect",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Creative Minds",
    href: "/associations/creative-minds",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Global Education Network",
    href: "/associations/global-education",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Sustainable Solutions",
    href: "/associations/sustainable-solutions",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Digital Arts Collective",
    href: "/associations/digital-arts",
    logoSrc: "/placeholder.png",
  },
  {
    name: "Future Tech Alliance",
    href: "/associations/future-tech",
    logoSrc: "/placeholder.png",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="system"
      >
        <body className="min-h-dvh flex flex-col align-center bg-white  text-gray-900 dark:bg-black dark:text-gray-200 antialiased">
          <Header />
          <AssociationRows items={associations} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
