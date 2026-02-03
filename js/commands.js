const COMMANDS = {
  help() {
    term.writeln('Commandes disponibles :');
    auth.commands.forEach(cmd => term.writeln(`- ${cmd}`));
  },
  about() {
    term.writeln('Terminal web avec users custom 😎');
  },
  clear() {
    term.clear();
    term.write(promptText);
  },
  ls() {
    term.writeln('List of available files:');
    auth.files.forEach(file => term.writeln(`- ${file}`));
  },
  projects() {
    term.writeln('- terminal-site');
    term.writeln('- secret-project');
  },
  shutdown() {
    term.writeln('💥 SYSTEM HALTED 💥');
  },
  logout() {
    auth.state = 'login';
    auth.username = '';
    auth.commands = [];
    promptText = 'login: ';
    term.writeln('\nDéconnecté.\n');
    term.write(promptText);
  },
  bzbomb() {
    term.writeln('💣 BOUNZI BOMB ACTIVATED 💣');
    const weddingDate = new Date(2026, 8, 15, 12, 0, 0);
    weddingCountdown(term, promptText, weddingDate);
  },
  slap() {
    term.writeln('Le patrimoine de Lucas a été slapé !');
    const weddingDate = new Date(2026, 9, 19, 12, 0, 0);
    weddingCountdown(term, promptText, weddingDate);
  },
  batman() {
    term.writeln('Redirection vers les archives de Gotham...');
    window.open('https://www.youtube.com/shorts/d-l-0StxE3o', '_blank');
  }
};

window.COMMANDS = COMMANDS;

window.executeCommand = function(input) {
  const cmd = input.trim().toLowerCase();
  if (!cmd) return;

  if (!auth.commands.includes(cmd)) {
    term.writeln(`Commande inconnue : ${cmd}`);
    return;
  }

  window.COMMANDS[cmd]?.(); 
};
