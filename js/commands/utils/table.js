export function pad(str, size) {
  return String(str).padEnd(size, ' ');
}

export function renderTable(term, headers, rows, sizes) {
  term.writeln(
    headers.map((h, i) => pad(h, sizes[i])).join('')
  );
  term.writeln('-'.repeat(sizes.reduce((a, b) => a + b)));

  rows.forEach(row => {
    term.writeln(
      row.map((c, i) => pad(c, sizes[i])).join('')
    );
  });
}
