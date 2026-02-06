export default class Role {
    constructor(name, level, commands) {
        this.name = name;
        this.level = level;
        this.commands = commands || [];
    }
}

export const ROLES = {
    admin: new Role("admin", 0, ['users']),
    logmaster: new Role("logmaster", 1),
    superuser: new Role("superuser", 2, ['users']),
    user: new Role("user", 3, ['logs', 'medias']),
    guest: new Role("guest", 4, ['help', 'about', 'logout', 'clear', 'hints']),
    special: new Role("special", 5)
};

