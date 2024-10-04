import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { AppUser } from '../models/app-user';
import { TasksService } from './services/tasks.service';
import { ContactsService } from './services/contacts.service';
import { environment } from '../environments/environment.development';


/**
 * This is the app component created by Angular by default (but extended in many ways).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MenuComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'join';
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  private authSub = new Subscription();
  private guestSub = new Subscription();
  private usersSub = new Subscription();
  currentUser?: AppUser | null;
  loggedIn: boolean = false;
  showHeaderDropdown: boolean = false;
  private dataInitAfterAuthComplete: boolean = false;
  readonly MAIN_ROUTES = ['/summary', '/add_task', '/board', '/contacts'];
  readonly OTHER_ROUTES = ['/help', '/legal_notice', '/privacy_policy'];


  /**
   * Create instance of router and subscribe to authentication service.
   * Call landscape mode prevention for mobile devices.
   * @param router instance of Router
   */
  constructor(private router: Router) {
    this.authSub = this.subAuth();
  }


  ngOnInit(): void {
    this.authService.syncUser()
      .then(() => { })
      .catch(e => console.error(e));
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.guestSub.unsubscribe();
    this.usersSub.unsubscribe();
  }


  /**
   * Subscribe to authService.user$ to check log in state.
   * If a registered user is logged in, call subUsersInit() method.
   * If the user is logged in as guest, call subGuestLogOut() method.
   * @returns 
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(currentUser => {
      if (currentUser?.id) {
        this.currentUser = currentUser;
        this.loggedIn = true;
        if (!this.dataInitAfterAuthComplete) {
          this.usersService.init();
          this.tasksService.init();
          this.contactsService.syncContacts();
          this.dataInitAfterAuthComplete = true;
        }
      } else { this.localLogOut() }
    });
  }


  /**
   * Fit log in state properties to logging out.
   */
  localLogOut() {
    this.currentUser = null;
    this.loggedIn = false;
    this.dataInitAfterAuthComplete = false;
    this.guestSub.unsubscribe();
  }


  /**
   * Get current route from router
   * @returns current URL
   */
  getCurrentRoute(): string {
    return this.router.url;
  }


  /**
   * Check if the current route is not included in app/main and app/other component routes.
   * @returns check result
   */
  onLogInPage(): boolean {
    return !(this.MAIN_ROUTES.includes(this.getCurrentRoute()) || this.OTHER_ROUTES.includes(this.getCurrentRoute()));
  }


  /**
   * Close header dropdown menu by setting the corresponding property
   */
  closeHeaderDropdown() {
    this.showHeaderDropdown = false;
  }
}
