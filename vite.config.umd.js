import { defineConfig } from 'vite';
import path from 'path';
import { commonConfig, MODULE_NAME, createAssetFileNames } from './vite.common.js';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    ...commonConfig,

    build: {
      outDir: isProd ? 'dist' : 'dist/unmin',
      emptyOutDir: false,
      sourcemap: !isProd,

      // production 일때만 terser 사용
      minify: isProd ? 'terser' : false,

      // production 일때만 target 최적화
      target: isProd ? 'esnext' : undefined,

      terserOptions: isProd
        ? {
            compress: {
              passes: 3,
              drop_console: false,
              drop_debugger: true,
              unsafe: true,
            },

            mangle: {
              toplevel: true,
            },

            format: {
              comments: false,
            },
          }
        : undefined,

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
