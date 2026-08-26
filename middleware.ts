import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  if (req.method === "POST") {

    return new NextResponse("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET, HEAD, OPTIONS",
      },
    });
  }

  return intlMiddleware(req);
}

export const config = {
  matcher:
    "/((?!api|_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml|admin|dashboard|login|reset).*)",
};
