import {Person} from './person';

export class Contact extends Person {
    uid?: string;
    email?: string;
    phone?: number;

    constructor(name: string, uid?: string, email?: string, phone?: number) {
        super(name);
        this.uid = uid;
        this.email = email;
        this.phone = phone;
    }

    isUser() {
        return this.uid && this.uid.length > 0;
    }
}