// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_ADSENSE_CLIENT_ID?: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GTM_ID?: string;
  }
}
