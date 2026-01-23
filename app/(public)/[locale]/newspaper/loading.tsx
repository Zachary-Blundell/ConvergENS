
// app/[locale]/newspaper/loading.tsx
import React from 'react';

function Pulse({ className }: { className: string }) {
  return <div className={`${className} animate-pulse`} />;
}

function ButtonSkeleton({ variant = 'surface' }: { variant?: 'surface' | 'highlight' }) {
  return (
    <div
      className={[
        'w-full h-12 md:h-14 rounded-xl',
        variant === 'highlight' ? 'bg-highlight/40' : 'bg-surface-3',
        'shadow-s animate-pulse',
      ].join(' ')}
    />
  );
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="py-1" />

      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-2">
        <div className="absolute inset-0">
          {/* image placeholder */}
          <div className="absolute inset-0 bg-surface-3 animate-pulse" />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 flex">
          <div className="bg-surface-2/50 px-4 py-2 backdrop-blur-xs rounded-lg space-y-3">
            <Pulse className="h-10 sm:h-12 md:h-14 w-[min(36rem,70vw)] rounded bg-surface-3" />
            <Pulse className="h-5 sm:h-6 w-[min(28rem,60vw)] rounded bg-surface-3" />
          </div>
        </div>
      </section>

      {/* Central prose block */}
      <section aria-labelledby="agora-about">
        <h2 id="agora-about" className="sr-only">
          Loading
        </h2>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <div className="space-y-3">
            <Pulse className="h-4 w-full rounded bg-surface-3" />
            <Pulse className="h-4 w-11/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-10/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-9/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-11/12 rounded bg-surface-3" />
            <Pulse className="h-4 w-8/12 rounded bg-surface-3" />
          </div>
        </div>
      </section>

      {/* Current issue */}
      <section aria-labelledby="issue-current" className="space-y-6">
        <header>
          <Pulse className="h-8 sm:h-9 w-[min(26rem,70vw)] rounded bg-surface-3" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Cover */}
          <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface-2 shadow-m">
            <div className="absolute inset-0 bg-surface-3 animate-pulse" />
          </figure>

          {/* Right column */}
          <div className="space-y-6">
            <blockquote className="rounded-2xl border border-outline bg-surface-2 p-6 shadow-m">
              <div className="space-y-3">
                <Pulse className="h-5 w-full rounded bg-surface-3" />
                <Pulse className="h-5 w-11/12 rounded bg-surface-3" />
                <Pulse className="h-5 w-10/12 rounded bg-surface-3" />
                <Pulse className="h-5 w-9/12 rounded bg-surface-3" />
              </div>
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <ButtonSkeleton variant="surface" />
              <ButtonSkeleton variant="highlight" />
            </div>

            <Pulse className="h-4 w-[min(30rem,90%)] rounded bg-surface-3" />

            {/* Optional EN note placeholder */}
            <div className="rounded-2xl border border-outline bg-surface-2 p-4 shadow-sm">
              <div className="space-y-2">
                <Pulse className="h-4 w-full rounded bg-surface-3" />
                <Pulse className="h-4 w-10/12 rounded bg-surface-3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
