export default class Role {
    constructor(name, level, commands) {
        this.name = name;
        this.level = level;
        this.commands = commands || [];
    }
}

export const ROLES = {
    admin: new Role("admin", 0, ),
    superuser: new Role("superuser", 1),
    user: new Role("user", 2, ['medias', 'games']),
    logmaster: new Role("logmaster", 3, ['logs']),
    guest: new Role("guest", 4, ['help', 'about', 'logout', 'clear', 'hints']),
    special: new Role("special", 5)
};

