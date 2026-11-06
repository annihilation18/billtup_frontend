import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Unit tests (vitest + Testing Library). Run with `npm test`.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
    },
  }),
);
