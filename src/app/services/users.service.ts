import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Subject, Subscription } from 'rxjs';
import { AppUser } from '../../models/app-user';
import { AuthUser } from '../../models/auth-user';
import { environment } from "../../environments/environment.development";


/**
 * This injectable handles generic users operations.
 * POST / ADD only via registration
 */
@Injectable({
  providedIn: 'root'
})

export class UsersService implements OnDestroy {
  users: AppUser[] = [];
  users$: Subject<void> = new Subject<void>(); // backend AND frontend observable !!!
  usersSub: Subscription = new Subscription();


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
  ) {
    this.usersSub = this.subUsers();
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy() {
    this.usersSub.unsubscribe();
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
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Token ' + localStorage.getItem('token'))
    const resp = await lastValueFrom(this.http.get(url, {
      headers: headers 
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
  getUserById(id: number | 'guest'): AppUser {
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
}