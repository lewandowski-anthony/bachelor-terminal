import { toCamelCase } from "../../utils/stringUtils.js"; 

const HEADER_PADDING = 3;

export function pad(str, size) {
  return String(str).padEnd(size, ' ');
}

export function renderTable(term, headers, rows) {

  const sizes = headers.map(header => {
    const headerLength = String(header).length;
    const maxDataLength = Math.max(
      ...rows.map(row => String(row[toCamelCase(header)] ?? '').length),
      0
    );
    return headerLength > maxDataLength ? headerLength + HEADER_PADDING : maxDataLength + HEADER_PADDING;
  });

  term.writeln(headers.map((h, i) => pad(h, sizes[i])).join(''));
  term.writeln('-'.repeat(sizes.reduce((a, b) => a + b, 0)));

  rows.forEach(row => {
    const rowValues = headers.map(h => row[toCamelCase(String(h))] ?? '');
    term.writeln(rowValues.map((c, i) => pad(c, sizes[i])).join(''));
  });
}