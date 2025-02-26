import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArrowBackBtnComponent } from '../../templates/arrow-back-btn/arrow-back-btn.component';
import { ToastNotificationComponent } from '../../templates/toast-notification/toast-notification.component';

/**
 * @component
 * This component displays the registration form for both logging in and signing up.
 * The form mode can be switched using the "formMode" input.
 * If it's required that the form data from one form mode is not retained in the other mode,
 * each mode needs its own instance.
 */
@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PasswordIconComponent, ArrowBackBtnComponent, ToastNotificationComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  @Input() formMode: 'Log in' | 'Sign up' = 'Log in';
  @Output() toggleMode = new EventEmitter<void>();
  passwordFieldType: 'password' | 'text' = 'password';
  passwordConfirmationFieldType: 'password' | 'text' = 'password';
  @ViewChild('form') formRef!: ElementRef<HTMLFormElement> 
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
  public authService = inject(AuthService);
  private authSub = new Subscription;
  private paramSub = new Subscription;
  toastMsg: string = '';
  showToastMsg: boolean = false;
  loading: boolean = false;
  activatingAccount: boolean = false;


  /**
   * Initialize router and "remember me" feature; apply feature if applicable.
   * @param {Router} router - Instance of Router
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rememberLogIn = this.authService.getLocalRememberMe();
    if (this.rememberLogIn) { this.authSub = this.subAuth() }
  }


  /**
   * Subscribes to route parameters to check for an account activation token.
   */
  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const token: string | null = params.get('activation_token');
      if (token) {
        this.activateAccount(token);
        this.paramSub.unsubscribe();
      }
    });
  }


  /**
   * Unsubscribe from the subscription when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.paramSub.unsubscribe();
  }


  /**
   * Subscribe to authService.user$ for form initialization and login state check.
   * @returns {Subscription} subscription
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      this.initFormData();
      setTimeout(() => {
        if (this.authService.getCurrentUid()) { this.navigateToSummary() }
      }, 1200)
    });
  }


  /**
   * Initialize form data using authService.
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
   * Toggle "remember me" checkbox state variable.
   */
  toggleRememberMe() {
    this.rememberLogIn = !this.rememberLogIn;
  }


  /**
   * Toggle "privacy policy" checkbox state variable.
   */
  togglePrivacyPolicy() {
    this.acceptPrivacyPolicy = !this.acceptPrivacyPolicy;
  }


  /**
   * Submit the registration form according to the current form mode.
   * @param {NgForm} form - The registration form
   */
  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form)) {
      this.formMode == 'Log in' ? this.submitLogIn() : this.submitSignUp();
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
    if (this.formMode == 'Log in') { return true }
    else { return this.formData.password == this.formData.passwordConfirmation }
  }


  /**
   * Get a custom authentication error message based on the server error.
   * @param {any} err - Server error object
   * @returns {string} Custom error message
   */
  getAuthError(err: any) {
    this.loading = false;
    console.error(err);
    if (err.error) {
      if (err.error.username) { return err.error.username[0] }
      if (err.error.email) { return err.error.email }
      if (err.error.non_field_errors) { return err.error.non_field_errors[0] }
      if (err.error.token) { return this.authService.activationTokenErrorMsg }
    }
    if (err == this.authService.timeoutErrorMsg) { return this.authService.timeoutErrorMsg }
    else return '';
  }


  /**
   * Reset the authentication error message.
   */
  resetAuthError() {
    this.authError = '';
  }


  /**
   * Submit the form in login mode (after automatic logout).
   */
  submitLogIn() {
    this.authService.logOut();
    this.logIn();
  }


  /**
   * Log in using the form data, including error handling.
   */
  logIn() {
    this.loading = true;
    this.authService.setLocalRememberMe(this.rememberLogIn);
    this.authService.logIn(this.formData.email, this.formData.password)
      .then((resp: any) => this.onLogIn(resp))
      .catch((err) => this.authError = this.getAuthError(err));
  }


  /**
   * Handle the login response.
   * @param {any} response - The login response
   */
  onLogIn(response: any) {
    if (response.token) {
      localStorage.setItem('token', response.token);
      this.authService.syncUser()
        .then(() => this.navigateToSummary());
    }
  }


  /**
   * Sign up using the form data, including error handling.
   * The user's login data is added to Firebase authentication, and additional user data is stored in Firestore.
   */
  submitSignUp() {
    if (this.acceptPrivacyPolicy) {
      this.loading = true;
      this.authService.register(this.formData.name, this.formData.email, this.formData.password)
        .then(() => this.transferAfterSignUp())
        .catch((err) => {
          this.authError = this.getAuthError(err);
        });
    }
  }


  /**
   * Transfer to the login form after signing up, displaying a toast notification.
   */
  transferAfterSignUp() {
    this.toastMsg = 'Success! Check your email to activate';
    this.showToastMsg = true;
    setTimeout(() => {
      this.showToastMsg = false;
      this.loading = false;
      this.formRef.nativeElement.reset();
      this.formData = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };
      this.acceptPrivacyPolicy = false;
    }, 4000);
  }


  /**
   * Navigate to the main app content landing page.
   */
  navigateToSummary() {
    this.router.navigate((['/summary']));
  }


  /**
   * Handle guest login option.
   */
  logInAsGuest() {
    this.loading = true;
    this.authService.logInAsGuest()
      .then((resp: any) => this.onLogIn(resp))
      .catch((err) => this.authError = this.getAuthError(err));
  }


  /**
   * Send a password reset email, displaying a toast notification.
   */
  sendPasswordResetEmail() {
    this.authService.requestPasswordReset(this.formData.email)
      .then((resp) => { this.toastNotificationWithReload('A reset link has been sent to your email address') })
      .catch(() => this.toastNotificationWithReload('Oops! An error occurred'))
  }


  /**
   * Show a toast notification for 2 seconds and reload the page afterward.
   * @param {string} msg - Notification content
   */
  toastNotificationWithReload(msg: string) {
    this.toastMsg = msg;
    this.showToastMsg = true;
    setTimeout(() => location.reload(), 2000);
  }


  /**
   * Activates a new account using the authentication service.
   * @param {string} token - account activation token 
   */
  activateAccount(token: string): void {
    this.activatingAccount = true;
    this.authService.activateAccount(token)
      .then(() => this.onAccountActivation())
      .catch((err) => this.authError = this.getAuthError(err))
      .finally(() => this.activatingAccount = false);
  }


  /**
   * Steers UI after account activation.
   */
  onAccountActivation(): void {
    this.toastMsg = 'Activation successful!';
    this.showToastMsg = true;
    setTimeout(() => {
      this.showToastMsg = false;
    }, 2000);
  }
}