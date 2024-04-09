import { Contact } from './contact';
import { Person } from './person';

export class User extends Person {
    uid: string;
    contacts: Contact[] = [];

    constructor(name: string, uid: string) {
        super(name);
        this.uid = uid;
    }
}