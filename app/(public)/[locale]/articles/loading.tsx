// app/[locale]/articles/loading.tsx
import React from 'react';

function SkeletonPill() {
  return <div className="h-10 w-44 rounded-lg bg-surface-2 shadow-s animate-pulse" />;
}

function SkeletonFilterBar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        <SkeletonPill />
        <SkeletonPill />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-28 rounded-lg bg-surface-2 shadow-s animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-surface-2 shadow-s animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonArticleCard() {
  return (
    <div className="rounded-lg bg-surface-2 shadow-m animate-pulse overflow-hidden">
      {/* image area */}
      <div className="h-40 w-full bg-surface-3" />

      {/* content */}
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-surface-3" />
        <div className="h-4 w-full rounded bg-surface-3" />
        <div className="h-4 w-11/12 rounded bg-surface-3" />

        <div className="pt-2 flex items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-surface-3" />
          <div className="h-6 w-20 rounded-full bg-surface-3" />
          <div className="h-6 w-14 rounded-full bg-surface-3" />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-surface-3" />
          <div className="h-9 w-24 rounded-md bg-surface-3" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <SkeletonArticleCard key={i} />
      ))}
    </div>
  );
}

function SkeletonPagination() {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <div className="h-10 w-24 rounded-lg bg-surface-2 shadow-s animate-pulse" />
      <div className="h-10 w-10 rounded-lg bg-surface-2 shadow-s animate-pulse" />
      <div className="h-10 w-10 rounded-lg bg-surface-2 shadow-s animate-pulse" />
      <div className="h-10 w-10 rounded-lg bg-surface-2 shadow-s animate-pulse" />
      <div className="h-10 w-24 rounded-lg bg-surface-2 shadow-s animate-pulse" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="py-5" />

      {/* FiltersBar placeholder */}
      <SkeletonFilterBar />

      {/* Cards grid placeholder */}
      <SkeletonGrid />

      {/* Pagination placeholder */}
      <SkeletonPagination />
    </main>
  );
}
