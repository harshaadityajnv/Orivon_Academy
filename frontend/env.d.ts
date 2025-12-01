declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_SEARCH_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
