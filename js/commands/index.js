import CommandRegistry from './core/CommandRegistry.js';

const registry = new CommandRegistry(window.term);

window.executeCommand = input => registry.execute(input);
