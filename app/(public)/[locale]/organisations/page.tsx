// app/[locale]/organisations/page.tsx
import { OrganisationCard } from '@/components/OrganisationCard';
import { getOrganisationCards } from '@/lib/cms/collectives';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export default async function OrganisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations('OrganisationsPage');

  const organisations = await getOrganisationCards(locale);

  // return <div>testing</div>;
  return (
    <div className="container px-4 py-12 mt-10 mx-auto">
      <h1 className="mb-20 text-5xl text-center text-highlight">
        {t('organisationsHeader')}
      </h1>
      {organisations.length === 0 ? (
        <p className="text-center text-fg-primary">{t('noOrganisations')}</p>
      ) : (
        <div className="sm:mx-3 grid gap-15 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {organisations.map((org) => (
            <OrganisationCard
              key={org.id}
              id={org.id}
              name={org.name}
              logoW={org.logoWidth}
              logoH={org.logoHeight}
              summary={org.summary}
              logoUrl={org.logoUrl}
              slug={org.slug}
              color={org.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
