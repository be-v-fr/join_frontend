import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, ViewChild, AfterViewInit, OnDestroy, EventEmitter, inject } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
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
export class AddTaskComponent extends SlideComponent implements AfterViewInit {
  formClick: Subject<void> = new Subject<void>();
  users: User[] = [];
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);
  @Input() task: Task = new Task('');
  dueTextInput: string = '';
  @Input() inOverlay: boolean = false;
  @Input() status: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  @ViewChild('content') contentRef!: ElementRef;
  @ViewChild('dueContainer') dueContainerRef!: ElementRef;
  @ViewChild('subtask') subtaskRef!: ElementRef;
  showAssignedDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  showTaskAddedToast: boolean = false;
  @Output() cancelled = new EventEmitter<void>();
  dateError: string | null = null;

  constructor(private router: Router) {
    super();
  }

  override ngOnInit() {
    this.translated = this.inOverlay;
    super.ngOnInit();
    if (this.task.id == '') {
      this.task.due = '';
      this.task.status = this.status;
    }
    this.initUsers();
  }

  initUsers() {
    this.updateUsers();
    this.usersService.getUsers().subscribe(() => this.updateUsers());
  }

  updateUsers() {
    this.users = this.usersService.users;
    console.log(this.users);
    this.sortUsers();
  }

  sortUsers() {
    const uid = this.authService.getCurrentUid();
    this.users = this.users.sort((a: User, b: User) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    if(uid && uid != 'guest') {
      const current = this.usersService.getUserByUid(uid);
      const index = this.users.indexOf(current);
      this.users.splice(index, 1)[0];
      this.users.unshift(current);
    }
    console.log(this.users);
  }

  isCurrentUser(user: User): boolean {
    return user.uid == this.authService.getCurrentUid();
  }

  ngAfterViewInit() {
    const dueElement: HTMLInputElement = this.dueContainerRef.nativeElement.getElementsByTagName('input')[0];
    dueElement.min = new Date().toISOString().split("T")[0];
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
    this.validateDate();
  }

  validateDate() {
    this.dateError = '';
    const selected = new Date(this.task.due);
    const current = new Date();
    if (selected.toString().includes('Invalid date') || this.task.due == '' || !this.validDueString()) {
      this.dateError = 'This is not a valid date.';
    } else if (selected < current) {
      this.dateError = 'Date lies in the past.';
    } else {
      this.dateError = null;
    }
  }

  validDueString() {
    const parts = this.task.due.split('-');
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.match(/^[0-9]+$/) == null) {
        this.task.due = '';
        return false
      }
    }
    return true
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

  toggleAssignment(uid: string) {
    const assigned: string[] = this.task.assigned;
    if(assigned.includes(uid)) {
      while(assigned.includes(uid)) {
        const index = assigned.indexOf(uid);
        assigned.splice(index, 1);
      }
    } else {
      assigned.push(uid);
    }
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
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const formElement: HTMLElement = this.contentRef.nativeElement.getElementsByTagName('form')[0];
      formElement.scrollTop = formElement.scrollHeight;
    }, 0);

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