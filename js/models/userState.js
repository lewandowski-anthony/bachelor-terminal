
export default class UserState {
    constructor(user) {
        this.state = 'login';
        this.user = user;
    }

    reset() {
        this.state = 'login';
        this.user = null;
    }

    login(user) {
        this.user = user;
        this.isPasswordRequired() ? this.state = 'password' : this.state = 'shell';
    }

    isPasswordRequired() {
        return this.user && this.user.password;
    }
}

export const USER_STATE = new UserState('guest');