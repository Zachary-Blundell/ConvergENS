// lib/http/problem.ts
import { NextResponse } from "next/server";

export type Problem = {
  type?: string; // URI identifying the error type
  title: string; // Short, human-readable summary
  status: number; // HTTP status
  detail?: string; // Human-friendly detail
  errors?: Array<{
    // Field-level errors (e.g., from Zod)
    path: string;
    message: string;
    code?: string;
  }>;
  // You can add app-specific fields here, e.g. requestId, cause, etc.
};

export function problem(p: Problem) {
  return new NextResponse(JSON.stringify(p), {
    status: p.status,
    headers: {
      "content-type": "application/problem+json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
