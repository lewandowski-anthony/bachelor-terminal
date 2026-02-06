const MAX_PASSWORD_ATTEMPTS = 3;


import UserState, { USER_STATE } from '../models/userState.js';
import { isValidInput } from '../utils/stringUtils.js';
import {USERS} from '../models/user.js';
import { ROLES } from '../models/role.js';

window.auth = new UserState();

/**
 * Handle special user cases after successful login
 * Most of the time, it will open a new window to a website with hints or jokes
 */
export function handleSpecialUsernameInput(input) {
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
        case 'am9obm55':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1nYUdnd1Q5OG9QTSZ0PTIxcw=="), '_blank');
            break;
        case 'c2F0YW4=':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL24tb1hvVWo1azUw"), '_blank');
            break;
        case 'cmVuYXVk':
            window.open(atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL255RGZja3NQSlYw"), '_blank');
            break;
        default:
            break;
    }
}

window.handleAuthLoginInput = function (input) {

    const username = input.trim() || 'guest';

    if (!isValidInput(username)) {
        term.writeln('Invalid username. Use only lowercase letters, no accents or apostrophes.');
        auth.state = 'login';
        return;
    }

    if (!USERS.hasOwnProperty(username)) {
        term.writeln(`Unknown user: ${username}`);
        return;
    }

    if(USERS[username].role === ROLES['special'].name) {
        handleSpecialUsernameInput(username);
        auth.state = 'login';
        return;
    }

    window.auth = new UserState(USERS[username]);
    window.auth.state = 'shell';

    if (window.auth.user.password) {
        window.auth.state = 'password';
    } else {
        term.writeln(`Welcome, ${window.auth.user.displayName}!`);
    }
};

window.handleAuthPasswordInput = function (input, numberOfAttempts) {

    const inputPassword = input.trim();

    if (!isValidInput(inputPassword)) {
        term.writeln('Invalid password. Use only lowercase letters and numbers, no accents or apostrophes.');
        return numberOfAttempts;
    }

    if (btoa(inputPassword) !== auth.user.password) {
        term.writeln('Incorrect password.');
        numberOfAttempts++;
        if (numberOfAttempts >= MAX_PASSWORD_ATTEMPTS) {
            term.writeln('Maximum password attempts exceeded. Returning to login.');
            auth = new UserState();
            numberOfAttempts=0
        }
        return numberOfAttempts;
    }
    term.write('\r\n' + `Correct password. Welcome, ${window.auth.user.displayName}!\r\n`);
    window.auth.state = 'shell';
};
