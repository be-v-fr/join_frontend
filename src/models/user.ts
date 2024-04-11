import { Contact } from './contact';
import { Person } from './person';

export class User extends Person {
    uid: string;
    contacts: Contact[] = [];

    constructor(name: string, uid: string) {
        super(name);
        this.uid = uid;
        if (uid == 'guest') {
            this.loadLocalGuestContacts();
        }
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
            if (m.uid) { contact.uid = m.uid }
            if (m.email) { contact.email = m.email }
            if (m.phone) { contact.phone = m.phone }
            return contact;
        })
    }

    asContact(): Contact {
        let contact = new Contact(this.name, this.uid);
        contact.color = this.color;
        return contact;
    }

    hasUserInContacts(user: User): boolean {
        let res: boolean = false;
        this.contacts.forEach(c => {
            if (c.uid && c.uid == user.uid) { res = true }
        })
        return res;
    }

    loadLocalGuestContacts() {
        const item = localStorage.getItem('guest_contacts');
        if (item) {
            if (this.uid == 'guest') {
                this.contacts = this.getContactsFromMap(JSON.parse(item));
            } else {
                console.error('FORBIDDEN: Not allowed to load guest contacts to user with ID', this.uid);
            }
        }
    }

    saveLocalGuestContacts() {
        if (this.uid == 'guest') {
            localStorage.setItem('guest_contacts', JSON.stringify(this.contacts));
        } else {
            console.error('FORBIDDEN: Not allowed to save guest contacts from user with ID', this.uid);
        }
    }
}