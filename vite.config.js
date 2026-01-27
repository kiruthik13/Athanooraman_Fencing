import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portal-links',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mAdmin Portal\x1b[0m:  \x1b[36mhttp://localhost:5173/admin-login\x1b[0m`);
            console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mClient Portal\x1b[0m: \x1b[36mhttp://localhost:5173/signin\x1b[0m\n`);
          }, 100);
        });
      }
    }
  ],
})
