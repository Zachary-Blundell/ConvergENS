// app/[locale]/articles/FiltersBar.tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Opt = { id: string; label: string; color?: string | null };

export default function FiltersBar({
  tags,
  selectedTag,
}: {
  tags: Opt[];
  selectedTag?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const push = (updates: Record<string, string | undefined>) => {
    const p = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) =>
      v ? p.set(k, v) : p.delete(k),
    );
    p.set("page", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => push({ tag: undefined })}
        className={`rounded-md border px-2 py-1 text-sm ${
          !selectedTag ? "bg-surface-3" : "hover:bg-surface-3"
        }`}
      >
        All
      </button>

      {tags.map((t) => (
        <button
          key={t.id}
          onClick={() => push({ tag: t.id })}
          className={`rounded-md border px-2 py-1 text-sm transition ${
            selectedTag === t.id ? "bg-surface-3" : "hover:bg-surface-3"
          }`}
          title={t.label}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
