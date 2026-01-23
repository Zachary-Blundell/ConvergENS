// app/[locale]/contact/loading.tsx  (also copied to legal/loading.tsx)
import React from 'react';

function Line({ w }: { w: string }) {
  return <div className={`h-4 ${w} rounded bg-surface-3 animate-pulse`} />;
}

export default function Loading() {
  return (
    <main className="flex flex-col p-6 mt-20">
      <div className="bg-surface-2 p-5 rounded-xl shadow-m">
        <div className="mb-6">
          <div className="h-7 w-2/5 rounded bg-surface-3 animate-pulse" />
        </div>

        <div className="space-y-3">
          <Line w="w-full" />
          <Line w="w-11/12" />
          <Line w="w-10/12" />
          <Line w="w-9/12" />

          <div className="py-2" />

          <Line w="w-full" />
          <Line w="w-11/12" />
          <Line w="w-10/12" />
          <Line w="w-8/12" />

          <div className="py-2" />

          <Line w="w-full" />
          <Line w="w-11/12" />
          <Line w="w-9/12" />
          <Line w="w-10/12" />
          <Line w="w-7/12" />
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-5 w-1/3 rounded bg-surface-3 animate-pulse" />
          <Line w="w-full" />
          <Line w="w-10/12" />
          <Line w="w-9/12" />
        </div>
      </div>
    </main>
  );
}
