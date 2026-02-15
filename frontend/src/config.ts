/**
 * Centralised app configuration, loaded from Vite environment variables.
 *
 * Env vars are defined in:
 *   .env.development  (npm run dev)
 *   .env.production   (npm run build)
 *
 * Reference YAML configs live in src/env/dev.yml and src/env/prod.yml.
 */
const config = {
    api: {
        host: import.meta.env.VITE_API_HOST ?? '',
        basePath: import.meta.env.VITE_API_BASE_PATH ?? '/api',
    },
    app: {
        name: import.meta.env.VITE_APP_NAME ?? 'Profile Builder',
    },
} as const;


export const API_BASE_URL = `${config.api.host}${config.api.basePath}`;

export default config;
