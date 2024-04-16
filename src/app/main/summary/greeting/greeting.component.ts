import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.scss'
})
export class GreetingComponent implements OnInit {
  private authService = inject(AuthService);
  currentUserName: string | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserName = user.displayName;
      } else {
        this.currentUserName = null;
      }
    });
  }

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
