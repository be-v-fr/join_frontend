import {Person} from './person';

export class User extends Person {
    uid: string;

    constructor(name: string, uid: string) {
        super(name);
        this.uid = uid;
    }
}