export async function displayAsciiArt(asciiLines, options = {}) {
    const cols = this.term.cols;
    const rows = this.term.rows;
    const speed = options.speed || 150;
    const startingText = options.startingText || null;
    const finalText = options.finalText || null;

    // Prepare starting text lines
    const startingLines = startingText ? [startingText] : [];

    // Generate progressive frames
    const frames = [];
    for (let i = 1; i <= asciiLines.length; i++) {
      frames.push(asciiLines.slice(0, i));
    }

    // Center horizontally
    const centerFrame = (frame) =>
      frame.map(line => {
        const padding = Math.floor((cols - line.length) / 2);
        return ' '.repeat(Math.max(padding, 0)) + line;
      });

    // Display each frame
    for (let i = 0; i < frames.length; i++) {
      this.term.clear();

      // Display starting text at the top
      startingLines.forEach(line => {
        const padding = Math.floor((cols - line.length) / 2);
        this.term.writeln(' '.repeat(Math.max(padding, 0)) + line);
      });

      // Center ASCII Art vertically after starting text
      const frame = centerFrame(frames[i]);
      const emptyLines = Math.floor((rows - frame.length - startingLines.length) / 2);
      for (let j = 0; j < emptyLines; j++) this.term.writeln('');
      frame.forEach(line => this.term.writeln(line));

      await new Promise(resolve => setTimeout(resolve, speed));
    }

    // Display final text
    if (finalText) {
      const padding = Math.floor((cols - finalText.length) / 2);
      this.term.writeln('\r\n' + ' '.repeat(Math.max(padding, 0)) + finalText + '\r\n');
    }
}
