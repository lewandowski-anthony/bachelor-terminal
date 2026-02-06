export async function displayAsciiArt(asciiLines, term, options = {}) {
    const cols = term.cols;
    const rows = term.rows;
    const speed = options.speed ?? 150;
    const startingText = options.startingText ?? null;
    const finalText = options.finalText ?? null;

    // Fonction pour centrer une ligne horizontalement
    const centerLine = (line) => {
        const lineStr = String(line);
        const padding = Math.floor((cols - lineStr.length) / 2);
        return ' '.repeat(Math.max(padding, 0)) + lineStr;
    };

    // Préparer les lignes de départ
    const startingLines = startingText ? [startingText] : [];

    // Créer les frames progressives
    const frames = [];
    for (let i = 1; i <= asciiLines.length; i++) {
        frames.push(asciiLines.slice(0, i));
    }

    for (let frameLines of frames) {
        term.clear();

        // Afficher le texte de départ centré en haut
        startingLines.forEach(line => term.writeln(centerLine(line)));

        // Calculer les lignes vides pour centrer verticalement
        const emptyLines = Math.floor((rows - frameLines.length - startingLines.length) / 2);
        for (let i = 0; i < emptyLines; i++) term.writeln('');

        // Afficher le frame centré horizontalement
        frameLines.forEach(line => {
            term.writeln(centerLine(line));
        });

        await new Promise(resolve => setTimeout(resolve, speed));
    }

    // Afficher le texte final centré en bas
    if (finalText) {
        term.writeln(''); // Ligne vide pour respirer
        term.writeln(centerLine(finalText));
    }
}
