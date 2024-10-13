import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBadgeComponent } from '../../../templates/person-badge/person-badge.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../../models/contact';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { SlideComponent } from '../../../templates/slide/slide.component';
import { UsersService } from '../../../services/users.service';


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
  isUser: boolean = false;
  emailTaken: boolean = false;
  private usersService = inject(UsersService);


  /**
   * Extend super class "ngOnInit()" method by form data initialization.
   * Also disable name editing in case the contact is another user (rather than a manually added contact).
   */
  override ngOnInit() {
    super.ngOnInit();
    if (this.mode == 'edit') {
      this.formData = new Contact(this.inputContact.toJson());
      if (this.usersService.isUser(this.inputContact)) { this.isUser = true }
    }
  }


  /**
   * Submit form if valid by emitting he corresponding event to the parent component
   * @param form add/edit contact form
   */
  onSubmit(form: NgForm): void {
    if (form.submitted && form.form.valid) {
      if (this.isEmailTaken()) {
        this.emailTaken = true;
      } else {
        this.contactSubmission.emit(this.formData);
      }
    }
  }


  /**
   * Checks if the email address entered into the form is already taken in a meaningful sense.
   * For example, an email should not be considered taken when it was not changed at all. 
   * @returns {boolean} check result
   */
  isEmailTaken(): boolean {
    return this.formData.email != undefined &&
    this.formData.email != this.inputContact.email &&
    this.formData.email.length > 0 &&
    !this.usersService.isEmailAvailable(this.formData.email);
  }


  /**
   * Resets the emailTaken property to the default value (false).
   */
  resetEmailTaken(): void {
    this.emailTaken = false;
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