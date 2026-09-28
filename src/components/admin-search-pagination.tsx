"use client";

import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSearchAndPaginationProps {
  query: string;
  onQueryChange: (q: string) => void;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  placeholder?: string;
}

export function AdminSearchAndPagination({
  query,
  onQueryChange,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  placeholder = "Search…",
}: AdminSearchAndPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-violet/20 bg-white py-2 pl-10 pr-10 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#1e2a38] dark:text-white dark:placeholder:text-white/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-navy/40 hover:bg-mist hover:text-violet dark:hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-navy/50 dark:text-white/50">
            Showing <strong className="text-navy dark:text-white">{start}–{end}</strong> of{" "}
            <strong className="text-navy dark:text-white">{total}</strong>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet/20 text-violet transition-colors hover:bg-violet/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-navy dark:text-white">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet/20 text-violet transition-colors hover:bg-violet/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {total > 0 && total <= pageSize && (
        <p className="text-xs text-navy/50 dark:text-white/50">
          {total} record{total === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
