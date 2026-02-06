
class UserState {
    constructor(user) {
        this.state = 'login';
        this.user = user;
    }
}

export const USER_STATE = new UserState('guest');