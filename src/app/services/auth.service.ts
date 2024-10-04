import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, from, lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Router } from "@angular/router";
import { AppUser } from "../../models/app-user";
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
            username: username.replace(' ', '_'),
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
            username: username.replace(' ', '_'),
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    getAuthTokenHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('token'));
    }


    initUser(userData?: AppUser): void {
        this.currentUser = userData ? new AppUser(userData) : this.createGuestAppUserObject();
        this.currentUser$.next(this.currentUser);
    }


    createGuestAppUserObject() {
        const authGuest = new AuthUser({ id: 'guest' });
        return new AppUser({ user: authGuest });
    }


    async syncUser(): Promise<void> {
        const url = environment.BASE_URL + 'users/current';
        const resp: any = await lastValueFrom(this.http.get(url, {
            headers: this.getAuthTokenHeaders(),
        }));
        this.currentUser = resp.username ? this.createGuestAppUserObject() : new AppUser(resp);
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
        const url = environment.BASE_URL + 'login/guest';
        const body = {
            username: localStorage.getItem('token') || '',
            password: 'guestlogin',
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Log out (both as guest and registered user)
     * @returns log out result
     */
    logOut(): void {
        this.deleteLocalSessionToken();
        this.currentUser = null;
        this.currentUser$.next(null);
        this.router.navigateByUrl('');
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
        if (this.currentUser) {
            return this.currentUser.user.id == 'guest' ? this.currentUser.id : 'guest';
        } else return;
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