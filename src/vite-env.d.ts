/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_OPENROUTER_API_KEY_SECOND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
