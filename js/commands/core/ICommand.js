class ICommand {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  get auth() {
    return window.auth;
  }

  async execute() {
    throw new Error('execute() not implemented');
  }
}

window.ICommand = ICommand;