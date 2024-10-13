import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../../models/app-user';


/**
 * This component displays a personalized greeting formula to the user, which also corresponds the time of day. 
 */
@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.scss'
})
export class GreetingComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  authSub = new Subscription();
  currentUserName: string | null = null;


  /**
   * Sets up username initialization. Performs a subscription to consider
   * the case that the username * has not yet been loaded into the
   * authentication service upon component initialization.
   */
  ngOnInit(): void {
    this.initUsername(this.authService.currentUser);
    this.authSub = this.authService.currentUser$.subscribe((u: AppUser | null) => this.initUsername(u));
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  /**
   * Initializes the username. The local user name is set to "null"
   * in case guest log in is being used.
   * @param {AppUser | null} currentUser - The currently active app user 
   */
  initUsername(currentUser: AppUser | null): void {
    if (currentUser && currentUser.user.email.slice(-9) != 'token.key') {
      this.currentUserName = currentUser.user.username;
    } else {
      this.currentUserName = null;
    }
  }


  /**
   * Generate greeting by time of day and user name
   * @returns greeting formula (does not yet include actual user name)
   */
  getGreeting(): string {
    const currentHour = new Date().getHours();
    let greeting: string = '';
    if(currentHour < 4) {greeting = 'Good evening'}
    else if(currentHour < 11) {greeting = 'Good morning'}
    else if(currentHour < 18) {greeting = 'Good day'}
    else {greeting = 'Good evening'}
    if(this.currentUserName) {
      return greeting + ',';
    } else {
      return greeting + '!';      
    }
  }
}
