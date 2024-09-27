import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBadgeComponent } from '../../../templates/person-badge/person-badge.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../../models/contact';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { SlideComponent } from '../../../templates/slide/slide.component';


/**
 * This component displays the "add contact" or "edit contact" form within an overlay.
 */
@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, PersonBadgeComponent, CloseBtnComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent extends SlideComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input('contact') inputContact: Contact = new Contact({});
  formData = new Contact({});
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() contactSubmission = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<void>();
  disableUserNameEdit: boolean = false;


  /**
   * Extend super class "ngOnInit()" method by form data initialization.
   * Also disable name editing in case the contact is another user (rather than a manually added contact),
   * which is marked by an existing Firebase user ID ("uid").
   */
  override ngOnInit() {
    super.ngOnInit();
    if (this.mode == 'edit') {
      this.formData = new Contact(this.inputContact.toJson());
      if (this.inputContact.isUser()) { this.disableUserNameEdit = true }
    }
  }


  /**
   * Submit form if valid by emitting he corresponding event to the parent component
   * @param form add/edit contact form
   */
  onSubmit(form: NgForm): void {
    if (form.submitted && form.form.valid) {
      this.contactSubmission.emit(this.formData);
    }
  }


  /**
   * Cancel this form/overlay with slide animation
   */
  cancel() {
    this.slideInOut();
    setTimeout(() => this.cancelOverlay.emit(), 125);
  }


  /**
   * Delete this contact.
   * The delete button is disabled if the contact is a user.
   */
  deleteContact() {
    this.delete.emit();
    this.cancel();
  }
}