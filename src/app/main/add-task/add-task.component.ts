import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { Task } from '../../../models/task';
import { ContactListItemComponent } from '../contacts/contact-list-item/contact-list-item.component';
import { ContactIconComponent } from '../contacts/contact-list-item/contact-icon/contact-icon.component';
import { TasksService } from '../../shared/tasks.service';
import { ToastNotificationComponent } from '../../templates/toast-notification/toast-notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent, ContactListItemComponent, ContactIconComponent, ToastNotificationComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  formClick: Subject<void> = new Subject<void>();
  users: User[] = [
    new User('test 1', 'id 1'),
    new User('test 2', 'id 2'),
  ];
  @Input() task: Task = new Task('');
  @Input() inOverlay: boolean = false;
  @Input() status: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  @ViewChild('subtask') subtaskRef!: ElementRef;
  showAssignedDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  showTaskAddedToast: boolean = false;
  @Output() cancelled = new EventEmitter<void>();


  constructor(private router: Router, private tasksService: TasksService) {
  }

  ngOnInit() {
    this.initAssigned();
    if(this.task.id == '') {
      this.task.status = this.status;
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

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.task.id == '') {
      this.tasksService.addTask(this.task);
      this.showTaskAddedToast = true;
      setTimeout(() => { this.inOverlay ? this.close() : this.router.navigate(['/board']) }, 700);
    } else {
      this.tasksService.updateTask(this.task);
      this.close()
    }
  }

  close() {
    this.cancelled.emit();
  }
}