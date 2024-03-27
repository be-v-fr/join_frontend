import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { User } from '../../../models/user';
import { Task } from '../../../models/task';
import { ContactListItemComponent } from '../contacts/contact-list-item/contact-list-item.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent, ContactListItemComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  formClick: Subject<void> = new Subject<void>();
  assigned: User[] = [
      new User('test 1', 'email 1', 'password 1'),
      new User('test 2', 'email 2', 'password 2'),
  ];
  prio: 'Urgent' | 'Medium' | 'Low' | null = 'Medium';
  category: 'Technical Task' | 'User Story' | null = null;
  @ViewChild('subtask') subtaskRef!: ElementRef;
  subtasks: Subtask[] = [
    {
      name: 'test 1',
      status: 'To do'
    },
    {
      name: 'test 2',
      status: 'To do'
    },
    {
      name: 'test 3',
      status: 'To do'
    }
  ];
  showAssignedDropdown: boolean = false;
  showCategoryDropdown: boolean = false;

  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.prio != prio ? this.prio = prio : this.prio = null;
  }

  toggleDropdown(e: Event, name: 'assigned' | 'category') {
    e.stopPropagation();
    if (e.target != null) {
      (e.target as HTMLInputElement).blur();
    }
    switch(name) {
      case 'assigned':
        this.showAssignedDropdown = !this.showAssignedDropdown;
        break;
      case 'category':
        this.showCategoryDropdown = !this.showCategoryDropdown;
    }
  }

  setCategory(category: 'Technical Task' | 'User Story') {
    this.category = category;
  }

  addSubtask() {
    const name = this.subtaskRef.nativeElement.value;
    if (name) {
      let newSubtask: Subtask = {
        name: name,
        status: 'To do'
      };
      this.subtasks.push(newSubtask);
      this.subtaskRef.nativeElement.value = '';
    }
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  handleGeneralClick() {
    this.showCategoryDropdown = false;
    this.showAssignedDropdown = false;
    this.formClick.next();
  }
}
