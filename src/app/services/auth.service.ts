import { Injectable, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    guestLogIn: boolean = false;

    register(name: string, email: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(response => updateProfile(response.user, { displayName: name }));
        return from(promise);
    }

    logIn(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(() => { });
        return from(promise);
    }

    logInAsGuest() {
        this.guestLogIn = true;
        this.setLocalGuestLogin(true);
    }

    logOut(): Observable<void> {
        if (this.guestLogIn) {
            this.guestLogIn = false;
            this.setLocalGuestLogin(false);
            return new Observable<void>(o => o.complete()); // FUNKTIONSWEISE ÜBERPRÜFEN
        } else {
            const promise = signOut(this.firebaseAuth);
            return from(promise);
        }
    }

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

    setLocalGuestLogin(logIn: boolean) {
        localStorage.setItem('as_guest', JSON.stringify(logIn));
    }

    getLocalGuestLogin(): boolean {
        const item = localStorage.getItem('as_guest');
        if (item) {
            return JSON.parse(item);
        } else {
            return false;
        }
    }

    setLocalRememberMe(remember: boolean) {
        localStorage.setItem('remember_log_in', JSON.stringify(remember));
    }

    getLocalRememberMe() {
        const item = localStorage.getItem('remember_log_in');
        if (item) {
            return JSON.parse(item);
        } else {
            return false;
        }
    }
}