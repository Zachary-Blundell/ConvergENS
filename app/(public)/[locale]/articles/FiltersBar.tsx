'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { TagUI } from '@/lib/cms/tags';
import {
  useCallback,
  useRef,
  useState,
  useEffect,
  useId,
  ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import { CollectiveUI } from '@/lib/cms/collectives';

type Id = string | number;
type Option = { id: Id; label: string };

function toOptionsFromOrganisations(items: CollectiveUI[]): Option[] {
  return items.map((c) => ({ id: c.id, label: c.name }));
}
function toOptionsFromTags(items: TagUI[]): Option[] {
  return items.map((t) => ({ id: t.id as Id, label: t.label }));
}

const cn = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(' ');

const baseBtn = 'rounded-md px-2 py-1 text-sm border transition';
const activeBtn = 'bg-highlight-soft dark:bg-highlight border-outline';
const inactiveBtn =
  'bg-surface-3 hover:bg-surface-4 border-white dark:border-outline ';
const groupWrap = 'flex flex-wrap items-center gap-2';
const groupLabel = 'rounded-sm pl-2 py-1 text-xs font-medium';

/* ------------ Reusable mobile sheet ------------ */

function OptionSheet({
  open,
  title,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  const firstFocusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstFocusRef.current?.focus(), 0);
    // optional body scroll lock
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        className="fixed inset-0 z-40 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="fixed z-50 inset-x-0 bottom-0 rounded-t-2xl border border-outline bg-surface-1 p-4 max-h-[70vh] overflow-auto"
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-outline/60 mb-3" />
        <div className="flex items-center justify-between mb-2">
          <h2 id={labelledBy} className="text-xl">
            {title}
          </h2>
          <button onClick={onClose} className="text-sm underline">
            Close
          </button>
        </div>
        <div ref={firstFocusRef} tabIndex={-1} />
        {children}
      </div>
    </>
  );
}

/* ------------ Filters Bar ------------ */

export default function FiltersBar({
  organisations,
  tags,
  selectedTag,
  selectedOrganisation,
}: {
  organisations: CollectiveUI[];
  tags: TagUI[];
  selectedTag?: Id;
  selectedOrganisation?: Id;
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
      p.set('page', '1');
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router],
  );

  const renderGroup = (
    title: string,
    param: 'organisation' | 'tag',
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
          {t('all')}
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

  /* --------- Tags (mobile sheet) --------- */
  const [tagsOpen, setTagsOpen] = useState(false);
  const tagOptions = toOptionsFromTags(tags);
  const selectedTagStr = selectedTag != null ? String(selectedTag) : '';
  const tagsLabelId = useId();

  /* --------- Organisations (mobile sheet) --------- */
  const [organisationsOpen, setOrganisationsOpen] = useState(false);
  const organisationOptions = toOptionsFromOrganisations(organisations);
  const selectedOrganisationStr =
    selectedOrganisation != null ? String(selectedOrganisation) : '';
  const colLabelId = useId();

  // Reusable option button for sheets
  const SheetOptionBtn = ({
    id,
    label,
    isActive,
    onSelect,
  }: {
    id?: string; // undefined => "All"
    label: string;
    isActive: boolean;
    onSelect: (id: string | undefined) => void;
  }) => (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        'w-full text-left rounded-lg px-4 py-3 border',
        isActive
          ? 'bg-highlight-soft border-outline'
          : 'bg-surface-2 hover:bg-surface-3 border-outline',
      )}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gradient-to-t from-surface-2 to-surface-3 shadow-m border border-outline rounded-md p-2 flex flex-col gap-2">
      {/* --------- Desktop / tablet (sm+) --------- */}
      <div className="hidden sm:flex flex-col gap-2">
        {renderGroup(
          t('groups.organisations'),
          'organisation',
          organisationOptions,
          selectedOrganisation,
        )}
        {renderGroup(t('groups.tags'), 'tag', tagOptions, selectedTag)}
      </div>

      {/* --------- Mobile (below sm) --------- */}
      <div className="sm:hidden flex flex-col gap-2">
        {/* Organisations trigger */}
        <div className={groupWrap}>
          <p className={groupLabel}>{t('groups.organisations')}</p>
          <button
            type="button"
            className={cn(baseBtn, inactiveBtn, 'flex items-center gap-2')}
            onClick={() => setOrganisationsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={organisationsOpen}
            aria-controls="organisations-sheet"
          >
            {t('categories') ?? 'Categories'}
          </button>
          {selectedOrganisationStr && (
            <span className="text-xs opacity-80">
              {
                organisationOptions.find(
                  (o) => String(o.id) === selectedOrganisationStr,
                )?.label
              }
            </span>
          )}
        </div>

        {/* Tags trigger */}
        <div className={groupWrap}>
          <p className={groupLabel}>{t('groups.tags')}</p>
          <button
            type="button"
            className={cn(baseBtn, inactiveBtn, 'flex items-center gap-2')}
            onClick={() => setTagsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={tagsOpen}
            aria-controls="tags-sheet"
          >
            {t('categories') ?? 'Categories'}
          </button>
          {selectedTagStr && (
            <span className="text-xs opacity-80">
              {tagOptions.find((o) => String(o.id) === selectedTagStr)?.label}
            </span>
          )}
        </div>
      </div>

      {/* --------- Sheets (mobile) --------- */}

      {/* Organisations sheet */}
      <OptionSheet
        open={organisationsOpen}
        title={t('groups.organisations')}
        onClose={() => setOrganisationsOpen(false)}
        labelledBy={colLabelId}
      >
        <div className="grid grid-cols-1 gap-2" id="organisations-sheet">
          <SheetOptionBtn
            id={undefined}
            label={t('all')}
            isActive={!selectedOrganisationStr}
            onSelect={(id) => {
              push({ organisation: id });
              setOrganisationsOpen(false);
            }}
          />
          {organisationOptions.map((opt) => (
            <SheetOptionBtn
              key={String(opt.id)}
              id={String(opt.id)}
              label={opt.label}
              isActive={selectedOrganisationStr === String(opt.id)}
              onSelect={(id) => {
                push({ organisation: id });
                setOrganisationsOpen(false);
              }}
            />
          ))}
        </div>
      </OptionSheet>

      {/* Tags sheet */}
      <OptionSheet
        open={tagsOpen}
        title={t('groups.tags')}
        onClose={() => setTagsOpen(false)}
        labelledBy={tagsLabelId}
      >
        <div className="grid grid-cols-1 gap-2" id="tags-sheet">
          <SheetOptionBtn
            id={undefined}
            label={t('all')}
            isActive={!selectedTagStr}
            onSelect={(id) => {
              push({ tag: id });
              setTagsOpen(false);
            }}
          />
          {tagOptions.map((opt) => (
            <SheetOptionBtn
              key={String(opt.id)}
              id={String(opt.id)}
              label={opt.label}
              isActive={selectedTagStr === String(opt.id)}
              onSelect={(id) => {
                push({ tag: id });
                setTagsOpen(false);
              }}
            />
          ))}
        </div>
      </OptionSheet>
    </div>
  );
}
