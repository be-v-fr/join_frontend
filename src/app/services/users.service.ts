import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subject } from 'rxjs';
import { AppUser } from '../../models/app-user';
import { AuthUser } from '../../models/auth-user';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";


/**
 * This injectable handles generic users operations.
 * POST / ADD only via registration
 */
@Injectable({
  providedIn: 'root'
})

export class UsersService {
  users: AppUser[] = [];
  users$: Subject<void> = new Subject<void>();


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }


  init() {
    const tasksEvents = new EventSource(environment.BASE_URL + 'users/stream');
    tasksEvents.onmessage = () => this.syncUsers();
    this.syncUsers();
  }


  /**
   * Subscribe to Firestore "users" collection to synchronize "users" array.
   * Also trigger "users$" observable on snapshot.
   * @returns subscription
   */
  subUsers() {
    return this.users$.subscribe(() => {}); // SUB TO BACKEND !!!
  }


  async syncUsers(): Promise<void> {
    const url = environment.BASE_URL + 'users';
    const resp = await lastValueFrom(this.http.get(url, {
      headers: environment.AUTH_TOKEN_HEADERS
    }));
    this.users = [];
    (resp as Array<any>).forEach(uData => {
      this.users.push(new AppUser(uData));
    });
    console.log('users synced!', this.users);
    this.users$.next();
  }


  async updateUser(appUser: AppUser) {
    if (appUser.id != -1 && appUser.user.id != -1) {
      if (appUser.user.id == 'guest') {
        appUser.saveLocalGuestContacts();
      } else {
        // PUT in backend
      }
    }
  }


  async deleteUser(appUser: AppUser) {
    // DELETE in backend
  }


  /**
   * Retrieve a complete app user object from app user ID
   * @param id app user ID
   * @returns app user object
   */
  getUserByAppId(id: number | 'guest'): AppUser {
    if (id == 'guest') {
      return new AppUser({
        id: -1,
        user: new AuthUser({ username: 'Guest', id: id }),
      });
    } else {
      let user = new AppUser({});
      this.users.forEach(u => {
        if (u.id == id) { user = u }
      });
      return user;
    }
  }


  /**
   * Retrieve a complete app user object from auth user ID
   * @param id auth user ID
   * @returns app user object
   */
    getUserByAuthId(id: number | 'guest'): AppUser {
      if (id == 'guest') {
        return new AppUser({
          id: -1,
          user: new AuthUser({ username: 'Guest', id: id }),
        });
      } else {
        let user = new AppUser({});
        this.users.forEach(u => {
          if (u.user.id == id) { user = u }
        });
        return user;
      }
    }
}