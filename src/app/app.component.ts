import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { User } from '../models/user';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

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
  private guestSub = new Subscription();

  currentUser: User | null | undefined = undefined;
  loggedIn: boolean = false;
  showHeaderDropdown: boolean = false;

  readonly MAIN_ROUTES = ['/summary', '/add_task', '/board', '/contacts'];
  readonly OTHER_ROUTES = ['/help', '/legal_notice', '/privacy_policy'];

  constructor(private router: Router) {
    this.subAuth();
  }

  ngOnDestroy(): void {
    this.guestSub.unsubscribe();
  }

  subAuth() {
    this.authService.user$.subscribe(() => {
      const uid = this.authService.getCurrentUid();
      if (uid) {
        this.currentUser = this.usersService.getUserByUid(uid);
        if (uid == 'guest') {
          this.guestSub = this.subGuestLogOut();
        }
        this.loggedIn = true;
        console.log(uid);
        console.log(this.usersService.getUserByUid(uid));
      } else {
        this.localLogOut()
      }
    });
  }

  subGuestLogOut(): Subscription {
    return this.authService.guestLogOut$.subscribe(() => this.localLogOut());
  }

  localLogOut() {
    this.currentUser = null;
    this.loggedIn = false;
    this.guestSub.unsubscribe();
  }

  getCurrentRoute(): string {
    return this.router.url;
  }

  onLogInPage(): boolean {
    return !(this.MAIN_ROUTES.includes(this.getCurrentRoute()) || this.OTHER_ROUTES.includes(this.getCurrentRoute()));
  }

  closeHeaderDropdown() {
    this.showHeaderDropdown = false;
  }
}
