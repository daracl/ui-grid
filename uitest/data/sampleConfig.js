// theme 정보
var G_GRID_THEME = localStorage.getItem('dg-grid-theme');

function getRandomFloatFromInput(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumbers(start, end, count) {
  if (start > end) {
    throw new Error('시작 값은 끝 값보다 작거나 같아야 합니다.');
  }
  if (count <= 0) {
    throw new Error('생성할 숫자의 개수는 1 이상이어야 합니다.');
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const random = Math.floor(Math.random() * (end - start + 1)) + start;
    result.push(random);
  }
  return result;
}
