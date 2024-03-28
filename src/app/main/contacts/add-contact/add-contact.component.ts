import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  @Output() cancelOverlay = new EventEmitter<void>();

  cancel() {
    this.cancelOverlay.emit();
  }
}