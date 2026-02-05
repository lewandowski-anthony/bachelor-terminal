const MAX_PASSWORD_ATTEMPTS = 3;

class User {
    constructor(username, displayName, role, userCommands, password) {
        this.username = username;
        this.displayName = displayName;
        this.role = role;
        this.userCommands = userCommands || [];
        this.password = password;
    }

    get commands() {
        const userRole = this.role;
        const userCommands = this.userCommands || [];
        const userLevel = ROLES[userRole]?.level ?? Infinity;

        const inheritedRoles = Object.entries(ROLES)
            .filter(([roleName, roleData]) => roleData.level >= userLevel)
            .map(([roleName, roleData]) => roleData.commands || []);

        const commands = inheritedRoles.flat().concat(userCommands);
        return Array.from(new Set(commands));
    }
}

class Role {
    constructor(name, level, commands) {
        this.name = name;
        this.level = level;
        this.commands = commands || [];
    }
}

class Auth {
    constructor(user) {
        this.state = 'login';
        this.user = user;
    }
}

window.USERS = {
    benjamin: new User("benjamin", "BGBM", "user", ['bzbomb']),
    lucas: new User("lucas", "CalusLaTortue", "user", ['suitup']),
    torio: new User("torio", "FranckyLaSourdure", "user"),
    antoine: new User("antoine", "TLD", "superuser", [], 'YW50b2luZTIwMjY='),
    anthony: new User("anthony", "MrLew", "admin", [], 'ZXZnMjAyNg=='),
    test: new User("test", "userTest", "admin", ['suitup', 'bzbomb'])
};

window.ROLES = {
    admin: new Role("admin", 0, ['medias']),
    superuser: new Role("superuser", 1, ['users']),
    user: new Role("user", 2, ['logs']),
    guest: new Role("guest", 3, ['help', 'about', 'logout', 'clear', 'logout'])
};


window.auth = new Auth();


window.handleAuthLoginInput = function (input) {

    const username = input.trim() || 'guest';

    if (!USERS.hasOwnProperty(username)) {
        term.writeln(`Unknown user: ${username}`);
        term.write(promptText);
        return;
    }

    window.auth = new Auth(USERS[username]);
    window.auth.state = 'shell';

    if (window.auth.user.password) {
        window.auth.state = 'password';
    } else {
        term.writeln(`Welcome, ${window.auth.user.displayName}!`);
    }
};

window.handleAuthPasswordInput = function (input, numberOfAttempts) {

    const inputPassword = input.trim();

    if (btoa(inputPassword) !== auth.user.password) {
        term.writeln('Incorrect password.');
        numberOfAttempts++;
        if (numberOfAttempts >= MAX_PASSWORD_ATTEMPTS) {
            term.writeln('Maximum password attempts exceeded. Returning to login.');
            auth = new Auth();
            numberOfAttempts=0
        }
        return numberOfAttempts;
    }
    term.write('\r\n' + `Correct password. Welcome, ${window.auth.user.displayName}!\r\n`);
    window.auth.state = 'shell';
};
