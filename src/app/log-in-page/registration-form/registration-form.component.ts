import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { tick } from '@angular/core/testing';
import { ArrowBackBtnComponent } from '../../templates/arrow-back-btn/arrow-back-btn.component';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordIconComponent, ArrowBackBtnComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {
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
  private usersService = inject(UsersService);

  constructor(private router: Router) {
    this.initRememberState();
    this.rememberLogIn = this.authService.getLocalRememberMe();
    if (this.rememberLogIn) {
      this.authService.user$.subscribe(() => {
        const currentUser = this.authService.firebaseAuth.currentUser;
        if (currentUser && currentUser.displayName) { this.formData['name'] = currentUser.displayName };
        if (currentUser && currentUser.email) { this.formData['email'] = currentUser.email };
        setTimeout(() => {
          if (this.authService.getCurrentUid()) { this.navigateToSummary() }
        }, 1200)
      });
    }
  }

  initRememberState() {
    if(this.authService.getLocalGuestLogin()) {
      this.authService.setLocalGuestLogin(false);
      this.authService.setLocalRememberMe(false);
    }
  }

  toggleModeEmit() {
    this.resetAuthError();
    this.toggleMode.emit();
  }

  toggleVisibility(field: 'password' | 'confirmation') {
    if (field == 'password' && this.formData.password.length > 0) {
      this.passwordFieldType = this.togglePasswordFieldType(this.passwordFieldType);
      this.focusLastPosition(field);
    } else if (this.formData.passwordConfirmation.length > 0) {
      this.passwordConfirmationFieldType = this.togglePasswordFieldType(this.passwordConfirmationFieldType);
      this.focusLastPosition(field);
    }
  }

  focusLastPosition(field: 'password' | 'confirmation') {
    let element: HTMLInputElement | null = null;
    if (field == 'password') {
      element = this.passwordContainerRef.nativeElement.getElementsByTagName('input')[0];
    }
    if (field == 'confirmation') {
      element = this.passwordConfirmationContainerRef.nativeElement.getElementsByTagName('input')[0];
    }
    setTimeout(() => {
      if (element != null) {
        element.focus();
        element.setSelectionRange(element.value.length, element.value.length);
      }
    });
  }

  togglePasswordFieldType(type: 'password' | 'text') {
    return type == 'password' ? type = 'text' : type = 'password';
  }

  toggleRememberMe() {
    this.rememberLogIn = !this.rememberLogIn;
  }

  togglePrivacyPolicy() {
    this.acceptPrivacyPolicy = !this.acceptPrivacyPolicy;
  }

  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form)) {
      if (this.formMode == 'Log in') {
        this.submitLogIn();
      } else {
        this.submitSignUp();
      }
    }
  }

  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation();
  }

  checkPasswordConfirmation(): boolean {
    if (this.formMode == 'Log in') {
      return true;
    } else {
      return this.formData.password == this.formData.passwordConfirmation;
    }
  }

  getAuthError(err: string) {
    if (err.includes('auth/invalid-credential')) {return 'invalid credential'}
    else if(err.includes('auth/email-already-in-use')) {return 'email in use'}
    else return ''
  }

  resetAuthError() {
    this.authError = '';
  }

  submitLogIn() {
    this.authService.setLocalGuestLogin(false);
    this.authService.setLocalRememberMe(this.rememberLogIn);
    this.authService.logIn(this.formData.email, this.formData.password).subscribe({
      next: () => this.navigateToSummary(),
      error: (err) => this.authError = this.getAuthError(err.toString())
    });
  }

  submitSignUp() {
    if (this.acceptPrivacyPolicy) {
      this.authService.setLocalGuestLogin(false);
      this.authService.register(this.formData.name, this.formData.email, this.formData.password).subscribe({
        next: () => {
          const uid = this.authService.getCurrentUid();
          if (uid) {
            this.usersService.addUserByUid(new User(this.formData.name, uid));
          }
          this.navigateToSummary();
        },
        error: (err) => this.authError = this.getAuthError(err.toString())
      });
    }
  }

  navigateToSummary() {
    this.router.navigate((['/summary']));
  }

  logInAsGuest() {
    this.authService.logOut();
    this.authService.logInAsGuest();
    this.navigateToSummary();
  }
}
