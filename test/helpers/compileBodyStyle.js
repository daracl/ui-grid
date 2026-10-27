// body 스타일(borderless, rows, cells, striped ...) SCSS 를 컴파일해서 CSS 를 stdout 으로 출력한다.
// 각 스타일 파일이 @daracl/ui-style 을 @use 하는데, jest(jsdom) 샌드박스 안에서는 sass 가 파일을 탐색할 때
// 발생하는 Node fs 오류를 처리하지 못하므로 별도 Node 프로세스에서 컴파일한다.
const path = require('path');
const { pathToFileURL } = require('url');
const sass = require('sass');

const mixins = ['borderless', 'rows', 'cells', 'striped', 'stripedrows', 'stripedcells'];
const styleDir = path.join(__dirname, '../../style/views/style');
const uiStyleRoot = path.dirname(require.resolve('@daracl/ui-style/package.json'));

const uiStyleImporter = {
  findFileUrl(url) {
    if (!url.startsWith('@daracl/ui-style')) return null;
    const sub = url.slice('@daracl/ui-style'.length);
    return pathToFileURL(path.join(uiStyleRoot, 'src', sub || 'index.scss'));
  },
};

const source = `${mixins.map((name) => `@use './_${name}.scss' as ${name};`).join('\n')}
.dg-layout.dg-style- { ${mixins.map((name) => `@include ${name}.${name};`).join(' ')} }`;

const result = sass.compileString(source, {
  url: pathToFileURL(path.join(styleDir, 'export-test.scss')),
  importers: [uiStyleImporter],
  logger: { warn: () => {} },
});

process.stdout.write(result.css);
