import { Component, inject, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { User } from '../models/user';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';


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
export class AppComponent implements OnDestroy {
  title = 'join';
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private authSub = new Subscription();
  private guestSub = new Subscription();
  private usersSub = new Subscription();
  currentUser: User | null | undefined = undefined;
  loggedIn: boolean = false;
  showHeaderDropdown: boolean = false;
  readonly MAIN_ROUTES = ['/summary', '/add_task', '/board', '/contacts'];
  readonly OTHER_ROUTES = ['/help', '/legal_notice', '/privacy_policy'];


  /**
   * Create instance of router and subscribe to authentication service.
   * Call landscape mode prevention for mobile devices.
   * @param router instance of Router
   */
  constructor(private router: Router) {
    this.authSub = this.subAuth();
    this.preventLandscape();
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
    return this.authService.user$.subscribe(() => {
      const uid = this.authService.getCurrentUid();
      if (uid) {
        this.currentUser = this.usersService.getUserByUid(uid);
        this.usersSub = this.subUsersInit(uid);
        if (uid == 'guest') { this.guestSub = this.subGuestLogOut() }
        this.loggedIn = true;
      } else { this.localLogOut() }
    });
  }


  /**
   * Subscribe to usersService.user$ to retrieve detailed user data from usersService/Firestore
   * @param uid Firebase user ID 
   * @returns subscription
   */
  subUsersInit(uid: string): Subscription {
    return this.usersService.users$.subscribe(() => {
      this.currentUser = this.usersService.getUserByUid(uid)
    });
  }


  /**
   * Subscribe to authService.guestLogOut$ to enable reaction to logging out when logged in as guest.
   * @returns subscription
   */
  subGuestLogOut(): Subscription {
    return this.authService.guestLogOut$.subscribe(() => this.localLogOut());
  }


  /**
   * Fit log in state properties to logging out.
   */
  localLogOut() {
    this.currentUser = null;
    this.loggedIn = false;
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


  /**
   * Prevent landscape mode on orientation change
   */
  preventLandscape() {
    const body: HTMLElement = document.getElementsByTagName('body')[0];
    if (screen.orientation) {
      screen.orientation.addEventListener("change", () => {
        if ((screen.orientation.type === "portrait-primary" || screen.orientation.type === "portrait-secondary") || window.innerWidth > 1024) {
          body.style.transform = "rotate(0)";
        } else if ((screen.orientation.type === "landscape-primary" || screen.orientation.type === "landscape-secondary") && window.innerWidth <= 1024) {
          body.style.transform = "rotate(90deg)";
        }
      });
      window.addEventListener("resize", () => {if(body.style.transform && window.innerWidth > 1024) {body.style.transform = "rotate(0)"}});
    }
  }
}
