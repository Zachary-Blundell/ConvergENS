'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CollectiveUI } from '@/lib/cms/collectives';
import type { TagUI } from '@/lib/cms/tags';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

type Id = string | number;
type Option = { id: Id; label: string };

function toOptionsFromCollectives(items: CollectiveUI[]): Option[] {
  return items.map((c) => ({ id: c.id, label: c.name }));
}
function toOptionsFromTags(items: TagUI[]): Option[] {
  return items.map((t) => ({ id: t.id as Id, label: t.label }));
}

const cn = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(' ');

const baseBtn = 'rounded-md px-2 py-1 text-sm border transition bg-';
const activeBtn = 'bg-highlight-soft dark:bg-highlight border-outline';
const inactiveBtn =
  'bg-surface-3 hover:bg-surface-4 border-white dark:border-outline ';
const groupWrap = 'flex flex-wrap items-center gap-2';
const groupLabel =
  'border border-outline rounded-sm pl-2 py-1 text-xs font-medium';

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
  const t = useTranslations('ArticlesPage.FiltersBar');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const push = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams(params);
      for (const [k, v] of Object.entries(updates)) {
        v ? p.set(k, v) : p.delete(k);
      }
      p.set('page', '1'); // reset paging on filter change
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router],
  );

  const renderGroup = (
    title: string,
    param: 'collective' | 'tag',
    options: Option[],
    selected?: Id,
  ) => {
    const selectedStr = selected != null ? String(selected) : '';
    return (
      <div className={groupWrap}>
        <p className={groupLabel}>{title}</p>

        <button
          onClick={() => push({ [param]: undefined })}
          className={cn(baseBtn, !selectedStr ? activeBtn : inactiveBtn)}
          aria-pressed={!selectedStr}
        >
          {t('actions.all')}
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
    <div className="bg-surface-2 shadow-m border border-outline rounded-md p-2 flex flex-col gap-2">
      {renderGroup(
        t('groups.collectives'),
        'collective',
        toOptionsFromCollectives(collectives),
        selectedCollective,
      )}
      {renderGroup(
        t('groups.tags'),
        'tag',
        toOptionsFromTags(tags),
        selectedTag,
      )}
    </div>
  );
}
