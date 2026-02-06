
export default class UserState {
    constructor(user) {
        this.state = 'login';
        this.user = user;
    }

    reset() {
        this.state = 'login';
        this.user = null;
    }
}

export const USER_STATE = new UserState('guest');