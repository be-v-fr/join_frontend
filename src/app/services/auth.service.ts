import { Injectable, inject, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { User } from "../../models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);

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

    logOut(): Observable<void> {
        const promise = signOut(this.firebaseAuth);
        return from(promise);
    }

    getCurrentUid(): string | undefined {
        if (this.firebaseAuth.currentUser) {
            return this.firebaseAuth.currentUser['uid'];
        } else {
            return undefined;
        }
    }
}