export class AuthUser {
    id: number;
    username: string;
    email: string;


    /**
     * Create class instance
     * @param obj data to initialize properties
     */
    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.username = obj.username ? obj.username.replace('_', ' ') : '';
        this.email = obj.email ? obj.email : '';
    }


    /**
     * Converts the data to JSON format.
     * In detail, the data is formatted to meet the backend naming and requirements.
     * @returns data JSON
     */
    toJson(): {} {
        return {
            id: this.id,
            username: this.username.replace(' ', '_'),
            email: this.email,
        }
    }
}