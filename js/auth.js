window.USERS = {
    common: {
        commands: ['help', 'ls', 'about', 'logout'],
        files: []
    },
    benjamin: {
        commands: ['projects', 'bzbomb'],
        files: ['terminal-site', 'notes.txt']
    },
    lucas: {
        commands: ['help', "slap"],
        files: ['projects', 'todo.txt']
    }
};


window.auth = {
    state: 'login',
    username: '',
    commands: [],
    files: []
};

window.handleAuthInput = function (input) {

    const username = input.trim() || 'guest';

    if(!USERS.hasOwnProperty(username) || username === 'common') {
        term.writeln(`Utilisateur inconnu : ${username}`);
        term.write(promptText);
        return;
    }

    auth.username = username;
    auth.commands = USERS['common'].commands.concat(USERS[username]?.commands || []);
    auth.files = USERS['common'].files.concat(USERS[username]?.files || []);
    auth.state = 'shell';

    window.promptText = `${username}@site:~$ `;
    term.writeln(`Bienvenue ${username}`);
};
