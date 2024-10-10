import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, ViewChild, AfterViewInit, EventEmitter, inject } from '@angular/core';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppUser } from '../../../models/app-user';
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
import { Subtask } from '../../../models/subtask';

/**
 * @component
 * This component displays the form to add or edit tasks.
 * It is one of the four main pages of the app but also appears within an overlay when called from the "board" page.
 */
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent, ContactListItemComponent, PersonBadgeComponent, ToastNotificationComponent, CloseBtnComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent extends SlideComponent implements AfterViewInit {
  formClick: Subject<void> = new Subject<void>();
  users: AppUser[] = [];
  private authService = inject(AuthService);
  public usersService = inject(UsersService);
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


  /**
   * Creates the router instance and calls the super constructor (from "SlideComponent").
   * @param {Router} router - An instance of Router.
   */
  constructor(private router: Router) {
    super();
  }


  /**
   * Overrides ngOnInit:
   * - Only translate form when it appears within an overlay.
   * - Initialize form data and users array.
   */
  override ngOnInit() {
    this.translated = this.inOverlay;
    super.ngOnInit();
    this.initFormData();
    this.users = this.usersService.users;
  }


  /**
   * Initializes form data and pre-fills the form if an input task is provided.
   */
  initFormData() {
    if (this.inputTask.id == -1) {
      this.formData.due = '';
      this.formData.status = this.tasksService.newTaskStatus;
    } else {
      this.formData = new Task(this.inputTask.toJson());
    }
  }


  /**
   * Checks if the running browser supports WebKit.
   * @returns {boolean} True if WebKit is supported, false otherwise.
   */
  isWebkitSupported(): boolean {
    return 'WebkitAppearance' in document.documentElement.style && !('MozAppearance' in document.documentElement.style);
  }


  /**
   * Sorts users alphabetically, but places the current user first in the list.
   */
  sortUsers() {
    this.users = this.users.sort((a: AppUser, b: AppUser) => a.user.username.toLowerCase() > b.user.username.toLowerCase() ? 1 : -1);
    this.putCurrentUserFirst();
  }


  /**
   * Shifts the current user to the first position in the users array.
   */
  putCurrentUserFirst() {
    if (this.authService.currentUser) {
      const index = this.users.indexOf(this.authService.currentUser);
      if (index != -1) {
        this.users.splice(index, 1)[0];
        this.users.unshift(this.authService.currentUser);
      }
    }
  }


  /**
   * Checks if the given user is the current logged-in user.
   * @param {AppUser} user - A User instance.
   * @returns {boolean} True if the user is the current user, false otherwise.
   */
  isCurrentUser(user: AppUser): boolean {
    return user.id == this.authService.getCurrentUid();
  }


  /**
   * Sets the minimum due date to today.
   */
  ngAfterViewInit() {
    const dueElement: HTMLInputElement = this.dueContainerRef.nativeElement.getElementsByTagName('input')[0];
    dueElement.min = new Date().toISOString().split("T")[0];
  }


  /**
   * Handles changes to the due text input field.
   * @param {Event} change - The input event.
   */
  textToDue(change: Event) {
    const target = change.target as HTMLInputElement;
    const value = target.value;
    if (value) { this.transformTextToDateInputFormat(value) }
    else { this.formData.due = '' }
    this.validateDate();
  }


  /**
   * Transforms the due date text input into a valid date format (YYYY-MM-DD).
   * @param {string} text - The due date text.
   */
  transformTextToDateInputFormat(text: string) {
    const parts = text.split('/');
    let day: string | number = parseInt(parts[0]);
    let month: string | number = parseInt(parts[1]);
    const year = parts[2];
    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
    this.formData.due = year + '-' + month + '-' + day;
  }


  /**
   * Validates the due date input and sets error messages accordingly.
   */
  validateDate() {
    this.dateError = '';
    const selected = new Date(this.formData.due);
    const current = new Date();
    if (selected.toString().includes('Invalid date') || this.formData.due == '' || !this.checkDueValidity()) {
      this.dateError = 'This is not a valid date.';
    } else if (selected < current) { this.dateError = 'Date lies in the past.' }
    else { this.dateError = null }
  }


  /**
   * Checks the validity of the due date input.
   * @returns {boolean} True if the due date is valid, false otherwise.
   */
  checkDueValidity(): Boolean {
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


  /**
   * Sets the priority of the task. Deselects if the same priority is clicked again.
   * @param {('Urgent' | 'Medium' | 'Low')} prio - The priority value.
   */
  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.formData.prio = (this.formData.prio == prio ? '' : prio);
  }


  /**
   * Opens or closes dropdowns based on the clicked form field.
   * @param {Event} ev - The click event.
   * @param {('assigned' | 'category')} name - The form field name.
   */
  toggleDropdown(ev: Event, name: 'assigned' | 'category') {
    this.handleToggleDropdownEvent(ev);
    this.toggleDropdownByName(name);
  }


  /**
   * Stops the event propagation and blurs the clicked element.
   * @param {Event} ev - The click event.
   */
  handleToggleDropdownEvent(ev: Event) {
    ev.stopPropagation();
    if (ev.target != null) (ev.target as HTMLInputElement).blur();
  }


  /**
   * Toggles the dropdown visibility for the given form field.
   * @param {('assigned' | 'category')} name - The form field name.
   */
  toggleDropdownByName(name: 'assigned' | 'category') {
    switch (name) {
      case 'assigned':
        this.showAssignedDropdown = !this.showAssignedDropdown;
        break;
      case 'category':
        this.showCategoryDropdown = !this.showCategoryDropdown;
    }
  }


  /**
   * Toggles the assignment of users to the task.
   * @param {number} uid - The User Firebase ID.
   */
  toggleAssignment(uid: number) {
    const assigned: number[] = this.formData.assigned;
    if (assigned.includes(uid)) {
      while (assigned.includes(uid)) {
        const index = assigned.indexOf(uid);
        assigned.splice(index, 1);
      }
    } else { assigned.push(uid) }
  }


  /**
   * Sets the task category.
   * @param {'Technical Task' | 'User Story'} category - The task category
   */
  setCategory(category: 'Technical Task' | 'User Story') {
    this.formData.category = category;
  }


  /**
   * Adds a new subtask to the task.
   * @param {NgForm} form - The Angular form.
   */
  async addSubtask(ev?: Event) {
    const input: HTMLInputElement = this.subtaskRef.nativeElement;
    if (ev && input == document.activeElement) { this.handleSubtaskEvent(ev, input) }
    if (input.value) {
      await this.pushSubtasks(input.value);
      this.scrollToBottom();
      input.value = '';
    }
  }


  /**
   * Prevent enter keydown from submitting the task form and abort input focus in case there is no value
   * @param enter enter keydown event
   * @param input subtask HTML input element
   */
  handleSubtaskEvent(enter: Event, input: HTMLInputElement) {
    enter.preventDefault();
    if (!input.value) { input.blur() }
  }


  /**
   * Push new subtask to form data subtasks array
   * @param title subtask name/task
   */
  async pushSubtasks(title: string) {
    if (!this.formData.subtasks) { this.formData.subtasks = [] }
    const arrayLength = this.formData.subtasks.length;
    this.formData.subtasks.push(new Subtask({
      task: this.formData.id,
      name: title,
      status: 'To do',
    }));
    await this.addSubtaskToBackend(this.formData.subtasks[arrayLength]);
  }


  /**
   * Adds subtask to the server database.
   * @param {Subtask} subtask - The subtask to add 
   */
  async addSubtaskToBackend(subtask: Subtask) {
    if (this.formData.id != -1) {
      await this.tasksService.addSubtask(subtask)
        .then((resp: any) => {
          if (this.formData.subtasks && resp.id) {
            this.formData.subtasks[this.formData.subtasks.length - 1].id = resp.id;
          }
        });
    }
  }


  /**
   * Scroll page or subtasks list to bottom, which implicitly depends on the screen resolution being used:
   * For bigger screens, the subtasks list is scrollable and the page is not;
   * for smaller screens, the page is scrollable but the subtasks list is not.
   */
  scrollToBottom() {
    if (this.formData.subtasks && this.formData.subtasks.length > 1) {
      const subtasksList = this.subtasksList.nativeElement;
      setTimeout(() => {
        this.inOverlay ? this.scrollService.scrollToBottom('overlayTaskForm') : this.scrollService.scrollToBottom('page');
        subtasksList.scrollTop = subtasksList.scrollHeight;
      }, 0);
    }
  }


  /**
   * Removes a subtask from the task.
   * @param {Subtask} subtask - The subtask to remove.
   */
  async deleteSubtask(index: number) {
    if (this.formData.subtasks) {
      if (this.formData.id != -1) {
        await this.tasksService.deleteSubtask(this.formData.subtasks[index].id);
      }
      this.formData.subtasks.splice(index, 1);
    }
  }


  /**
   * Updates the form data for an (edited) subtask.
   * @param {number} arrayIndex - The subtask's index in the subtasks array 
   * @param {Subtask} subtask - The edited subtask
   */
  onSubtaskEdit(arrayIndex: number, subtask: Subtask) {
    if (this.formData.subtasks) {
      this.formData.subtasks[arrayIndex] = subtask;
    }
  }


  /**
   * On click on task form, close dropdown menus and trigger "formClick" observable (which also affects the subtask component)
   */
  handleGeneralClick() {
    this.showCategoryDropdown = false;
    this.showAssignedDropdown = false;
    this.formClick.next();
  }


  /**
   * Submit task form, if valid
   * @param form task form
   */
  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      if (this.formData.id == -1) {
        this.tasksService.addTask(this.formData);
        this.showTaskAddedToast = true;
        setTimeout(() => { this.inOverlay ? this.close() : this.router.navigate(['/board']) }, 700);
      } else {
        this.tasksService.updateTask(this.formData);
        this.close();
      }
    }
  }


  /**
   * Close task form (only makes sense when appearing in overlay)
   */
  close() {
    this.cancelled.emit();
  }
}