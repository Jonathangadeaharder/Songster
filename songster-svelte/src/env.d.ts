declare module '$env/static/public' {
  export const PUBLIC_SUPABASE_URL: string;
  export const PUBLIC_SUPABASE_ANON_KEY: string;
}

declare module '$env/static/private' {
  export const SUPABASE_SERVICE_ROLE_KEY: string;
}

export {};
