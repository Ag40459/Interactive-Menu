import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react( ),
    {
      name: 'generate-404',
      closeBundle() {
        // Conteúdo do arquivo 404.html
        const html404 = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Redirecionando...</title>
          <script type="text/javascript">
            sessionStorage.setItem('redirectPath', window.location.pathname);
            window.location.href = '/';
          </script>
        </head>
        <body>
          <p>Redirecionando para a página principal...</p>
        </body>
        </html>`;
        
        // Escreve o arquivo 404.html no diretório de build
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/404.html'),
          html404
        );
      }
    }
  ],
  base: "/", 
  server: {
    host: '0.0.0.0',
    allowedHosts: ['dev.ecolote.com.br']
  }
});