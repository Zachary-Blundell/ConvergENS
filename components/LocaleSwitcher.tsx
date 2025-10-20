'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(newLocale) => {
        if (newLocale !== locale) {
          router.replace(pathname, { locale: newLocale });
        }
      }}
    >
      <SelectTrigger className="w-20 bg-surface-3">
        <SelectValue placeholder={locale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="fr-FR">FR</SelectItem>
          <SelectItem value="en-US">EN</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
