import { Config } from "@t/GridConfig";
import { ROW_ID_KEY } from "src/constants";

const workerCode = `
self.onmessage = function (e) {
    const items = e.data;
    const len = items.length;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
        items[i]["${ROW_ID_KEY}"] = i;
    }
    self.postMessage(items);
};
`;

let worker: Worker;

export function getItemWorker() {
  if (worker) return worker;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);

  return worker;
}
