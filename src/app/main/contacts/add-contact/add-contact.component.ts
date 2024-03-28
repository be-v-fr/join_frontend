import { Component, Output, EventEmitter } from '@angular/core';
import { ContactIconComponent } from '../contact-list-item/contact-icon/contact-icon.component';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [ContactIconComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  @Output() cancelOverlay = new EventEmitter<void>();

  cancel() {
    this.cancelOverlay.emit();
  }
}