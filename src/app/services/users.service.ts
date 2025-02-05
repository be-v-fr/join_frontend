import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subject } from 'rxjs';
import { AppUser } from '../../models/app-user';
import { environment } from "../../environments/environment.development";
import { Contact } from "../../models/contact";


/**
 * This injectable handles generic users operations.
 * POST / ADD only via registration
 */
@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private USERS_URL = environment.BASE_URL + 'auth/users/';
  public eventSource?: EventSource;
  users: AppUser[] = [];
  users$: Subject<void> = new Subject<void>();


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
  ) { }


  /**
   * Initialize user data streaming.
   * Sets up a connection to listen for user-related server-sent events to keep the list of users in sync.
   */
  init() {
    this.eventSource = new EventSource(this.USERS_URL + 'stream/');
    this.eventSource.onmessage = () => this.syncRegisteredUsers();
    this.syncRegisteredUsers();
  }


  /**
   * Synchronize the list of registered users with the backend.
   * Fetches all registered users from the server and updates the local user list.
   * Only users with a valid email address are added to the list.
   * @returns A Promise that resolves when the users have been synchronized.
   */
  async syncRegisteredUsers(): Promise<void> {
    const url = this.USERS_URL;
    const resp = await lastValueFrom(this.http.get(url));
    this.users = [];
    (resp as Array<any>).forEach(uData => {
      if (uData.user.email && uData.user.email.slice(-9) != 'token.key') {
        this.users.push(new AppUser(uData));
      }
    });
    this.users$.next();
  }


  /**
   * Retrieve a complete app user object from app user ID
   * @param id app user ID
   * @returns app user object
   */
  getUserByAppId(id: number): AppUser {
    let user = new AppUser({});
    this.users.forEach(u => {
      if (u.id == id) { user = u }
    });
    return user;
  }


  /**
   * Retrieve a complete app user object from auth user ID
   * @param id auth user ID
   * @returns app user object
   */
  getUserByAuthId(id: number): AppUser {
    let user = new AppUser({});
    this.users.forEach(u => {
      if (u.user.id == id) { user = u }
    });
    return user;
  }



  /**
   * Check if an email address is available for registration.
   * @param email The email address to check.
   * @returns `true` if the email is available, `false` if it is already in use by a registered user.
   */
  isEmailAvailable(email: string): boolean {
    if (this.users.find(u => u.user.email == email)) { return false }
    return true;
  }
}