const MAX_PASSWORD_ATTEMPTS = 3;

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
    },
    anthony: {
        commands: ["users"],
        password: 'evg2026'
    }
};

window.auth = {
    state: 'login',
    username: '',
    commands: []
};


window.handleAuthLoginInput = function (input) {

    const username = input.trim() || 'guest';

    if (!USERS.hasOwnProperty(username) || username === 'common') {
        term.writeln(`Unknown user: ${username}`);
        term.write(promptText);
        return;
    }

    auth.username = username;
    auth.commands = USERS['common'].commands.concat(USERS[username]?.commands || []);
    auth.state = 'shell';
    window.promptText = `${username}@evg-2026-server:~$ `;

    if (USERS[username].hasOwnProperty('password')) {
        auth.state = 'password';
        window.promptText = `${username}@evg-2026-server:~$password: `;
    }
    term.write('\r\n' + promptText);
};

window.handleAuthPasswordInput = function (input, numberOfAttempts) {

    const inputPassword = input.trim();

    if (inputPassword !== USERS[auth.username].password) {
        term.writeln('Incorrect password.');
        numberOfAttempts++;
        if (numberOfAttempts >= MAX_PASSWORD_ATTEMPTS) {
            term.writeln('Maximum password attempts exceeded. Returning to login.');
            auth.state = 'login';
            auth.username = '';
            auth.commands = [];
            window.promptText = 'login: ';
            numberOfAttempts=0
        } else {
            window.promptText = `${auth.username}@evg-2026-server:~$password: `;
        }
        term.write('\r\n' + promptText);
        return numberOfAttempts;
    }
    term.write('\r\n' + `Correct password. Welcome, ${auth.username}!\r\n`);
    window.promptText = `${auth.username}@evg-2026-server:~`;
    auth.state = 'shell';
    term.write('\r\n' + promptText);
};
