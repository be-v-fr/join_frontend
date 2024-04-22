import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { User } from '../models/user';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MenuComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  currentUser: User | null | undefined = undefined;
  loggedIn: boolean = false;
  showHeaderDropdown: boolean = false;

  readonly MAIN_ROUTES = ['/summary', '/add_task', '/board', '/contacts'];

  constructor(private router: Router) {
    this.authService.user$.subscribe(() => {
      const uid = this.authService.getCurrentUid();
      if (uid) {
        this.currentUser = this.usersService.getUserByUid(uid);
        this.loggedIn = true;
      } else {
        this.currentUser = null;
        this.router.navigate((['']));
      }
    });
  }

  getCurrentRoute() {
    return this.router.url;
  }

  closeHeaderDropdown() {
    this.showHeaderDropdown = false;
  }
}
