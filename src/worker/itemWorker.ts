const workerCode = `
self.onmessage = function (e) {
    const data = e.data;
    const items = data.items;
    const ROW_ID_FIELD_NAME = data.rowIdField;
    const len = items.length;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
        items[i]["\${ROW_ID_FIELD_NAME}"] = i;
    }
    self.postMessage(items);
};
`;

let worker: Worker;

export function getItemWorker() {
  if (worker) return worker;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);

  return worker;
}
