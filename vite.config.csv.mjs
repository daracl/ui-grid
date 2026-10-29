import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { createCommonConfig, MODULE_NAME } from './vite.common.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    ...createCommonConfig(isProd),
    build: {
      outDir: isProd ? 'dist' : 'dist/unmin',
      emptyOutDir: false,
      sourcemap: !isProd,
      minify: isProd ? 'esbuild' : false,
      lib: {
        entry: path.resolve(directory, 'src/export/csv/CsvExport.ts'),
        formats: ['es'],
        fileName: () => `${MODULE_NAME}.csv${isProd ? '.min' : ''}.mjs`,
      },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  };
});
