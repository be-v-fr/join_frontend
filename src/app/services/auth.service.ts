import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Router } from "@angular/router";
import { AppUser } from "../../models/app-user";


/**
 * This injectable handles backend user authentication.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private AUTH_URL = environment.BASE_URL + 'auth/';
    public currentUser$: Subject<AppUser | null> = new Subject<AppUser | null>();
    currentUser: AppUser | null = null;
    timeoutErrorMsg: string = 'Server does not respond. Please refresh the page and try again.';
    activationTokenErrorMsg: string = 'Invalid token. If you just signed up, please try a second time.';


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
        const url = this.AUTH_URL + 'signup/';
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
    async logIn(email: string, password: string): Promise<Object> {
        const url = this.AUTH_URL + 'login/';
        const body = {
            email: email,
            password: password,
        };
        const promise: Promise<Object> = lastValueFrom(this.http.post(url, body));
        const timeout: Promise<string> = this.requestTimeout();
        const result: Object | string = await Promise.race([promise, timeout]);
        if(result == 'timeout') {
            throw(this.timeoutErrorMsg);
        }
        return promise;
    }


    /**
     * Returns 'timeout' after the specified timeout.
     */
    async requestTimeout(): Promise<string> {
        await new Promise((res) => setTimeout(res, 3000));
        return 'timeout';
    }


    /**
     * Synchronize the current user data from the backend.
     * Fetches the latest data of the currently authenticated user.
     * @returns A Promise resolving when the user data has been successfully fetched and initialized.
     */
    async syncUser(): Promise<void> {
        const url = this.AUTH_URL + 'users/current/';
        const resp: any = await lastValueFrom(this.http.get(url));
        this.updateCurrentUser(resp);
    }


    /**
     * Uses the server response to create the currentUser AppUser object.
     * Deletes the email address from the data in case the user is a guest.
     * @param {any} userData - data from server response 
     */
    updateCurrentUser(userData: any) {
        if (userData.email && userData.email.slice(-9) == 'token.key') {
            userData.email = '';
        }
        this.currentUser = new AppUser(userData);
        this.currentUser$.next(this.currentUser);
    }


    /**
     * Activates a new account.
     * @param key account activation token key 
     * @returns activation result
     */
    async activateAccount(key: string): Promise<Object> {
        const url = this.AUTH_URL + 'signup/activate/';
        const body = {
            token: key,
        };
        return lastValueFrom(this.http.post(url, body));        
    }


    /**
     * Request password reset email
     * @param email user email address
     * @returns authentication result
     */
    async requestPasswordReset(email: string): Promise<Object> {
        const url = this.AUTH_URL + 'reset-pw/request/';
        const body = {
            email: email,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Complete password reset
     * @param password new password
     * @param token password reset token
     * @returns authentication result
     */
    async resetPassword(newPassword: string, key: string): Promise<Object> {
        const url = this.AUTH_URL + 'reset-pw/';
        const body = {
            token: key,
            new_password: newPassword,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Log in as guest.
     * The guest log in is handled via local storage.
     */
    async logInAsGuest(): Promise<Object> {
        const url = this.AUTH_URL + 'login/guest';
        const body = {
            username: localStorage.getItem('token') || '',
            email: localStorage.getItem('token') + '@token.key' || '',
            password: 'guestlogin',
        };
        const promise: Promise<Object> = lastValueFrom(this.http.post(url, body));
        const timeout: Promise<string> = this.requestTimeout();
        const result: Object | string = await Promise.race([promise, timeout]);
        if(result == 'timeout') {
            throw(this.timeoutErrorMsg);
        }
        return promise;
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
     * Get current user ID, if it exists.
     * @returns {number | undefined} user ID or undefined
     */
    getCurrentUid(): number | undefined {
        if (this.currentUser) {
            return this.currentUser.id;
        } return;
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