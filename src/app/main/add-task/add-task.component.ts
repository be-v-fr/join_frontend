import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, ViewChild, OnDestroy, EventEmitter, inject } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormControl, FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { Task } from '../../../models/task';
import { ContactListItemComponent } from '../contacts/contact-list-item/contact-list-item.component';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';
import { TasksService } from '../../services/tasks.service';
import { ToastNotificationComponent } from '../../templates/toast-notification/toast-notification.component';
import { Router } from '@angular/router';
import { SlideComponent } from '../../templates/slide/slide.component';
import { CloseBtnComponent } from '../../templates/close-btn/close-btn.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent, ContactListItemComponent, PersonBadgeComponent, ToastNotificationComponent, CloseBtnComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent extends SlideComponent {
  formClick: Subject<void> = new Subject<void>();
  users: User[] = [];
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);
  @Input() task: Task = new Task('');
  dueTextInput: string = '';
  @Input() inOverlay: boolean = false;
  @Input() status: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  @ViewChild('subtask') subtaskRef!: ElementRef;
  showAssignedDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  showTaskAddedToast: boolean = false;
  @Output() cancelled = new EventEmitter<void>();
  error: string = '';


  constructor(private router: Router) {
    super();
  }

  override ngOnInit() {
    this.translated = this.inOverlay;
    super.ngOnInit();
    this.initAssigned();
    if (this.task.id == '') {
      this.task.status = this.status;
    }
    this.users = this.usersService.users;
  }

  dueToText(): string | undefined {
    if (this.task.due && this.task.due.length > 0) {
      const parts = this.task.due.split('-');
      const year = parts[0];
      let month: string | number = parseInt(parts[1]);
      let day: string | number = parseInt(parts[2]);
      month = (month < 10 ? '0' : '') + month;
      day = (day < 10 ? '0' : '') + day;
      return day + '/' + month + '/' + year;
    } else {
      return undefined;
    }
  }

  textToDue(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = target.value;
    if (value) {
      const parts = value.split('/');
      let day: string | number = parseInt(parts[0]);
      let month: string | number = parseInt(parts[1]);
      const year = parts[2];
      day = (day < 10 ? '0' : '') + day;
      month = (month < 10 ? '0' : '') + month;
      this.task.due = year + '-' + month + '-' + day;
    } else {
      this.task.due = '';
    }
  }

  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.task.prio != prio ? this.task.prio = prio : this.task.prio = null;
  }

  toggleDropdown(e: Event, name: 'assigned' | 'category') {
    e.stopPropagation();
    if (e.target != null) {
      (e.target as HTMLInputElement).blur();
    }
    switch (name) {
      case 'assigned':
        this.showAssignedDropdown = !this.showAssignedDropdown;
        break;
      case 'category':
        this.showCategoryDropdown = !this.showCategoryDropdown;
    }
  }

  initAssigned() {
    this.users.forEach(() => this.task.assigned.push(false));
  }

  toggleAssignment(index: number) {
    this.task.assigned[index] = !this.task.assigned[index];
  }

  setCategory(category: 'Technical Task' | 'User Story') {
    this.task.category = category;
  }

  addSubtask() {
    const name = this.subtaskRef.nativeElement.value;
    if (name) {
      let newSubtask: Subtask = {
        name: name,
        status: 'To do'
      };
      this.task.subtasks.push(newSubtask);
      this.subtaskRef.nativeElement.value = '';
    }
  }

  deleteSubtask(index: number) {
    this.task.subtasks.splice(index, 1);
  }

  handleGeneralClick() {
    this.showCategoryDropdown = false;
    this.showAssignedDropdown = false;
    this.formClick.next();
  }

  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      if (this.task.id == '') {
        this.tasksService.addTask(this.task);
        this.showTaskAddedToast = true;
        setTimeout(() => { this.inOverlay ? this.close() : this.router.navigate(['/board']) }, 700);
      } else {
        this.tasksService.updateTask(this.task);
        this.close()
      }
    }
  }

  close() {
    this.cancelled.emit();
  }
}