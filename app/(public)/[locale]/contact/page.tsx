import HtmlContent from '@/components/HtmlContent';
import { getContactPage } from '@/lib/cms/contactpage';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const contactpage = await getContactPage(locale);

  console.log('contactpage from the front: ', contactpage);
  return (
    <main className="flex flex-col p-6 mt-20">
      <div className="bg-surface-2 p-5 rounded-xl">
        <HtmlContent className="cms-content" html={contactpage.body} />
      </div>
    </main>
  );
}
