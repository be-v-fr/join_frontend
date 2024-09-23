import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, from, lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Router } from "@angular/router";
import { AppUser } from "../../models/app-user";
import { Contact } from "../../models/contact";
import { AuthUser } from "../../models/auth-user";


/**
 * This injectable handles Firebase user authentication.
 * Aside from plain authentication and registration, it can only display the user name.
 * For the retrieval of more detailed data about the current user, see "usersService".
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser$: Subject<AppUser | null> = new Subject<AppUser | null>();
    currentUser: AppUser | null = null;
    guestLogIn: boolean = false;


    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    /**
     * Register user
     * @param name user name
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    async register(username: string, email: string, password: string): Promise<Object> {
        const url = environment.BASE_URL + 'register';
        const body = {
            username: username,
            email: email,
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Log in user (with password and email)
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    logIn(username: string, password: string): Promise<Object> {
        const url = environment.BASE_URL + 'login';
        const body = {
            username: username,
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    async syncUser(): Promise<void> {
        const url = environment.BASE_URL + 'users/current';
        const resp = await lastValueFrom(this.http.get(url, {
            headers: environment.AUTH_TOKEN_HEADERS
        }));
        this.currentUser = new AppUser(resp);
        this.syncContacts();
        this.currentUser$.next(this.currentUser);
    }


    /**
     * Send password reset email
     * @param email user email address
     * @returns authentication result
     */
    resetPassword(email: string): Observable<void> {
        const promise: Promise<void> = new Promise(() => { });
        return from(promise);
    }


    /**
     * Log in as guest.
     * The guest log in is handled via local storage.
     */
    logInAsGuest() {
        this.guestLogIn = true;
        this.setLocalGuestLogin(true);
        this.currentUser = new AppUser({
            id: 0,
            user: new AuthUser({id: 'guest', name: 'Guest'}),
        });
    }


    /**
     * Log out (both as guest and registered user)
     * @returns log out result
     */
    logOut(): void {
        if (this.guestLogIn) {
            this.guestLogIn = false;
            this.setLocalGuestLogin(false);
        }
        this.deleteLocalSessionToken();
        this.currentUser = null;
        this.currentUser$.next(null);
        this.router.navigateByUrl('');
    }


    async syncContacts(): Promise<void> {
        if (this.currentUser && this.currentUser.user.id != -1) {
            if (this.currentUser.user.id == 'guest') {
                this.currentUser.loadLocalGuestContacts();
            } else {
                await this.syncRegisteredUserContacts();
                console.log('contacts synced', this.currentUser.contacts);
            }
        }
    }


    async syncRegisteredUserContacts(): Promise<void> {
        if (this.currentUser) {
            const url = environment.BASE_URL + 'contacts';
            const resp = await lastValueFrom(this.http.get(url, {
                headers: environment.AUTH_TOKEN_HEADERS
            }));
            this.currentUser.contacts = [];
            (resp as Array<any>).forEach(cData => {
                this.currentUser?.contacts?.push(new Contact(cData));
            });
            this.currentUser$.next(this.currentUser);
        }
    }


    async addContact(contact: Contact): Promise<void> {
        // POST
    }


    async updateContact(contact: Contact): Promise<void> {
        // PUT
    }


    async deleteContact(contact_id: number): Promise<void> {
        // DELETE
    }


    /**
     * This function removes the session token from the local storage (not from the server!).
     */
    deleteLocalSessionToken(): void {
        localStorage.removeItem('token');
    }


    /**
     * Get Firebase user ID ("uid") of active user or 'guest' in case of guest log in
     * @returns user ID (actual uid, guest or undefined in case there is no log in)
     */
    getCurrentUid(): number | 'guest' | undefined {
        if (this.guestLogIn || this.getLocalGuestLogin()) {
            return 'guest';
        } else if (this.currentUser?.id) {
            this.setLocalGuestLogin(false);
            return this.currentUser.id;
        } else {
            return undefined;
        }
    }


    /**
     * Set "as_guest" item in local storage to handle guest log in
     * @param logIn desired value
     */
    setLocalGuestLogin(logIn: boolean) {
        localStorage.setItem('as_guest', JSON.stringify(logIn));
    }


    /**
     * Get "as_guest" item from local storage to handle guest log in
     */
    getLocalGuestLogin(): boolean {
        const item = localStorage.getItem('as_guest');
        return (item ? JSON.parse(item) : false);
    }


    /**
     * Set "remember_log_in" item in local storage to handle log in remembrance
     * @param logIn desired value
     */
    setLocalRememberMe(remember: boolean) {
        localStorage.setItem('remember_log_in', JSON.stringify(remember));
    }


    /**
     * Get "remember_log_in" item from local storage to handle log in remembrance
     */
    getLocalRememberMe() {
        const item = localStorage.getItem('remember_log_in');
        return (item ? JSON.parse(item) : false);
    }
}