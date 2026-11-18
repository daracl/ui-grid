// Vite가 실제 HTML 파일 목록을 수집하므로 예제 추가 시 목록을 따로 수정할 필요가 없다.
const sources = import.meta.glob('../**/*.html', { query: '?raw', import: 'default', eager: true });
const titles = new Map(
  Object.entries(sources).map(([path, source]) => {
    const document = new DOMParser().parseFromString(source, 'text/html');
    const file = path.slice(3);
    const title = document.querySelector('.page-header h1')?.textContent.trim();
    return [file, title || file];
  }),
);
const pages = Object.keys(sources)
  .map((path) => path.slice(3))
  .filter((path) => path !== 'index.html')
  .sort((a, b) => (a === 'demo.html' ? -1 : b === 'demo.html' ? 1 : a.localeCompare(b)));
const $ = (id) => document.getElementById(id);
const frame = $('exampleFrame');
let current;

function renderList() {
  const search = $('fileSearch').value.trim().toLowerCase();
  const matches = pages.filter((file) => `${titles.get(file)} ${file}`.toLowerCase().includes(search));
  $('fileList').replaceChildren(
    ...matches.map((file) => {
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(file)}`;
      link.textContent = titles.get(file);
      link.title = file;
      if (file === current) link.setAttribute('aria-current', 'page');
      return link;
    }),
  );
  $('fileCount').textContent = matches.length ? `${matches.length} / ${pages.length}개 예제` : '검색 결과가 없습니다.';
}

function selectPage() {
  let requested;
  try {
    requested = decodeURIComponent(location.hash.slice(1));
  } catch {
    requested = '';
  }
  const file = pages.includes(requested) ? requested : 'demo.html';
  if (current === file) return;
  current = file;
  const url = new URL(`../${file}`, import.meta.url);
  $('currentFile').textContent = file;
  $('openPage').href = url.href;
  $('previewStatus').textContent = '불러오는 중…';
  frame.title = `${file} 실행 화면`;
  if (frame.hasAttribute('src')) frame.contentWindow.location.replace(url.href);
  else frame.src = url.href;
  renderList();
}

frame.addEventListener('load', () => {
  $('previewStatus').textContent = '실행 화면';
  // 예제의 목록 복귀 링크가 iframe 안에 탐색기를 중첩해서 열지 않도록 한다.
  frame.contentDocument?.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href);
    if (target.origin === location.origin && target.pathname === location.pathname) {
      event.preventDefault();
      location.href = target.href;
    }
  });
});
$('fileSearch').addEventListener('input', renderList);
$('reload').addEventListener('click', () => {
  $('previewStatus').textContent = '불러오는 중…';
  frame.contentWindow.location.reload();
});
window.addEventListener('hashchange', selectPage);
selectPage();
