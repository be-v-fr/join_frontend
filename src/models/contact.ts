import { AppUser } from './app-user';
import { environment } from '../environments/environment.development';


/**
 * This class represents a user contact.
 * A contact can be added by the user from scratch.
 * Contacts are also created when additional data (email/phone) is added by the active user to other users.
 */
export class Contact {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    color_id: number;


    /**
     * Create contact
     * @param name contact name
     * @param uid Firebase user ID
     * @param email contact email address
     * @param phone contact phone number
     */
    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.name = obj.name ? obj.name : '';
        this.color_id = obj.color_id ? obj.color_id : -1;
        this.email = obj.email ? obj.email : undefined;
        this.phone = obj.phone ? obj.phone : undefined;
    }


    toJson(): {} {
        const json: any = {
            name: this.name,
            color_id: this.color_id == -1 ? Math.floor(Math.random() * 25) : this.color_id,
            email: this.email,
            phone: this.phone,
        };
        if (this.id != -1) { json.id = this.id }
        return json;
    }


    getColor() {
        return environment.BADGE_COLORS[this.color_id] || '#d1d1d1';
    }
}