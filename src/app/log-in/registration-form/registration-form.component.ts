import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordIconComponent],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {
  @Input() formMode: 'Log in' | 'Sign up' = 'Log in';
  @Output() toggleMode = new EventEmitter<void>();
  passwordFieldType: 'password' | 'text' = 'password';
  passwordConfirmationFieldType: 'password' | 'text' = 'password';
  @ViewChild('password') passwordRef!: ElementRef;
  @ViewChild('passwordConfirmation') passwordConfirmationRef!: ElementRef;
  rememberLogIn: boolean = false;
  acceptPrivacyPolicy: boolean = false;
  formData = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };
  validationError: string[] = [
    'This is not a valid email adress.',
    'Accept the privacy policy to sign up.',
    'Oops! Your passwords don\'t match.',
    'This email adress is not registered.',
    'Wrong password! Please try again.'
  ];
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  constructor(private router: Router) { }

  toggleModeEmit() {
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
      element = this.passwordRef.nativeElement;
    }
    if (field == 'confirmation') {
      element = this.passwordConfirmationRef.nativeElement;
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

  submitLogIn() {
    this.authService.logIn(this.formData.email, this.formData.password).subscribe({
      next: () => this.navigateToSummary(),
      error: (err) => console.error(err)
    });
  }

  submitSignUp() {
    this.authService.register(this.formData.name, this.formData.email, this.formData.password).subscribe({
      next: () => {
        const uid = this.authService.getCurrentUid();
        if (uid) {
          this.usersService.addUserByUid(new User(this.formData.name, uid));
        }
        this.navigateToSummary();
      },
      error: (err) => console.error(err)
    });
  }

  navigateToSummary() {
    this.router.navigate((['/summary']));
  }
}
