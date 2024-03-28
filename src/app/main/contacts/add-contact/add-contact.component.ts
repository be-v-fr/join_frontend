import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from '../contact-list-item/contact-icon/contact-icon.component';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, ContactIconComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  @Input() mode: 'add' | 'edit' = 'add'; 
  @Output() cancelOverlay = new EventEmitter<void>();

  cancel() {
    this.cancelOverlay.emit();
  }
}