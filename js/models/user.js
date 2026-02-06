import { ROLES } from "./role.js";

export default class User {
    constructor(username, displayName, role, userCommands, password) {
        this.username = username;
        this.displayName = displayName;
        this.role = role;
        this.userCommands = userCommands || [];
        this.password = password;
    }

    get everyUserCommands() {
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

export const USERS = {
    // Regular users
    benjamin: new User("benjamin", "BGBM", ROLES['user'].name, ['bzbomb']),
    lucas: new User("lucas", "CalusLaTortue", ROLES['user'].name, ['suitup']),
    franck: new User("franck", "FranckTorio", ROLES['user'].name),
    antoine: new User("antoine", "TLD", ROLES['superuser'].name, [], 'YW50b2luZTIwMjY='),
    anthony: new User("anthony", "MrLew", ROLES['admin'].name, [], 'ZXZnMjAyNg=='),
    logmaster: new User("logmaster", "Log Master", ROLES['admin'].name, ['logs'], 'bGVzNmdlbW1lc2RlbGluZmluaQ=='),
    // Special users with no password but easter eggs
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
    johnny: new User("johnny", "Johnny", ROLES['special'].name, []),
    satan: new User("satan", "Satan", ROLES['special'].name, []),
    renaud: new User("renaud", "Renaud", ROLES['special'].name, []),
    guillaume: new User("guillaume", "Guillaume", ROLES['special'].name, [])
};
