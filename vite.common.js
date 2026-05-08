import path from 'path';
import { fileURLToPath } from 'url';
import banner from 'vite-plugin-banner';
import packageJson from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topBanner = `/*!
* ${packageJson.name} v${packageJson.version}
* Copyright 2023-${new Date().getUTCFullYear()} darainfo;
* Licensed ${packageJson.license}
*/`;

const moduleName = 'daracl.grid';

export const MODULE_NAME = moduleName;

/** 공통 asset 설정 */
export const createAssetFileNames = (isProd) => {
  return (assetInfo) => {
    if (assetInfo.name.endsWith('.css')) {
      return isProd ? `${MODULE_NAME}.min.[ext]` : `${MODULE_NAME}.[ext]`;
    }
    return 'assets/[name].[ext]';
  };
};
export const createCommonConfig = (isProd) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@t': path.resolve(__dirname, 'src/types'),
    },

    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    banner(topBanner),

    // production 에서만 실행
    isProd && aggressiveHtmlMinify(),
  ].filter(Boolean),

  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
  },

  server: {
    host: '0.0.0.0',

    port: 4178,

    open: '/uitest/index.html',

    watch: {
      ignored: ['!**/src/**'],
    },
  },
});

function minifyHtmlContent(html) {
  return (
    html
      // 줄바꿈/탭 제거
      .replace(/[\r\n\t]+/g, ' ')

      // 태그 사이 공백 제거
      .replace(/>\s+</g, '><')

      // 태그 앞 공백 제거
      .replace(/\s+</g, '<')

      // 태그 뒤 공백 제거
      .replace(/>\s+/g, '>')

      // 연속 공백 제거
      .replace(/\s{2,}/g, ' ')

      // trim
      .trim()
  );
}

/**
 * html`...`
 * tagged template 전용 minify plugin
 */
export function aggressiveHtmlMinify() {
  return {
    name: 'aggressive-html-minify',

    apply: 'build',

    enforce: 'post',

    transform(code, id) {
      // node_modules 제외
      if (id.includes('node_modules')) {
        return null;
      }

      // 대상 확장자만
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) {
        return null;
      }

      let result = '';
      let cursor = 0;

      while (cursor < code.length) {
        const start = code.indexOf('html`', cursor);

        // 더 이상 없음
        if (start === -1) {
          result += code.slice(cursor);
          break;
        }

        // 이전 코드 추가
        result += code.slice(cursor, start);

        // html` 시작 추가
        result += 'html`';

        let i = start + 5;

        let template = '';
        let braceDepth = 0;

        while (i < code.length) {
          const char = code[i];
          const next = code[i + 1];

          // escape 처리
          if (char === '\\') {
            template += char + next;
            i += 2;
            continue;
          }

          // ${ 시작
          if (char === '$' && next === '{') {
            braceDepth++;
            template += '${';
            i += 2;
            continue;
          }

          // } 종료
          if (char === '}' && braceDepth > 0) {
            braceDepth--;
            template += char;
            i++;
            continue;
          }

          // template 종료
          if (char === '`' && braceDepth === 0) {
            break;
          }

          template += char;
          i++;
        }

        // html minify
        const minified = minifyHtmlContent(template);

        result += minified + '`';

        cursor = i + 1;
      }

      return {
        code: result,
        map: null,
      };
    },
  };
}
