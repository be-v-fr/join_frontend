import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  currentUser: User | null | undefined = undefined;

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
}
