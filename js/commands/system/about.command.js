import ICommand from '../core/ICommand.js';

export default class AboutCommand extends ICommand {
  constructor(term) {
    super('about', 'About this terminal');
    this.term = term;
  }

  async execute() {
    this.term.writeln('This terminal contains every information about Lucas and Benjamin wedding !');
    this.term.writeln('It is where the bestmen and the witnesses can find all the necessary information about the event, such as schedules, locations, and more.');
    this.term.writeln('The bachelor countdown events informations are also hidden in this terminal, but you will have to find it by yourself !');
    this.term.writeln('The project demonstrates the use of JavaScript, HTML, and CSS to create an interactive and engaging user experience.');
    this.term.writeln('');
    this.term.writeln('© 2026 - les6gemmesdelinfinie - All rights reserved.');
  }
}
