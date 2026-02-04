const MAX_PASSWORD_ATTEMPTS = 3;

window.USERS = {
    benjamin: {
        role: "user",
        commands: ['bzbomb']
    },
    lucas: {
        role: "user",
        commands: ['slap']
    },
    torio: {
        role: "user"
    },
    antoine: {
        role: "superuser",
        password: 'antoine2026'
    },
    anthony: {
        role: "admin",
        password: 'evg2026'
    }
};

window.ROLES = {
    admin: {
        level: 0,
        commands: ['files']
    },
    superuser: {
        level: 1,
        commands: ['users']
    },
    user: {
        level: 2,
        commands: ['logs']
    },
    guest: {
        level: 3,
        commands: ['help', 'about', 'logout', 'clear', 'logout']
    }
};


window.auth = {
    state: 'login',
    username: '',
    role: 'guest',
    commands: []
};

function getCommandsForUser(username) {
    const user = USERS[username];
    if (!user) return [];

    const userRole = user.role;
    const userCommands = user.commands || [];
    const userLevel = ROLES[userRole]?.level ?? Infinity;

    const inheritedRoles = Object.entries(ROLES)
        .filter(([roleName, roleData]) => roleData.level >= userLevel)
        .map(([roleName, roleData]) => roleData.commands || []);

    const commands = inheritedRoles.flat().concat(userCommands);
    return Array.from(new Set(commands));
}


window.handleAuthLoginInput = function (input) {

    const username = input.trim() || 'guest';

    if (!USERS.hasOwnProperty(username)) {
        term.writeln(`Unknown user: ${username}`);
        term.write(promptText);
        return;
    }

    auth.username = username;
    auth.commands = getCommandsForUser(username);
    auth.role = USERS[username].role;
    auth.state = 'shell';

    if (USERS[username].hasOwnProperty('password')) {
        auth.state = 'password';
    }
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
            numberOfAttempts=0
        }
        return numberOfAttempts;
    }
    term.write('\r\n' + `Correct password. Welcome, ${auth.username}!\r\n`);
    auth.state = 'shell';
};
