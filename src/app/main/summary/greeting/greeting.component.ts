import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';


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
   * Subscribe to "authService.currentUser$" to retrieve user name.
   * The local user name is set to "null" in case guest log in is being used.
   */
  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe(u => {
      if (u && u.user.email.length > 0) {
        this.currentUserName = u.user.username;
      } else {
        this.currentUserName = null;
      }
    });
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
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
