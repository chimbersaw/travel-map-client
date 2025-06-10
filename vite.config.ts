import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const host = env.VITE_ALLOWED_HOST || "localhost";

    return {
        plugins: [react()],
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,                           // :contentReference[oaicite:0]{index=0}
                    silenceDeprecations: [ 'import', 'legacy-js-api' ],
                    api: 'modern-compiler'                     // :contentReference[oaicite:1]{index=1}
                }
            }
        },
        define: {
            global: 'globalThis'
        },
        preview: {
            port: 9173,
            strictPort: true,
            host: 'localhost',
            allowedHosts: [host, `www.${host}`]
        },
        server: {
            port: 5173,
            strictPort: true,
            host: 'localhost',
        }
    }
});
