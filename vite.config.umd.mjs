import path from 'path';
import { build, defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { createAssetFileNames, createCommonConfig, MODULE_NAME, topBanner } from './vite.common.mjs';
import pdfConfig from './vite.config.pdf.mjs';
import excelConfig from './vite.config.excel.mjs';
import csvConfig from './vite.config.csv.mjs';
import jsonConfig from './vite.config.json.mjs';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const common = createCommonConfig(isProd);

  return {
    ...common,
    resolve: {
      ...common.resolve,
      alias: {
        '@/export/pdf/loadPdfModule': path.resolve(__dirname, 'src/export/pdf/loadPdfModule.umd.ts'),
        '@/export/excel/loadExcelModule': path.resolve(__dirname, 'src/export/excel/loadExcelModule.umd.ts'),
        '@/export/csv/loadCsvModule': path.resolve(__dirname, 'src/export/csv/loadCsvModule.umd.ts'),
        '@/export/json/loadJsonModule': path.resolve(__dirname, 'src/export/json/loadJsonModule.umd.ts'),
        ...common.resolve.alias,
      },
    },
    define: {
      ...common.define,
      GRID_PDF_FILE: JSON.stringify(`${MODULE_NAME}.pdf${isProd ? '.min' : ''}.mjs`),
      GRID_EXCEL_FILE: JSON.stringify(`${MODULE_NAME}.excel${isProd ? '.min' : ''}.mjs`),
      GRID_CSV_FILE: JSON.stringify(`${MODULE_NAME}.csv${isProd ? '.min' : ''}.mjs`),
      GRID_JSON_FILE: JSON.stringify(`${MODULE_NAME}.json${isProd ? '.min' : ''}.mjs`),
    },
    plugins: [
      ...common.plugins,
      {
        name: 'grid-lazy-pdf',
        async writeBundle(output) {
          for (const createConfig of [pdfConfig, excelConfig, csvConfig, jsonConfig]) {
            const config = createConfig({ command: 'build', mode });
            await build({
              ...config, configFile: false, mode,
              build: { ...config.build, outDir: output.dir, copyPublicDir: false, reportCompressedSize: false },
            });
          }
        },
      },
    ],

    build: {
      outDir: isProd ? 'dist' : 'dist/unmin',
      emptyOutDir: false,
      sourcemap: !isProd,
      reportCompressedSize: false,

      // ES/CJS와 동일한 esbuild 경로로 압축합니다.
      minify: isProd ? 'esbuild' : false,

      // production 일때만 target 최적화
      target: isProd ? 'esnext' : undefined,

      lib: {
        entry: path.resolve(__dirname, 'src/index.umd.ts'),
        name: 'Daracl',
        formats: ['umd'],

        fileName: (format) => {
          if (format === 'umd') {
            return isProd ? `${MODULE_NAME}.min.umd.js` : `${MODULE_NAME}.umd.js`;
          }

          return `${MODULE_NAME}.js`;
        },
      },

      rollupOptions: {
        output: {
          banner: topBanner,
          assetFileNames: createAssetFileNames(isProd),

          // production 일때만 코드 최적화
          generatedCode: isProd ? 'es2015' : undefined,
        },

        // 필요 시 외부 라이브러리 분리
        // external: isProd ? ['react'] : [],
      },
    },
  };
});
