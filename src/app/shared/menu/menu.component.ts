import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';


/**
 * This component displays the primary menu.
 * It is supposed to be constantly visible when the user is logged in.
 */
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {


  /**
   * Create router instance
   * @param router instance of Router
   */
  constructor(private router: Router ) {}


  /**
   * Get current router route
   * @returns current url
   */
  getCurrentRoute() {
    return this.router.url;
  }
}
