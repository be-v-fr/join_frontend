import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, ViewChild, AfterViewInit, OnDestroy, EventEmitter, inject } from '@angular/core';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { AutoscrollService } from '../../services/autoscroll.service';
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
  private scrollService = inject(AutoscrollService);
  @Input('task') inputTask: Task = new Task('');
  @Input() formData: Task = new Task('');
  dueTextInput: string = '';
  @Input() inOverlay: boolean = false;
  @ViewChild('content') contentRef!: ElementRef;
  @ViewChild('dueContainer') dueContainerRef!: ElementRef;
  @ViewChild('subtask') subtaskRef!: ElementRef;
  @ViewChild('subtasksList') subtasksList!: ElementRef
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
    this.initFormData();
    this.users = this.usersService.users;
  }

  initFormData() {
    if (this.inputTask.id == '') {
      this.formData.due = '';
      this.formData.status = this.tasksService.newTaskStatus;
    } else {
      this.formData = this.tasksService.setTaskObject(this.inputTask, this.inputTask.id);
    }
  }

  sortUsers() {
    this.users = this.users.sort((a: User, b: User) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    this.putCurrentUserFirst();
  }

  putCurrentUserFirst() {
    const uid = this.authService.getCurrentUid();
    if (uid && uid != 'guest') {
      const current = this.usersService.getUserByUid(uid);
      const index = this.users.indexOf(current);
      this.users.splice(index, 1)[0];
      this.users.unshift(current);
    }
  }

  isCurrentUser(user: User): boolean {
    return user.uid == this.authService.getCurrentUid();
  }

  ngAfterViewInit() {
    const dueElement: HTMLInputElement = this.dueContainerRef.nativeElement.getElementsByTagName('input')[0];
    dueElement.min = new Date().toISOString().split("T")[0];
  }

  textToDue(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = target.value;
    if (value) {this.transformTextToDateInputFormat(value)}
    else {this.formData.due = ''}
    this.validateDate();
  }

  transformTextToDateInputFormat(text: string) {
    const parts = text.split('/');
    let day: string | number = parseInt(parts[0]);
    let month: string | number = parseInt(parts[1]);
    const year = parts[2];
    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
    this.formData.due = year + '-' + month + '-' + day;
  }

  validateDate() {
    this.dateError = '';
    const selected = new Date(this.formData.due);
    const current = new Date();
    if (selected.toString().includes('Invalid date') || this.formData.due == '' || !this.checkDueValidity()) {
      this.dateError = 'This is not a valid date.';
    } else if (selected < current) {
      this.dateError = 'Date lies in the past.';
    } else {
      this.dateError = null;
    }
  }

  checkDueValidity() {
    const parts = this.formData.due.split('-');
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.match(/^[0-9]+$/) == null) {
        this.formData.due = '';
        return false
      }
    }
    return true
  }

  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.formData.prio != prio ? this.formData.prio = prio : this.formData.prio = null;
  }

  toggleDropdown(ev: Event, name: 'assigned' | 'category') {
    this.handleToggleDropdownEvent(ev);
    this.toggleDropdownByName(name);
  }

  handleToggleDropdownEvent(ev: Event) {
    ev.stopPropagation();
    if (ev.target != null) (ev.target as HTMLInputElement).blur();
  }

  toggleDropdownByName(name: 'assigned' | 'category') {
    switch (name) {
      case 'assigned':
        this.showAssignedDropdown = !this.showAssignedDropdown;
        break;
      case 'category':
        this.showCategoryDropdown = !this.showCategoryDropdown;
    }
  }

  toggleAssignment(uid: string) {
    const assigned: string[] = this.formData.assigned;
    if (assigned.includes(uid)) {
      while (assigned.includes(uid)) {
        const index = assigned.indexOf(uid);
        assigned.splice(index, 1);
      }
    } else {assigned.push(uid)}
  }

  setCategory(category: 'Technical Task' | 'User Story') {
    this.formData.category = category;
  }

  addSubtask(ev?: Event) {
    const input: HTMLInputElement = this.subtaskRef.nativeElement;
    if (ev && input == document.activeElement) {this.handleSubtaskEvent(ev, input)}
    if (input.value) {
      this.pushSubtasks(input.value);
      input.value = '';
      this.scrollToBottom();
    }
  }

  handleSubtaskEvent(ev: Event, input: HTMLInputElement) {
    ev.preventDefault();
    if (!input.value) { input.blur() }
  }

  pushSubtasks(title: string) {
    this.formData.subtasks.push({
      name: title,
      status: 'To do'
    });
  }

  scrollToBottom() {
    const subtasksList = this.subtasksList.nativeElement;
    setTimeout(() => {
      this.scrollService.scrollToBottom('page');
      subtasksList.scrollTop = subtasksList.scrollHeight;
    }, 0);
  }

  deleteSubtask(index: number) {
    this.formData.subtasks.splice(index, 1);
  }

  handleGeneralClick() {
    this.showCategoryDropdown = false;
    this.showAssignedDropdown = false;
    this.formClick.next();
  }

  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      if (this.formData.id == '') {
        this.tasksService.addTask(this.formData);
        this.showTaskAddedToast = true;
        setTimeout(() => { this.inOverlay ? this.close() : this.router.navigate(['/board']) }, 700);
      } else {
        this.tasksService.updateTask(this.formData);
        this.close()
      }
    }
  }

  close() {
    this.cancelled.emit();
  }
}