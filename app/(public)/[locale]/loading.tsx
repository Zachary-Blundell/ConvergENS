// app/[locale]/loading.tsx
import React from 'react';

function Pulse({ className }: { className: string }) {
  return <div className={`${className} animate-pulse`} />;
}

/* ---------------- Reusable Section Skeleton ---------------- */

function SectionSkeleton({
  shaded = false,
  withParagraph = true,
}: {
  shaded?: boolean;
  withParagraph?: boolean;
}) {
  return (
    <section
      className={[
        'relative z-0 w-full min-h-[60svh] md:min-h-[70svh] py-12 md:py-20',
        'flex flex-col items-center overflow-clip',
        shaded ? 'bg-surface-2' : '',
      ].join(' ')}
    >
      <div className="w-full">
        {/* Title pill */}
        <div className="mx-auto my-8 w-fit rounded-xl bg-surface-3 p-2 shadow-m">
          <Pulse className="h-10 w-72 sm:w-96 rounded bg-surface-2" />
        </div>

        {withParagraph && (
          <div className="mx-auto my-4 max-w-3xl px-4 space-y-3">
            <Pulse className="h-4 w-full rounded bg-surface-3" />
            <Pulse className="h-4 w-11/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-4/5 rounded bg-surface-3" />
          </div>
        )}

        {/* Content area */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <Pulse className="h-40 w-full rounded-lg bg-surface-3 shadow-m" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- About Grid Skeleton ---------------- */

function AboutRowSkeleton({ flip = false }: { flip?: boolean }) {
  return (
    <div className="grid items-center gap-10 sm:grid-cols-2">
      <div className={flip ? 'order-2 sm:order-1' : ''}>
        <Pulse className="aspect-[16/9] w-full rounded-md bg-surface-2 shadow-m" />
      </div>
      <div className={flip ? 'order-1 sm:order-2' : ''}>
        <div className="space-y-4">
          <Pulse className="h-7 w-2/3 rounded bg-surface-3" />
          <div className="space-y-2">
            <Pulse className="h-4 w-full rounded bg-surface-3" />
            <Pulse className="h-4 w-11/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-4/5 rounded bg-surface-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Carousel Skeleton ---------------- */

function CarouselSkeleton() {
  return (
    <div className="w-full max-w-5xl px-4 mb-8 min-h-[50svh]">
      <div className="rounded-lg bg-surface-2 shadow-m p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <Pulse className="h-6 w-40 rounded bg-surface-3" />
          <div className="flex gap-2">
            <Pulse className="h-10 w-10 rounded-lg bg-surface-3" />
            <Pulse className="h-10 w-10 rounded-lg bg-surface-3" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-surface-3 overflow-hidden">
              <div className="h-40 w-full bg-surface-2" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded bg-surface-2" />
                <div className="h-4 w-full rounded bg-surface-2" />
                <div className="h-4 w-11/12 rounded bg-surface-2" />
                <div className="pt-2 flex items-center justify-between">
                  <div className="h-4 w-28 rounded bg-surface-2" />
                  <div className="h-9 w-24 rounded-md bg-surface-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Loading() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-surface-1">
      {/* ---------------- Hero ---------------- */}
      <section className="relative h-svh w-full">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />

        {/* OrganisationsRow placeholder (subtle strip) */}
        <div className="relative z-10 w-full pt-4 px-4">
          <div className="mx-auto max-w-6xl rounded-lg bg-surface-1/60 backdrop-blur-sm border shadow-m p-3">
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-28 rounded-md bg-surface-3 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center hero text */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div className="px-4 text-center space-y-5">
            <div className="mx-auto w-fit rounded-lg bg-surface-1/50 backdrop-blur-sm px-4 py-2 border-0">
              <Pulse className="h-12 w-[min(36rem,80vw)] rounded bg-surface-3" />
            </div>
            <Pulse className="mx-auto h-11 w-56 rounded-md bg-highlight/50" />
          </div>
        </div>
      </section>

      {/* ---------------- What is ConvergENS? ---------------- */}
      <SectionSkeleton shaded={false} />

      {/* ---------------- How ConvergENS works ---------------- */}
      <SectionSkeleton shaded />

      {/* ---------------- About grid ---------------- */}
      <section className="container mx-auto space-y-20 px-4 py-16">
        <AboutRowSkeleton />
        <AboutRowSkeleton flip />
        <AboutRowSkeleton />
      </section>

      {/* ---------------- Objectives ---------------- */}
      <SectionSkeleton shaded />

      {/* ---------------- Latest articles ---------------- */}
      <div className="p-5 text-center">
        <Pulse className="mx-auto h-10 w-72 sm:w-96 rounded bg-surface-3" />
      </div>

      <CarouselSkeleton />
    </div>
  );
}
