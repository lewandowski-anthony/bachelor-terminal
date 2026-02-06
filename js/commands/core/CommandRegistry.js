class CommandRegistry {
  constructor(term) {
    this.term = term;
    this.commands = {};
  }

  register(command) {
    this.commands[command.name] = command;
  }

  async execute(input) {
    const parts = input.trim().split(/\s+/);
    const name = parts.shift()?.toLowerCase();
    const args = parts;

    if (!name) return;

    if (!this.auth.user.commands.includes(name)) {
      this.term.writeln(`Unknown command: ${name}`);
      return;
    }

    const cmd = this.commands[name];
    if (!cmd) return;

    await cmd.execute(args);
  }

  get auth() {
    return window.auth;
  }
}

window.CommandRegistry = CommandRegistry;
