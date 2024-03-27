import {Contact} from './contact';

export class User extends Contact {
    override email: string;
    password: string;

    constructor(name: string, email: string, password: string) {
        super(name);
        this.email = email;
        this.password = password;
    }
}