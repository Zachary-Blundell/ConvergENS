import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-US", "fr-FR"],
  defaultLocale: "fr-FR",
  // localePrefix: 'as-needed'
  // This will make it so that the locale is not prefixed in the URL if it is the default locale.
});
