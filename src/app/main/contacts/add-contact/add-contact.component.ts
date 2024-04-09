import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBadgeComponent } from '../../../templates/person-badge/person-badge.component';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../../../models/contact';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, PersonBadgeComponent, CloseBtnComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() contact: Contact = new Contact('');
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() afterSubmit = new EventEmitter<Contact>();

  onSubmit(e: Event): void {
    e.preventDefault();
    this.afterSubmit.emit(this.contact);
  }

  cancel() {
    this.cancelOverlay.emit();
  }
}