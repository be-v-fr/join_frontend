import { AuthUser } from './auth-user';
import { Contact } from './contact';
import { environment } from '../environments/environment.development';


export class AppUser {
    id: number;
    user: AuthUser;
    color_id: number;
    contacts?: Contact[];


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.user = new AuthUser(obj.user ? obj.user : { id: -1 });
        this.color_id = obj.color_id ? obj.color_id : -1;
        this.contacts = obj.contacts ? obj.contacts : undefined;
    }


    toJson(): {} {
        return {
            id: this.id,
            user: this.user.toJson(),
            color_id: this.color_id,
        }
    }


    getColor() {
        return environment.BADGE_COLORS[this.color_id];
    }


    /**
     * Return this user as a contact object
     * @returns contact
     */
    asContact(): Contact {
        return new Contact({
            name: this.user.username,
            email: this.user.email,
            color_id: this.color_id
        });
    }


    /**
     * Check if this user has another user in his contacts list
     * @param user the other user
     * @returns check result
     */
    hasUserInContacts(appUser: AppUser): boolean {
        let res: boolean = false;
        if (this.contacts) {
            this.contacts.forEach(c => {
                if (c.email == appUser.user.email) { res = true }
            });
        }
        return res;
    }


    /**
     * Load contacts of guest user from local storage
     */
    loadLocalGuestContacts() {
        const item = localStorage.getItem('guest_contacts');
        if (item && this.user.id == 'guest') {
            this.contacts = [];
            const contactsData = JSON.parse(item);
            contactsData.forEach((cData: {}) => {
                const contactObj = new Contact(cData);
                this.contacts?.push(contactObj);
            });
        }
    }


    /**
     * Save contacts of guest user to local storage
     */
    saveLocalGuestContacts() {
        if (this.user.id == 'guest') { localStorage.setItem('guest_contacts', JSON.stringify(this.contacts)) }
    }
}