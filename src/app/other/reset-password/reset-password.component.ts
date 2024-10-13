import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { ToastNotificationComponent } from '../../templates/toast-notification/toast-notification.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';


/**
 * This component displays a reset password form.
 * The component requires a reset password token (named "token") to be read from the route parameters.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PasswordIconComponent, ToastNotificationComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordFieldType: 'password' | 'text' = 'password';
  passwordConfirmationFieldType: 'password' | 'text' = 'password';
  @ViewChild('passwordContainer') passwordContainerRef!: ElementRef;
  @ViewChild('passwordConfirmationContainer') passwordConfirmationContainerRef!: ElementRef;
  formData = {
    password: '',
    passwordConfirmation: ''
  };
  token: string | null = null;
  authError: string = '';
  showToastMsg: boolean = false;
  paramSub = new Subscription();


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }


  /**
   * Retrieves the reset password token from the URL/route.
   */
  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      this.paramSub.unsubscribe();
    });
  }


  /**
   * Toggle password visibility and re-focus the input field afterwards.
   * @param {'password' | 'confirmation'} field - The password or confirmation field identifier
   */
  toggleVisibility(field: 'password' | 'confirmation') {
    if (field == 'password' && this.formData.password.length > 0) {
      this.passwordFieldType = this.togglePasswordFieldType(this.passwordFieldType);
      this.focusLastCharacter(this.getFieldContainerRefInput(this.passwordContainerRef));
    } else if (this.formData.passwordConfirmation.length > 0) {
      this.passwordConfirmationFieldType = this.togglePasswordFieldType(this.passwordConfirmationFieldType);
      this.focusLastCharacter(this.getFieldContainerRefInput(this.passwordConfirmationContainerRef));
    }
  }


  /**
   * Get the input field HTML element from the reference to the parent element.
   * @param {ElementRef} containerRef - Reference to the parent container
   * @returns {HTMLInputElement} The corresponding input element
   */
  getFieldContainerRefInput(containerRef: ElementRef): HTMLInputElement {
    return containerRef.nativeElement.getElementsByTagName('input')[0];
  }


  /**
   * Focus the last position of the input element.
   * @param {HTMLInputElement} input - The input field
   */
  focusLastCharacter(input: HTMLInputElement) {
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }


  /**
   * Toggle the type variable of a password input field.
   * @param {'password' | 'text'} type - The HTML type attribute value in the input element
   * @returns {'password' | 'text'} The toggled attribute value
   */
  togglePasswordFieldType(type: 'password' | 'text') {
    return type == 'password' ? 'text' : 'password';
  }


  /**
   * Submit the registration form according to the current form mode.
   * @param {NgForm} form - The registration form
   */
  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form) && this.token) {
      this.authService.resetPassword(this.formData.password, this.token)
        .then((resp: any) => {console.log(resp); this.transferAfterReset()})
        .catch((err) => this.authError = 'Oops! Something went wrong');
    }
  }


  /**
   * Check if the registration form is valid, including custom password confirmation validation.
   * @param {NgForm} form - The registration form
   * @returns {boolean} Validation check result
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation();
  }


  /**
   * Check if both passwords match each other.
   * @returns {boolean} Password confirmation check result
   */
  checkPasswordConfirmation(): boolean {
    return this.formData.password == this.formData.passwordConfirmation
  }


  /**
   * Transfer to the login form after resetting the password, displaying a toast notification.
   */
  transferAfterReset() {
    this.showToastMsg = true;
    setTimeout(() => this.router.navigate(['']), 700);
  }
}
