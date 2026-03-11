// app/[locale]/calendar/loading.tsx
import React from 'react';

function Pulse({ className }: { className: string }) {
  return <div className={`${className} animate-pulse`} />;
}

function DayCellSkeleton() {
  return (
    <div className="aspect-square rounded-lg border border-outline bg-surface-2 p-2 shadow-s">
      <div className="flex items-start justify-between">
        <Pulse className="h-4 w-6 rounded bg-surface-3" />
        <Pulse className="h-4 w-4 rounded bg-surface-3" />
      </div>

      <div className="mt-2 space-y-2">
        <Pulse className="h-3 w-full rounded bg-surface-3" />
        <Pulse className="h-3 w-5/6 rounded bg-surface-3" />
      </div>
    </div>
  );
}

function MonthGridSkeleton() {
  return (
    <div className="w-full max-w-7xl px-4">
      {/* Weekday header row */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Pulse key={i} className="h-6 rounded bg-surface-2 shadow-s" />
        ))}
      </div>

      {/* 6x7 day grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, i) => (
          <DayCellSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="space-y-4">
      <div className="py-9" />

      {/* Header */}
      <nav aria-label="Calendar navigation" className="m-4 flex items-center justify-between">
        <Pulse className="h-8 w-24 rounded bg-surface-2 shadow-s" />
        <Pulse className="h-8 w-56 rounded bg-surface-2 shadow-s" />
        <Pulse className="h-8 w-24 rounded bg-surface-2 shadow-s" />
      </nav>

      {/* Month grid */}
      <div className="flex items-center justify-center">
        <MonthGridSkeleton />
      </div>
    </main>
  );
}
