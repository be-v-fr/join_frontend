import { AppUser } from './app-user';
import { environment } from '../environments/environment.development';


/**
 * This class represents a user contact.
 * A contact can be added by the user from scratch.
 * Contacts are also created when additional data (email/phone) is added by the active user to other users.
 */
export class Contact {
    id: number;
    appUser: AppUser;
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
        this.appUser = new AppUser(obj.appUser ? obj.appUser : { id: -1 });
        this.name = obj.name ? obj.name : '';
        this.color_id = obj.color_id ? obj.color_id : -1;
        this.email = obj.email ? obj.email : undefined;
        this.phone = obj.phone ? obj.phone : undefined;
    }


    getColor() {
        return environment.BADGE_COLORS[this.color_id];
    }


    /**
     * Check if this contact is also a user
     * @returns check result
     */
    isUser(): boolean {
        if(this.appUser.user.id && this.appUser.user.id != 'guest' && this.appUser.user.id != -1) {return true}
        else {return false}
    }


    /**
     * Check if this contact ontains optional data (email/phone)
     * @returns check result
     */
    hasOptionalProperties(): boolean {
        if(this.email || this.phone) {return true}
        else {return false}
    }


    /**
     * Check if this contact is also an unedited user
     * @returns check result
     */
    isUneditedUser(): boolean {
        return this.isUser() && !this.hasOptionalProperties();
    }
}