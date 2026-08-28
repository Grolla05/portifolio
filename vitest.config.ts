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
        Sem `exclude` o glob padrão do vitest varre `.claude/worktrees/`, onde o Claude Code
        mantém cópias completas do projeto — com `node_modules` e `tests/` próprios. Os testes
        de lá rodavam contra OUTRA instância de React, quebrando com
        "Cannot read properties of null (reading 'useState')" e deixando `npx vitest run`
        vermelho mesmo com a suíte real inteira passando.
    */
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.claude/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
