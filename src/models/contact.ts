import {Person} from './person';


/**
 * This class represents a user contact.
 * A contact can be added by the user from scratch.
 * Contacts are also created when additional data (email/phone) is added by the active user to other users.
 */
export class Contact extends Person {
    uid?: string;
    email?: string;
    phone?: string;


    /**
     * Create contact
     * @param name contact name
     * @param uid Firebase user ID
     * @param email contact email address
     * @param phone contact phone number
     */
    constructor(name: string, uid?: string, email?: string, phone?: string) {
        super(name);
        this.uid = uid;
        this.email = email;
        this.phone = phone;
    }


    /**
     * Check if this contact is also a user
     * @returns check result
     */
    isUser(): boolean {
        if(this.uid && this.uid.length > 0) {return true}
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