import { Component, inject, Input, OnInit } from '@angular/core';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      const uid = this.authService.getCurrentUid();
      if (user && uid) {
        this.usersService.getCurrentUsers().subscribe(() => {
          const userData: User = this.usersService.getUserByUid(uid);
          this.currentUser = userData;
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  getCurrentRoute() {
    return this.router.url;
  }
}
