window.USERS = {
    common: {
        commands: ['help', 'about', 'logout', 'clear']
    },
    benjamin: {
        commands: ['projects', 'bzbomb', "files"]
    },
    lucas: {
        commands: ["slap", "files"]
    },
    torio: {
        commands: ["users"]
    }
};


window.auth = {
    state: 'login',
    username: '',
    commands: []
};

window.handleAuthInput = function (input) {

    const username = input.trim() || 'guest';

    if(!USERS.hasOwnProperty(username) || username === 'common') {
        term.writeln(`Unknown user: ${username}`);
        term.write(promptText);
        return;
    }

    auth.username = username;
    auth.commands = USERS['common'].commands.concat(USERS[username]?.commands || []);
    auth.state = 'shell';

    window.promptText = `${username}@evg-2026-server:~$ `;
    term.writeln(`Welcome ${username}`);
};
