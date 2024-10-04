import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { Router, RouterModule } from '@angular/router';
import { ArrowBackBtnComponent } from '../../templates/arrow-back-btn/arrow-back-btn.component';
import { ToastNotificationComponent } from '../../templates/toast-notification/toast-notification.component';


/**
 * This component displays the registration form for both logging in and signing up.
 * In each instance, the formMode can be switched using the "formMode" input.
 * If it is desired that the form data from one form mode is not kept in the other mode, each mode requires its own instance.  
 */
@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PasswordIconComponent, ArrowBackBtnComponent, ToastNotificationComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})

export class RegistrationFormComponent implements OnDestroy {
  @Input() formMode: 'Log in' | 'Sign up' = 'Log in';
  @Output() toggleMode = new EventEmitter<void>();
  passwordFieldType: 'password' | 'text' = 'password';
  passwordConfirmationFieldType: 'password' | 'text' = 'password';
  @ViewChild('passwordContainer') passwordContainerRef!: ElementRef;
  @ViewChild('passwordConfirmationContainer') passwordConfirmationContainerRef!: ElementRef;
  rememberLogIn: boolean;
  acceptPrivacyPolicy: boolean = false;
  formData = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };
  authError: string = '';
  private authService = inject(AuthService);
  private authSub = new Subscription;
  toastMsg: string = '';
  showToastMsg: boolean = false;


  /**
   * Initialize router and "remember me" feature; apply feature if applicable
   * @param router instance of Router
   */
  constructor(private router: Router) {
    this.rememberLogIn = this.authService.getLocalRememberMe();
    if (this.rememberLogIn) {
      console.log('remember login true. subbing auth...');
      this.authSub = this.subAuth()
    
    }
  }


  /**
   * Unsubscribe on destroy
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  /**
   * Subscribe to authService.user$ for form initialization and log in state check
   * @returns subscription
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      console.log('auth service fired', user);
      console.log('init form data and timeout...');
      this.initFormData();
      setTimeout(() => {
        console.log('timeout over, looking for UID...');
        if (this.authService.getCurrentUid()) {
          console.log('UID found');
          this.navigateToSummary() }
      }, 1200)
    });
  }


  /**
   * Initialize form data using authService
   */
  initFormData() {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.user.username) { this.formData['name'] = currentUser.user.username };
    if (currentUser && currentUser.user.email) { this.formData['email'] = currentUser.user.email };
  }


  /**
   * Switch form mode by emitting the corresponding event to the parent component.
   * Reset displayed form error messages in the process.
   */
  toggleModeEmit() {
    this.resetAuthError();
    this.toggleMode.emit();
  }


  /**
   * Toggle password visibility and re-focus the input field afterwards
   * @param field password/password confirmation field identifier
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
   * get input field HTML element from reference to parent element
   * @param containerRef reference to parent container
   * @returns corresponding input element
   */
  getFieldContainerRefInput(containerRef: ElementRef): HTMLInputElement {
    return containerRef.nativeElement.getElementsByTagName('input')[0];
  }


  /**
   * Focus the last position of input element
   * @param input password/password confirmation field identifier
   */
  focusLastCharacter(input: HTMLInputElement) {
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }


  /**
   * Toggle the type variable of a password input field 
   * @param type HTML type attribute value in input element
   * @returns attribute value after toggling
   */
  togglePasswordFieldType(type: 'password' | 'text') {
    return type == 'password' ? 'text' : 'password';
  }


  /**
   * Toggle "remember me" checkbox state variable
   */
  toggleRememberMe() {
    this.rememberLogIn = !this.rememberLogIn;
  }


  /**
   * Toggle "privacy policy" checkbox state variable
   */
  togglePrivacyPolicy() {
    this.acceptPrivacyPolicy = !this.acceptPrivacyPolicy;
  }


  /**
   * Submit registration form according to form mode
   * @param form registration form
   */
  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form)) {
      this.formMode == 'Log in' ? this.submitLogIn() : this.submitSignUp();
    }
  }


  /**
   * Check if registration form is valid, including custom password confirmation check
   * @param form registration form
   * @returns validation check result
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation();
  }


  /**
   * Check if both passwords match each other
   * @returns confirmation check result
   */
  checkPasswordConfirmation(): boolean {
    if (this.formMode == 'Log in') { return true }
    else { return this.formData.password == this.formData.passwordConfirmation }
  }


  /**
   * Get custom authentication error message to be displayed to user from automatic/default error message
   * @param err Firebase error message
   * @returns Custom error message
   */
  getAuthError(err: string) {
    if (err.includes('auth/invalid-credential')) { return 'invalid credential' }
    else if (err.includes('auth/email-already-in-use')) { return 'email in use' }
    else return ''
  }


  /**
   * Reset authentication error
   */
  resetAuthError() {
    this.authError = '';
  }


  /**
   * Submit form in log in mode (after automatic log out)
   */
  submitLogIn() {
    this.authService.logOut();
    this.logIn();
  }


  /**
   * Log in using the form data including error catching
   */
  logIn() {
    this.authService.setLocalRememberMe(this.rememberLogIn);
    this.authService.logIn(this.formData.name, this.formData.password)
      .then((resp: any) => this.onLogIn(resp))
      .catch((err) => this.authError = this.getAuthError(err.toString()));
  }


  onLogIn(response: any) {
    if (response.token) {
      localStorage.setItem('token', response.token);
      this.navigateToSummary();
      this.authService.initUser(response.appUser);
    }
  }


  /**
   * Sign up using the form data including error catching.
   * The user log in data is added to the Firebase authentication database (using authService).
   * On top of that, additional user data is stored in the Firestore (using usersService). 
   */
  submitSignUp() {
    if (this.acceptPrivacyPolicy) {
      this.authService.register(this.formData.name, this.formData.email, this.formData.password)
        .then(() => this.transferAfterSignUp())
        .catch((err) => {
          console.error(err);
          this.authError = this.getAuthError(err.toString())
        });
    }
  }


  /**
   * Transfer to log in form after signing up (including a toast notification)
   */
  transferAfterSignUp() {
    this.toastMsg = 'You signed up successfully';
    this.showToastMsg = true;
    setTimeout(() => this.toggleModeEmit(), 700);
  }


  /**
   * Navigate to main app content landing page
   */
  navigateToSummary() {
    this.router.navigate((['/summary']));
  }


  /**
   * This function handles the guest log in option
   */
  logInAsGuest() {
    this.authService.logInAsGuest()
      .then((resp: any) => this.onLogIn(resp))
      .catch((err) => this.authError = this.getAuthError(err.toString()));
  }


  /**
   * Send password reset email (including a toast notification)
   */
  sendPasswordResetEmail() {
    this.authService.resetPassword(this.formData.email).subscribe({
      next: () => this.toastNotificationWithReload('A reset link has been sent to your email address'),
      error: () => this.toastNotificationWithReload('Oops! An error occurred')
    });
  }


  /**
   * Show toast notification for 2s and reload page afterwards
   * @param msg notification content
   */
  toastNotificationWithReload(msg: string) {
    this.toastMsg = msg;
    this.showToastMsg = true;
    setTimeout(() => location.reload(), 2000);
  }
}