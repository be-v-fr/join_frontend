import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { Observable, Subject, from, lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment.development";


/**
 * This injectable handles Firebase user authentication.
 * Aside from plain authentication and registration, it can only display the user name.
 * For the retrieval of more detailed data about the current user, see "usersService".
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    guestLogOut$: Subject<void> = new Subject<void>();
    guestLogIn: boolean = false;

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Register user
     * @param name user name
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    async register(username: string, email: string, password: string): Promise<Object> {
        const url = environment.BASE_URL + 'api/register';
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
        const url = environment.BASE_URL + 'api/login';
        const body = {
            username: username,
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Send password reset email
     * @param email user email address
     * @returns authentication result
     */
    resetPassword(email: string): Observable<void> {
        const promise = sendPasswordResetEmail(
            this.firebaseAuth,
            email
        ).then(() => { });
        return from(promise);
    }


    /**
     * Log in as guest.
     * The guest log in is handled via local storage.
     */
    logInAsGuest() {
        this.guestLogIn = true;
        this.setLocalGuestLogin(true);
    }


    /**
     * Log out (both as guest and registered user)
     * @returns log out result
     */
    logOut(): Observable<void> {
        if (this.guestLogIn) {
            this.guestLogIn = false;
            this.setLocalGuestLogin(false);
            this.guestLogOut$.next();
            return new Observable<void>(o => o.complete());
        } else {
            const promise = signOut(this.firebaseAuth);
            return from(promise);
        }
    }


    /**
     * Get Firebase user ID ("uid") of active user or 'guest' in case of guest log in
     * @returns user ID (actual uid, guest or undefined in case there is no log in)
     */
    getCurrentUid(): string | undefined {
        if (this.guestLogIn || this.getLocalGuestLogin()) {
            return 'guest';
        } else if (this.firebaseAuth.currentUser) {
            this.setLocalGuestLogin(false);
            return this.firebaseAuth.currentUser['uid'];
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