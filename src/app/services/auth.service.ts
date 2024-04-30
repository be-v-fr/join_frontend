import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { Observable, Subject, from } from "rxjs";


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


    /**
     * Register user
     * @param name user name
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    register(name: string, email: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(response => updateProfile(response.user, { displayName: name }));
        return from(promise);
    }


    /**
     * Log in user (with password and email)
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    logIn(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(() => { });
        return from(promise);
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