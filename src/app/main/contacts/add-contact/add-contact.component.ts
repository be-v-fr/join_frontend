import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBadgeComponent } from '../../../templates/person-badge/person-badge.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../../models/contact';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { SlideComponent } from '../../../templates/slide/slide.component';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, PersonBadgeComponent, CloseBtnComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent extends SlideComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() contact: Contact = new Contact('');
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() contactSubmission = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<void>();
  disableUserNameEdit: boolean = false;

  override ngOnInit() {
    super.ngOnInit();
    if (this.contact.uid && this.contact.uid.length > 0) {this.disableUserNameEdit = true}
  }

  onSubmit(form: NgForm): void {
    if (form.submitted && form.form.valid) {
      this.contactSubmission.emit(this.contact);
    }
  }

  cancel() {
    this.slideInOut();
    setTimeout(() => this.cancelOverlay.emit(), 125);
  }

  deleteContact() {
    this.delete.emit();
    this.cancel();
  }
}