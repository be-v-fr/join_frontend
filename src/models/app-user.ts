import { AuthUser } from './auth-user';
import { Contact } from './contact';
import { environment } from '../environments/environment.development';


/**
 * Represents an in-app user, which has additional properties compared to AuthUser.
 * It contains the AuthUser as its "user" property.
 */
export class AppUser {
    id: number;
    user: AuthUser;
    color_id: number;
    contacts?: Contact[];


    /**
     * Create class instance
     * @param obj data to initialize properties
     */
    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.user = new AuthUser(obj.user ? obj.user : { id: -1 });
        this.color_id = obj.color_id ? obj.color_id : -1;
        this.contacts = obj.contacts ? obj.contacts : undefined;
    }


    /**
     * Converts the data to JSON format.
     * In detail, the data is formatted to meet the backend naming and requirements.
     * @returns data JSON
     */
    toJson(): {} {
        return {
            id: this.id,
            user: this.user.toJson(),
            color_id: this.color_id,
        }
    }


    /**
     * Retrieves hexadecimal color string from color id.
     * @returns {string} hex color
     */
    getColor(): string {
        return environment.BADGE_COLORS[this.color_id];
    }


    /**
     * Return this user as a contact object
     * @returns contact
     */
    asContact(): Contact {
        return new Contact({
            contact_user: this.id,
            name: this.user.username,
            color_id: this.color_id
        });
    }


    /**
     * Check if this user has another user in his contacts list
     * @param user the other user
     * @returns check result
     */
    hasUserInContacts(appUser: AppUser): number {
        if (this.contacts) {
            for (let i = 0; i < this.contacts.length; i++) {
                const c = this.contacts[i];
                if (c.user_id == appUser.id) { return i }
            }
        }
        return -1;
    }
}