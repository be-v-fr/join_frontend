import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { MainService } from './shared/main.service';
import { Subscription } from 'rxjs';
import { Task } from '../models/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MenuComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  tasks: Task[] = [];

  constructor(private router: Router, private mainService: MainService ) {
    mainService.taskSubmitted$.subscribe(
      (task: Task) => {
        console.log('Task added!');
        console.log(task);
      } 
    )
  }

  getCurrentRoute() {
    return this.router.url;
  }
}
