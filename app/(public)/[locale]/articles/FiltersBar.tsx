// app/[locale]/articles/FiltersBar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CollectiveUI } from "@/lib/cms/collectives";
import type { TagUI } from "@/lib/cms/tags";
import { useCallback } from "react";

type Id = string | number;
type Option = { id: Id; label: string };

function toOptionsFromCollectives(items: CollectiveUI[]): Option[] {
  return items.map((c) => ({ id: c.id, label: c.name }));
}
function toOptionsFromTags(items: TagUI[]): Option[] {
  return items.map((t) => ({ id: t.id as Id, label: t.label }));
}

const cn = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

const baseBtn = "rounded-md px-2 py-1 text-sm border transition";
const activeBtn = "bg-highlight-soft dark:bg-highlight border-outline";
const inactiveBtn = "hover:bg-surface-3 border-white dark:border-outline ";
const groupWrap = "flex flex-wrap items-center gap-2";
const groupLabel =
  "bg-surface-3 border border-outline rounded-sm px-2 py-1 text-xs font-medium";

export default function FiltersBar({
  collectives,
  tags,
  selectedTag,
  selectedCollective,
}: {
  collectives: CollectiveUI[];
  tags: TagUI[];
  selectedTag?: Id;
  selectedCollective?: Id;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const push = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams(params);
      for (const [k, v] of Object.entries(updates)) {
        v ? p.set(k, v) : p.delete(k);
      }
      p.set("page", "1"); // reset paging on filter change
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router],
  );

  const renderGroup = (
    title: string,
    param: "collective" | "tag",
    options: Option[],
    selected?: Id,
  ) => {
    const selectedStr = selected != null ? String(selected) : "";
    return (
      <div className={groupWrap}>
        <p className={groupLabel}>{title}</p>

        <button
          onClick={() => push({ [param]: undefined })}
          className={cn(baseBtn, !selectedStr ? activeBtn : inactiveBtn)}
          aria-pressed={!selectedStr}
        >
          All
        </button>

        {options.map((opt) => {
          const isActive = selectedStr === String(opt.id);
          return (
            <button
              key={String(opt.id)}
              onClick={() =>
                push({ [param]: isActive ? undefined : String(opt.id) })
              }
              className={cn(baseBtn, isActive ? activeBtn : inactiveBtn)}
              aria-pressed={isActive}
              title={opt.label}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-surface-2 border border-outline rounded-md p-2 flex flex-col gap-2">
      {renderGroup(
        "Collectives:",
        "collective",
        toOptionsFromCollectives(collectives),
        selectedCollective,
      )}
      {renderGroup("Tags:", "tag", toOptionsFromTags(tags), selectedTag)}
    </div>
  );
}
// "use client";
// import { CollectiveUI } from "@/lib/cms/collectives";
// import { TagUI } from "@/lib/cms/tags";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
//
// export default function FiltersBar({
//   collectives,
//   tags,
//   selectedTag,
//   selectedCollective,
// }: {
//   collectives: CollectiveUI[];
//   tags: TagUI[];
//   selectedTag?: number;
//   selectedCollective?: number;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const params = useSearchParams();
//
//   const push = (updates: Record<string, string | undefined>) => {
//     const p = new URLSearchParams(params);
//
//     Object.entries(updates).forEach(([k, v]) =>
//       v ? p.set(k, v) : p.delete(k),
//     );
//     p.set("page", "1");
//     router.push(`${pathname}?${p.toString()}`);
//   };
//   console.log("tags recived: ", tags);
//   console.log("slecetedtag recived: ", selectedTag);
//
//   return (
//     <div className="bg-surface-2 border border-outline rounded-md p-2 flex flex-col gap-2">
//       <div className="flex flex-wrap items-center gap-2">
//         <p className="bg-surface-3 border border-outline rounded-sm p-1">
//           Collectives:{" "}
//         </p>
//         <button
//           onClick={() => push({ collective: undefined })}
//           className={`rounded-md border-1 border-black dark:border-white px-2 py-1 text-sm transition ${
//             !selectedCollective
//               ? "bg-highlight-soft dark:bg-highlight"
//               : "hover:bg-surface-3"
//           }`}
//         >
//           All
//         </button>
//
//         {collectives.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => push({ collective: c.id.toString() })}
//             className={`bg-surface-3 rounded-md border-1 border-highlight px-2 py-1 text-sm transition ${
//               selectedCollective === c.id
//                 ? "bg-highlight-soft dark:bg-highlight"
//                 : "hover:bg-surface-3"
//             }`}
//             title={c.name}
//           >
//             {c.name}
//           </button>
//         ))}
//       </div>
//       <div className="flex flex-wrap items-center gap-2">
//         <p className="bg-surface-3 border border-outline rounded-sm p-1">
//           Tags:{" "}
//         </p>
//         <button
//           onClick={() => push({ tag: undefined })}
//           className={`bg-surface-3 rounded-md border-1 border-black dark:border-white px-2 py-1 text-sm transition ${
//             !selectedTag
//               ? "bg-highlight-soft dark:bg-highlight"
//               : "hover:bg-surface-3"
//           }`}
//         >
//           All
//         </button>
//
//         {tags.map((t) => {
//           console.log("here is the t.id: ", t.id);
//           return (
//             <button
//               key={t.id}
//               onClick={() =>
//                 selectedTag !== t.id ? push({ tag: t.id.toString() }) : {}
//               }
//               className={`bg-surface-3 rounded-md border-1 border-highlight px-2 py-1 text-sm transition ${
//                 selectedTag === t.id
//                   ? "bg-highlight dark:bg-highlight"
//                   : "hover:bg-highlight-200 dark:hover:bg-highlight-200"
//               }`}
//               title={t.label}
//             >
//               {t.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
