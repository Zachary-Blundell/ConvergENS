// env.d.ts
namespace NodeJS {
  interface ProcessEnv {
    DIRECTUS_API_ENDPOINT: string;
    SECRET_KEY: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
