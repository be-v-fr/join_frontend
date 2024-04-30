import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { User } from '../../../models/user';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


/**
 * This component displays the header.
 * It contains a badge for the active user and a dropdown menu for secondary navigation and logging out.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PersonBadgeComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() currentUser: User | null | undefined = undefined;
  @Input() displayDropdown: boolean = false;
  @Output() updateDropdown = new EventEmitter<boolean>();
  private authService = inject(AuthService);
  private router = inject(Router); 


  /**
   * Toggle dropdown menu and emit corresponding event to parent component
   */
  toggleDropdown() {
    this.displayDropdown = !this.displayDropdown;
    this.updateDropdown.emit(this.displayDropdown);
  }


  /**
   * Log out via "authService" and navigate to landing page
   */
  logOut() {
    this.authService.logOut();
    this.router.navigate((['']));
  }
}
