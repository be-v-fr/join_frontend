import { Contact } from './contact';
import { Person } from './person';

export class User extends Person {
    uid: string;
    contacts: Contact[] = [];

    constructor(name: string, uid: string) {
        super(name);
        this.uid = uid;
    }

    addContact(contact: Contact) {
        this.contacts.push(contact);
    }

    getMapFromContacts(): any[] {
        return this.contacts.map(c => {
            const map: any = {
                name: c.name,
                color: c.color,
            };
            if (c.uid) { map.uid = c.uid }
            if (c.email) { map.email = c.email }
            if (c.phone) { map.phone = c.phone }
            return map;
        })
    }

    getContactsFromMap(mappedContacts: any[]): Contact[] {
        return mappedContacts.map(m => {
            let contact = new Contact('');
            contact.name = m.name;
            contact.color = m.color;
            if(m.uid) {contact.uid = m.uid}
            if(m.email) {contact.email = m.email}
            if(m.phone) {contact.phone = m.phone}
            return contact;
        })
    }

    asContact(): Contact {
        let contact = new Contact(this.name, this.uid);
        contact.color = this.color;
        return contact;
    }
}