import {Person} from './person';

export class Contact extends Person {
    uid?: string;
    email?: string;
    phone?: string;

    constructor(name: string, uid?: string, email?: string, phone?: string) {
        super(name);
        this.uid = uid;
        this.email = email;
        this.phone = phone;
    }

    isUser(): boolean {
        if(this.uid && this.uid.length > 0) {return true}
        else {return false}
    }

    hasOptionalProperties(): boolean {
        if(this.email || this.phone) {return true}
        else {return false}
    }

    isUneditedUser(): boolean {
        return this.isUser() && !this.hasOptionalProperties();
    }
}