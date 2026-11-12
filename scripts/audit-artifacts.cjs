// 브라우저 감사에서 내려받은 파일을 다시 읽어 구조와 데이터를 확인한다.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { crc32, inflateSync } = require('node:zlib');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..', '.tmp', 'audit-browser');
const expected = '한글,"따옴표"\n줄바꿈';
const json = JSON.parse(fs.readFileSync(path.join(root, 'audit.json'), 'utf8'));
assert.equal(json.length, 100);
assert.equal(json[0].name, expected);
assert.equal(json[99].amount, 99);
const csv = fs.readFileSync(path.join(root, 'audit.csv'), 'utf8');
assert.equal(csv.charCodeAt(0), 0xfeff);
assert.ok(csv.includes('"한글,""따옴표""\n줄바꿈"'));
assert.ok(csv.includes('한글 99,99'));

const zip = fs.readFileSync(path.join(root, 'audit.xlsx'));
const xmlFiles = {};
let offset = 0;
while (zip.readUInt32LE(offset) === 0x04034b50) {
  assert.equal(zip.readUInt16LE(offset + 8), 0);
  const size = zip.readUInt32LE(offset + 18);
  const nameLength = zip.readUInt16LE(offset + 26);
  const extraLength = zip.readUInt16LE(offset + 28);
  const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
  const start = offset + 30 + nameLength + extraLength;
  const data = zip.subarray(start, start + size);
  assert.equal(crc32(data), zip.readUInt32LE(offset + 14));
  xmlFiles[name] = data.toString('utf8');
  offset = start + size;
}
assert.equal(zip.readUInt32LE(offset), 0x02014b50);
assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
const dom = new JSDOM();
try {
  const parser = new dom.window.DOMParser();
  for (const [name, xml] of Object.entries(xmlFiles)) {
    if (/\.(xml|rels)$/.test(name)) assert.equal(parser.parseFromString(xml, 'text/xml').querySelector('parsererror'), null, name);
  }
  const sheet = parser.parseFromString(xmlFiles['xl/worksheets/sheet1.xml'], 'text/xml');
  assert.equal(sheet.querySelectorAll('sheetData > row').length, 101);
  assert.ok(sheet.documentElement.textContent.includes(expected));
} finally { dom.window.close(); }

const pdf = fs.readFileSync(path.join(root, 'audit.pdf'));
const text = pdf.toString('latin1');
assert.ok(text.startsWith('%PDF-'));
assert.ok(text.trimEnd().endsWith('%%EOF'));
assert.ok(text.includes('/FontFile2'));
const pages = (text.match(/\/Type \/Page\b/g) || []).length;
assert.ok(pages > 1);
let streams = 0;
let unicodeMaps = 0;
const streamPattern = /<<(.*?)>>\s*stream\r?\n/gs;
for (const match of text.matchAll(streamPattern)) {
  const start = match.index + match[0].length;
  const end = text.indexOf('endstream', start);
  if (!match[1].includes('/FlateDecode')) continue;
  const data = inflateSync(pdf.subarray(start, end));
  streams++;
  if (data.toString('latin1').includes('begincmap')) unicodeMaps++;
}
assert.ok(unicodeMaps > 0);
console.log(JSON.stringify({ jsonRows: json.length, csvBom: true, xlsxEntries: Object.keys(xmlFiles).length, xlsxRows: 101, pdfPages: pages, pdfStreams: streams, unicodeMaps, pdfVisualReview: false }, null, 2));
