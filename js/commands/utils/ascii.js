export async function displayAsciiArt(asciiLines, term, options = {}) {
    const cols = term.cols;
    const rows = term.rows;
    const speed = options.speed ?? 150;
    const startingText = options.startingText ?? null;
    const finalText = options.finalText ?? null;

    const centerLine = (line) => {
        const lineStr = String(line);
        const padding = Math.floor((cols - lineStr.length) / 2);
        return ' '.repeat(Math.max(padding, 0)) + lineStr;
    };

    const startingLines = startingText ? [startingText] : [];

    const frames = [];
    for (let i = 1; i <= asciiLines.length; i++) {
        frames.push(asciiLines.slice(0, i));
    }

    for (let frameLines of frames) {
        term.clear();

        startingLines.forEach(line => term.writeln(centerLine(line)));

        const emptyLines = Math.floor((rows - frameLines.length - startingLines.length) / 2);
        for (let i = 0; i < emptyLines; i++) term.writeln('');

        frameLines.forEach(line => {
            term.writeln(centerLine(line));
        });

        await new Promise(resolve => setTimeout(resolve, speed));
    }

    if (finalText) {
        term.writeln('');
        term.writeln(centerLine(finalText));
    }
}
