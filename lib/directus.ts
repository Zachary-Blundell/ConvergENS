import { createDirectus, rest } from '@directus/sdk';



console.log("DIRECTUS_API_ENDPOINT", process.env.DIRECTUS_API_ENDPOINT);

export const directus = createDirectus(process.env.DIRECTUS_API_ENDPOINT).with(
  rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
  }),
);
