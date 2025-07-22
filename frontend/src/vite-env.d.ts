/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_IMAGE_URL: string;
    readonly VITE_BOOK_COVER_IMAGE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
