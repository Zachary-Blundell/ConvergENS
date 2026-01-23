// app/[locale]/organisations/loading.tsx
import React from 'react';

function SkeletonCard() {
  return (
    <div className="relative flex h-full flex-col rounded-lg bg-surface-2 shadow-m animate-pulse">
      {/* floating logo */}
      <div className="-mt-10 mb-2 flex justify-center sm:block sm:absolute sm:-top-2 sm:-left-6 sm:z-10">
        <div className="h-24 w-24 rounded-full bg-surface-3 ring-2 ring-outline shadow-lg" />
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-center items-center w-full">
          <div className="h-6 w-2/3 rounded bg-surface-3" />
        </div>

        <div className="my-5 space-y-2">
          <div className="h-4 w-full rounded bg-surface-3" />
          <div className="h-4 w-11/12 rounded bg-surface-3" />
          <div className="h-4 w-4/5 rounded bg-surface-3" />
        </div>

        <div className="mt-auto">
          <div className="h-11 w-40 rounded-md bg-surface-3" />
        </div>
      </div>
    </div>
  );
}

function GroupSkeleton({ }: { title: string }) {
  return (
    <section className="mt-16">
      <div className="mb-16 h-6 w-64 rounded bg-surface-3 animate-pulse" />
      <div className="sm:mx-3 grid gap-15 sm:grid-cols-2 lg:grid-cols-3 justify-center">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="container px-4 py-12 mt-10 mx-auto">
      {/* Page title */}
      <div className="mb-20 flex justify-center">
        <div className="h-12 w-2/3 max-w-xl rounded bg-surface-3 animate-pulse" />
      </div>

      {/* Section title */}
      <div className="mt-8">
        <div className="h-10 w-80 rounded bg-surface-3 animate-pulse" />
      </div>

      {/* Groups */}
      <GroupSkeleton title="associative" />

      <div className="mt-16">
        <div className="h-10 w-72 rounded bg-surface-3 animate-pulse" />
      </div>

      <GroupSkeleton title="union" />
      <GroupSkeleton title="partisan" />
    </div>
  );
}
