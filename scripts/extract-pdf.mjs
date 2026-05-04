import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PDFParse } from "pdf-parse";

const file = process.argv[2];
if (!file) {
  console.error("usage: extract-pdf.mjs <path-to-pdf>");
  process.exit(1);
}
const buf = readFileSync(resolve(file));
const parser = new PDFParse({ data: buf });
const data = await parser.getText();
console.log(`=== ${file} ===`);
console.log(`Pages: ${data.pages?.length ?? data.total ?? "?"}`);
console.log(`---`);
console.log(data.text);
