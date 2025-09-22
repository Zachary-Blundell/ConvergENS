//components/Pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  perPage: number;
  count: number;
}

export default async function Pagination({
  currentPage,
  perPage,
  count,
}: PaginationProps) {
  return (
    <ul className="flex justify-between items-center text-sm mt-8">
      <li>
        {currentPage > 1 && (
          <Link
            href={{
              pathname: "/articles",
              query: {
                page: currentPage - 1,
              },
            }}
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-5 h-5" /> Previous
            </span>
          </Link>
        )}
        {currentPage <= 1 && (
          <span className="text-fg-muted flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" /> Previous
          </span>
        )}
      </li>

      {typeof count === "number" && (
        <li className="flex-grow flex justify-center">
          <ul className="flex items-center gap-3">
            {[...new Array(Math.ceil(count / perPage))].map((_, index) => {
              const page = index + 1;
              return (
                <li key={page}>
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    asChild
                    size="sm"
                    className="h-auto px-2.5 py-1"
                  >
                    <Link
                      href={{
                        pathname: "/articles",
                        query: {
                          page,
                        },
                      }}
                    >
                      {page}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </li>
      )}

      <li>
        {currentPage < Math.ceil(count / perPage) && (
          <Link
            href={{
              pathname: "/articles",
              query: {
                page: currentPage + 1,
              },
            }}
          >
            <span className="flex items-center gap-1">
              Next <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        )}
        {currentPage >= Math.ceil(count / perPage) && (
          <span className="text-fg-muted flex items-center gap-1">
            Next <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </li>
    </ul>
  );
}
