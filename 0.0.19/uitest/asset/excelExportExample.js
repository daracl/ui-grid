export function initExcelExample(grid, options) {
  const links = [
    ['index.html', 'UI 테스트'],
    ['excel-export.html', '기본·rowSpan'],
    ['excel-export-chart.html', '차트'],
    ['excel-export-group.html', 'Grouping'],
    ['excel-export-tree.html', 'Tree'],
  ];
  const nav = document.createElement('nav');
  links.forEach(([href, label], index) => {
    const anchor = document.createElement('a');
    anchor.href = `./${href}`;
    anchor.textContent = label;
    nav.appendChild(anchor);
    if (index < links.length - 1) nav.appendChild(document.createTextNode(' | '));
  });
  (document.querySelector('.example-content') ?? document.body).prepend(nav);
  const button = document.getElementById('export');
  const status = document.getElementById('status');
  document.getElementById('theme')?.addEventListener('change', (event) => grid.setTheme(event.target.value));
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '파일 생성 중...';
    try {
      await grid.exportExcel(options);
      status.textContent = '다운로드 완료';
    } catch (error) {
      status.textContent = `내보내기 실패: ${error.message}`;
    } finally {
      button.disabled = false;
    }
  });
}
