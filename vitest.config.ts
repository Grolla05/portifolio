import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    /*
        Sem `exclude` explícito o vitest varre `.claude/worktrees/`, que contém uma
        cópia completa do projeto COM seu próprio node_modules. Os testes de lá
        carregavam um segundo React, e todo `useState` explodia com
        "Cannot read properties of null". `npm test` saía vermelho com 11 arquivos
        falhando por um motivo que não existe no código-fonte.
    */
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/.claude/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
