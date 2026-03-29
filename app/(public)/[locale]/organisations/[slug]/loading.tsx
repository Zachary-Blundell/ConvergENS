// app/[locale]/organisations/[slug]/loading.tsx
import React from 'react';

function Pulse({ className }: { className: string }) {
  return <div className={`${className} animate-pulse`} />;
}

function ButtonSkeleton({ variant = 'solid' }: { variant?: 'solid' | 'outline' }) {
  return (
    <div
      className={[
        'h-10 w-36 rounded-md',
        variant === 'outline' ? 'bg-surface-2 border border-outline' : 'bg-highlight/40',
        'shadow-s animate-pulse',
      ].join(' ')}
    />
  );
}

function SocialItemSkeleton() {
  return (
    <div className="rounded-xl border border-border-subtle/70 bg-surface-1 px-3 py-2">
      <div className="flex items-center justify-between">
        <Pulse className="h-4 w-24 rounded bg-surface-2" />
        <Pulse className="h-4 w-6 rounded bg-surface-2" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container mt-12 mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col min-[600px]:flex-row gap-1 justify-between">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Logo */}
          <div className="shrink-0">
            <Pulse className="h-24 w-24 rounded-lg border bg-surface-2" />
          </div>

          {/* Title + Summary + CTAs */}
          <div className="min-w-0">
            <Pulse className="h-9 w-[min(26rem,70vw)] rounded bg-surface-2" />
            <div className="mt-2 space-y-2">
              <Pulse className="h-4 w-[min(32rem,80vw)] rounded bg-surface-2" />
              <Pulse className="h-4 w-[min(28rem,72vw)] rounded bg-surface-2" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonSkeleton />
              <ButtonSkeleton variant="outline" />
              <ButtonSkeleton variant="outline" />
            </div>
          </div>
        </header>

        {/* Sidebar socials (skeleton always shown for consistency) */}
        <aside className="mt-4 sm:mt-0 lg:col-span-1">
          <div className="rounded-2xl bg-surface-3/70 shadow-lg p-4 border border-border-subtle">
            <Pulse className="h-5 w-28 rounded bg-surface-2" />

            <ul className="mt-4 space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i}>
                  <SocialItemSkeleton />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Separator */}
      <div className="my-8 h-px w-full bg-outline/60" />

      {/* Description area */}
      <div className="w-full px-10 py-6 bg-surface-3 border-2 border-outline border-t-outline-highlight rounded-xl shadow-sm">
        <div className="space-y-3">
          <Pulse className="h-5 w-2/5 rounded bg-surface-2" />
          <Pulse className="h-4 w-full rounded bg-surface-2" />
          <Pulse className="h-4 w-11/12 rounded bg-surface-2" />
          <Pulse className="h-4 w-10/12 rounded bg-surface-2" />
          <Pulse className="h-4 w-9/12 rounded bg-surface-2" />
          <div className="py-2" />
          <Pulse className="h-4 w-full rounded bg-surface-2" />
          <Pulse className="h-4 w-10/12 rounded bg-surface-2" />
          <Pulse className="h-4 w-8/12 rounded bg-surface-2" />
        </div>
      </div>

      {/* Carousel placeholder */}
      <section className="mt-10">
        <div className="p-5 text-center">
          <Pulse className="mx-auto h-10 w-72 sm:w-96 rounded bg-surface-2" />
        </div>
        <div className="h-1 w-24 bg-highlight/40 mx-auto mb-2 rounded animate-pulse" />

        <div className="my-8 w-full">
          <div className="rounded-lg bg-surface-2 shadow-m p-4 animate-pulse">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-surface-3 overflow-hidden">
                  <div className="h-40 w-full bg-surface-2" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-surface-2" />
                    <div className="h-4 w-full rounded bg-surface-2" />
                    <div className="h-4 w-10/12 rounded bg-surface-2" />
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
      </section>
    </div>
  );
}

