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

window.ROLES = {
    admin: new Role("admin", 0, ['medias']),
    superuser: new Role("superuser", 1, ['users']),
    user: new Role("user", 2, ['logs']),
    guest: new Role("guest", 3, ['help', 'about', 'logout', 'clear', 'logout']),
    special: new Role("special", 4)
};

window.USERS = {
    benjamin: new User("benjamin", "BGBM", ROLES['user'].name, ['bzbomb']),
    lucas: new User("lucas", "CalusLaTortue", ROLES['user'].name, ['suitup']),
    torio: new User("torio", "FranckyLaSourdure", ROLES['user'].name),
    antoine: new User("antoine", "TLD", ROLES['superuser'].name, [], 'YW50b2luZTIwMjY='),
    anthony: new User("anthony", "MrLew", ROLES['admin'].name, [], 'ZXZnMjAyNg=='),
    test: new User("test", "userTest", ROLES['admin'].name, ['suitup', 'bzbomb']),
    manon: new User("manon", "Manon", ROLES['special'].name, []),
    laurent: new User("laurent", "Laurent", ROLES['special'].name, []),
    romane: new User("romane", "Romane", ROLES['special'].name, []),
    cassandra: new User("cassandra", "Cassandra", ROLES['special'].name, []),
    norman: new User("norman", "Norman", ROLES['special'].name, []),
    laouni: new User("laouni", "Laouni", ROLES['special'].name, []),
    fanny: new User("fanny", "Fanny", ROLES['special'].name, []),
    sofyan: new User("sofyan", "Sofyan", ROLES['special'].name, []),
    samy: new User("samy", "Samy", ROLES['special'].name, []),
    remi: new User("remi", "Remi", ROLES['special'].name, []),
    alois: new User("alois", "Alois", ROLES['special'].name, []),
    guillaume: new User("guillaume", "Guillaume", ROLES['special'].name, [])
};

window.auth = new Auth();

/**
 * Handle special user cases after successful login
 * Most of the time, it will open a new window to a website with hints or jokes
 */
handleSpecialUsernameInput = function(input) {
    switch(btoa(input)) {
        case 'Z3VpbGxhdW1l':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL01tMC1iaTliN0tr"), '_blank');
            break;
        case 'bWFub24=':
            window.open(atob("aHR0cHM6Ly93d3cuY291cnNmbG9yZW50LmZyLz9nZ2Vfc291cmNlPWdvb2dsZSZnZ2VfbWVkaXVtPWNwYyZnZ2VfdGVybT1jb3VycyUyMGZsb3JlbnQmZ2dlX2NhbXBhaWduPVNlYXJjaC1NYXJxdWUtUGFyaXMmZ2FkX3NvdXJjZT0xJmdhZF9jYW1wYWlnbmlkPTcxOTc0ODQwJmdicmFpZD0wQUFBQUFELUlHLUIxcFI2cWdYODJscG1vV3Jkbm5FLV8zJmdjbGlkPUNqMEtDUWlBbkpITUJoREFBUklzQUJyN2I4N1ZXX2ZfdFlaZkR0d051SW8tbGxyMjU1WmNOSFNZQWVpd3NSTGNIOUQzcXlnb0FtQWJ2X2NhQXY1NEVBTHdfd2NC"), '_blank');
            break;
        case 'Y2Fzc2FuZHJh':
            window.open(atob("aHR0cHM6Ly9mci53aWtpcGVkaWEub3JnL3dpa2kvU2NodHJvdW1wZmV0dGU="), '_blank');
            break;
        case 'bGF1cmVudA==':
            window.open(atob("aHR0cHM6Ly95b3V0dS5iZS9GOFZ2dFVWdHRhdw=="), '_blank');
            break;
        case 'cm9tYW5l':
            window.open(atob("aHR0cDovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MEpla0o2anRBTEkmbGlzdD1QTDhlZ2l3WkUxTGs1VFBoTnVYSHByd01TQ2JNSFRiT2p6JmluZGV4PTEwNA=="), '_blank');
            break;
        case 'bm9ybWFu':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1Qc2VscnpqNjBpYyZ0PTE0cw=="), '_blank');
            break;
        case 'bGFvdW5p':
            window.open(atob("aHR0cHM6Ly95b3V0dS5iZS9hZXVvSWlXbl9aYz9zaT1NcFE0SGtYVWlGUHpvbUI0JnQ9MjE1"), '_blank');
            break;
        case 'ZmFubnk=':
            window.open(atob("aHR0cHM6Ly9mci53aWtpcGVkaWEub3JnL3dpa2kvUGllcnJlX0dhcm5pZXJfKGNoYW50ZXVyKQ=="), '_blank');
            break;
        case 'c29meWFu':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1nRVpvOGstaHg4WQ=="), '_blank');
            break;
        case 'c2FteQ==':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL0NWbG9hLXFUVFE0"), '_blank');
            break;
        case 'cmVtaQ==':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1WWG41M0VxSlJBWQ=="), '_blank');
            break;
        case 'YWxvaXM=':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL2VsY2JoSDVqNGZR"), '_blank');
            break;
        default:
            break;
    }
}

function isValidUsername(username) {
  return /^[a-z0-9_-]+$/.test(username);
}

window.handleAuthLoginInput = function (input) {

    const username = input.trim() || 'guest';

    if (!isValidUsername(username)) {
        term.writeln('Invalid username. Use only lowercase letters, no accents.');
        auth.state = 'login';
        return;
    }

    if (!USERS.hasOwnProperty(username)) {
        term.writeln(`Unknown user: ${username}`);
        term.write(promptText);
        return;
    }

    if(USERS[username].role === ROLES['special'].name) {
        handleSpecialUsernameInput(username);
        auth.state = 'login';
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
