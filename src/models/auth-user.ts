export class AuthUser {
    id: number  | 'guest';
    username: string;
    email: string;


    /**
     * Create user
     * @param name user name 
     * @param uid Firebase user ID
     */
    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.username = obj.username ? obj.username : '';
        this.email = obj.email ? obj.email : '';
    }


    toJson(): {} {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
        }
    }
}