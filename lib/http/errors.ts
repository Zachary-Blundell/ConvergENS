// lib/http/errors.ts
import { ZodError } from "zod";
import { problem } from "./problem";
import { Prisma } from "@prisma/client";

export function zodToProblem(err: ZodError) {
  const errors = err.issues.map((i) => ({
    path: i.path.join(".") || "(root)",
    message: i.message,
    code: i.code,
  }));

  return problem({
    type: "https://example.com/problems/validation",
    title: "Validation Failed",
    status: 422,
    detail: "One or more fields failed validation.",
    errors,
  });
}

// Narrow to Prisma’s “known request errors” without importing from runtime path.
function isPrismaKnownError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return !!e && typeof e === "object" && "code" in e && "meta" in e;
}

export function prismaToProblem(err: Prisma.PrismaClientKnownRequestError) {
  // Common ones: P2002 unique constraint, P2003 fk, P2025 not found, etc.
  switch (err.code) {
    case "P2002": {
      const target =
        (Array.isArray(err.meta?.target)
          ? err.meta?.target.join(", ")
          : err.meta?.target) ?? "constraint";
      return problem({
        type: "https://example.com/problems/conflict",
        title: "Conflict",
        status: 409,
        detail: `Unique constraint failed on ${target}.`,
        errors: [
          { path: String(target), message: "Already exists", code: err.code },
        ],
      });
    }
    case "P2025": {
      return problem({
        type: "https://example.com/problems/not-found",
        title: "Not Found",
        status: 404,
        detail: (err.meta?.cause as string) ?? "Record not found.",
      });
    }
    default: {
      return problem({
        type: "https://example.com/problems/prisma-error",
        title: "Database Error",
        status: 400,
        detail: `${err.code}: ${err.message}`,
      });
    }
  }
}

export function errorToProblem(err: unknown) {
  // Order matters: Zod → Prisma → generic Error → unknown
  if (err instanceof ZodError) return zodToProblem(err);
  if (isPrismaKnownError(err)) return prismaToProblem(err);
  if (err instanceof Error) {
    return problem({
      type: "about:blank",
      title: "Internal Server Error",
      status: 500,
      detail: err.message,
    });
  }
  return problem({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "Unknown error.",
  });
}
