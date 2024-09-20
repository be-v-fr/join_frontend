import { Component, inject, OnDestroy } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../services/tasks.service';
import { AuthService} from '../../services/auth.service';
import { StatsItemComponent } from './stats-item/stats-item.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';
import { CommonModule } from '@angular/common';
import { GreetingComponent } from './greeting/greeting.component';


/**
 * This component displays a statistical summary of the tasks in board-
 * It also displays a personalized greeting message.
 * In one-column layout, the greeting message is only visible as an introductory animation. 
 */
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, StatsItemComponent, HeadlineSloganComponent, GreetingComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnDestroy {
  private authService = inject(AuthService);
  unsubAuth;
  private tasksService = inject(TasksService);
  currentUserName: string | null = null;


  /**
   * Create subscription
   */
  constructor() {
    this.unsubAuth = this.subAuth;
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.unsubAuth();
  }


  /**
   * Subscribe to "authService.currentUser$" to retrieve and setuser name.
   * The user name is set to "null" in case guest log in is being used.
   * @returns subscription
   */
  subAuth() {
    return this.authService.currentUser$.subscribe(u => this.currentUserName = (u ? u.user.username : null));
  }


  /**
   * Get tasks filtered by status
   * @param status task status
   * @returns filtered tasks array
   */
  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done'): Task[] {
    return this.tasksService.getFilteredTasks(status);
  }


  /**
   * Get tasks filtered by "urgent" priority
   * @returns filtered tasks array
   */
  getUrgent(): Task[] {
    return this.tasksService.tasks.filter(t => t.prio == 'Urgent');
  }


  /**
   * Get total number of tasks in board
   * @returns number of tasks
   */
  getTaskNumber(): number {
    return this.tasksService.tasks.length;
  }


  /**
   * Among the tasks with "urgent" priority, get the closest deadline
   * @returns closest "due" value
   */
  getMostUrgent() {
    const urgentTasks: Task[] = this.getUrgent();
    if (urgentTasks.length == 0) {return ''}
    else {
      urgentTasks.sort((a, b) => {return a.due.localeCompare(b.due)});
      return urgentTasks[0].due;
    }
  }


  /**
   * Generate string from due value which writes out the month
   * @param due due value (as to be found as task property)
   * @returns date as string in the desired format
   */
  printDate(due: string): string {
    const date = new Date(due);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return month + ' ' + day + ', ' + year;
  }
}