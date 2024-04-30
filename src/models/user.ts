import { Contact } from './contact';
import { Person } from './person';


/**
 * This class represents a user.
 * It should be stored in the Firebase authentication database as well as in the Firestore.
 */
export class User extends Person {
    uid: string;
    contacts: Contact[] = [];


    /**
     * Create user
     * @param name user name 
     * @param uid Firebase user ID
     */
    constructor(name: string, uid: string) {
        super(name);
        this.uid = uid;
        if (uid == 'guest') {
            this.loadLocalGuestContacts();
        }
    }


    /**
     * Add contact to this user's individual contact list
     * @param contact contact to be added
     */
    addContact(contact: Contact) {
        this.contacts.push(contact);
    }


    /**
     * Transform contacts list to "any" object array
     * @returns contacts map
     */
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


    /**
     * Transform "any" object array to contacts list
     * @param mappedContacts "any" object array containing contacts data
     * @returns contacts array
     */
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


    /**
     * Return this user as a contact object
     * @returns contact
     */
    asContact(): Contact {
        let contact = new Contact(this.name, this.uid);
        contact.color = this.color;
        return contact;
    }


    /**
     * Check if this user has another user in his contacts list
     * @param user the other user
     * @returns check result
     */
    hasUserInContacts(user: User): boolean {
        let res: boolean = false;
        this.contacts.forEach(c => {
            if (c.uid && c.uid == user.uid) { res = true }
        })
        return res;
    }


    /**
     * Load contacts of guest user from local storage
     */
    loadLocalGuestContacts() {
        const item = localStorage.getItem('guest_contacts');
        if (item && this.uid == 'guest') {this.contacts = this.getContactsFromMap(JSON.parse(item))}
    }


    /**
     * Save contacts of guest user to local storage
     */
    saveLocalGuestContacts() {
        if (this.uid == 'guest') {localStorage.setItem('guest_contacts', JSON.stringify(this.contacts))}
    }
}