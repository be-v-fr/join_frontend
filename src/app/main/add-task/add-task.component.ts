import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { Task } from '../../../models/task';
import { ContactListItemComponent } from '../contacts/contact-list-item/contact-list-item.component';
import { ContactIconComponent } from '../contacts/contact-list-item/contact-icon/contact-icon.component';
import { MainService } from '../../shared/main.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent, ContactListItemComponent, ContactIconComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  formClick: Subject<void> = new Subject<void>();
  users: User[] = [
    new User('test 1', 'email 1', 'password 1'),
    new User('test 2', 'email 2', 'password 2'),
  ];
  @Input() task: Task = new Task('');
  @ViewChild('subtask') subtaskRef!: ElementRef;
  showAssignedDropdown: boolean = false;
  showCategoryDropdown: boolean = false;

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.initAssigned();
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
    this.mainService.submitTask(this.task);
  }
}
