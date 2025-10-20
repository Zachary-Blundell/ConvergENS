// app/[locale]/organisations/page.tsx
import { OrganisationCard } from '@/components/OrganisationCard';
import { getOrganisationCards } from '@/lib/cms/collectives';
import { getTranslations } from 'next-intl/server';
import React from 'react';

type Org = {
  id: string;
  name: string;
  summary?: string | null;
  logoUrl?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  slug: string;
  color?: string | null;
  // Make sure your fetcher returns this field (rename if needed):
  type: {
    id: string | number | null;
    name: string | null;
    plural?: string | null;
    adjective?: string | null;
  };
};

export default async function OrganisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('OrganisationsPage');

  const organisations = (await getOrganisationCards(locale)) as Org[];

  // ---- Grouping rules -------------------------------------------------------
  const associatives = organisations.filter(
    (o) => o.type.id === 1 || o.type.id === 4,
  );
  const partisanes = organisations.filter((o) => o.type.id === 2);
  const syndicales = organisations.filter((o) => o.type.id === 3);

  const renderGroup = (titleKey: string, items: Org[]) => (
    <section className="mt-16">
      <h3 className="mb-16 text-xl text-fg-primary">{t(titleKey)}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-fg-muted">{t('noOrganisations')}</p>
      ) : (
        <div className="sm:mx-3 grid gap-15 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {items.map((org) => (
            <OrganisationCard
              key={org.id}
              id={org.id}
              name={org.name}
              logoW={org.logoWidth ?? undefined}
              logoH={org.logoHeight ?? undefined}
              summary={org.summary ?? undefined}
              logoUrl={org.logoUrl ?? undefined}
              slug={org.slug}
              color={org.color ?? undefined}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="container px-4 py-12 mt-10 mx-auto">
      <h1 className="mb-20 text-5xl text-center text-highlight">
        {t('organisationsHeader')}
      </h1>

      {/* Top-level empty state if nothing at all */}
      {organisations.length === 0 && (
        <p className="text-center text-fg-primary">{t('noOrganisations')}</p>
      )}

      <h2 className="mt-8 text-4xl text-highlight">
        {t('decisionMakingMembers')}
      </h2>

      {/* Associative organisations: types 1 & 4 */}
      {renderGroup('associativeOrganisations', associatives)}

      <h2 className="mt-16 text-4xl text-highlight">{t('invitedMembers')}</h2>

      {/* Trade union organisations: type 3 */}
      {renderGroup('unionOrganisations', syndicales)}

      {/* Partisan organisations: type 2 */}
      {renderGroup('partisanOrganisations', partisanes)}
    </div>
  );
}
