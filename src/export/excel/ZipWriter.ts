const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  return value >>> 0;
});

/** 외부 의존성 없이 ZIP STORE 형식으로 XLSX 패키지를 구성한다. */
export function createZip(files: Record<string, string>): Uint8Array {
  const entries = Object.entries(files).map(([name, text]) => ({
    name: encoder.encode(name),
    data: encoder.encode(text),
  }));
  const size = entries.reduce((total, entry) => total + entry.data.length + entry.name.length * 2 + 76, 22);
  if (entries.length > 65535 || size > 0xffffffff) throw new RangeError('XLSX exceeds ZIP32 limits');
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  const offsets: number[] = [];
  const checksums: number[] = [];
  let offset = 0;
  for (const entry of entries) {
    let crc = 0xffffffff;
    for (const byte of entry.data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 255];
    crc = (crc ^ 0xffffffff) >>> 0;
    offsets.push(offset);
    checksums.push(crc);
    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 0x0800, true);
    view.setUint16(offset + 12, 33, true);
    view.setUint32(offset + 14, crc, true);
    view.setUint32(offset + 18, entry.data.length, true);
    view.setUint32(offset + 22, entry.data.length, true);
    view.setUint16(offset + 26, entry.name.length, true);
    bytes.set(entry.name, offset + 30);
    bytes.set(entry.data, offset + 30 + entry.name.length);
    offset += 30 + entry.name.length + entry.data.length;
  }
  const directoryOffset = offset;
  entries.forEach((entry, index) => {
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 0x0800, true);
    view.setUint16(offset + 14, 33, true);
    view.setUint32(offset + 16, checksums[index], true);
    view.setUint32(offset + 20, entry.data.length, true);
    view.setUint32(offset + 24, entry.data.length, true);
    view.setUint16(offset + 28, entry.name.length, true);
    view.setUint32(offset + 42, offsets[index], true);
    bytes.set(entry.name, offset + 46);
    offset += 46 + entry.name.length;
  });
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 8, entries.length, true);
  view.setUint16(offset + 10, entries.length, true);
  view.setUint32(offset + 12, offset - directoryOffset, true);
  view.setUint32(offset + 16, directoryOffset, true);
  return bytes;
}
