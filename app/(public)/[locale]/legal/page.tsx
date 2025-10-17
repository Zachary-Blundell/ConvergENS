import HtmlContent from '@/components/HtmlContent';
import { getLegalPage } from '@/lib/cms/legalpage';

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const legalpage = await getLegalPage(locale);

  return (
    <main className="flex flex-col p-6 mt-20">
      <div className="bg-surface-2 p-5 rounded-xl">
        <HtmlContent className="cms-content" html={legalpage.body} />
      </div>
    </main>
  );
}
