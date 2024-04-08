import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../templates/password-icon/password-icon.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordIconComponent],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  animate: boolean = true;
  formMode: 'Log in' | 'Sign up' = 'Log in';
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

ngOnInit() {
  setTimeout(() => this.animate = false, 800)
}

  toggleFormMode() {
    this.formMode == 'Log in' ? this.formMode = 'Sign up' : this.formMode = 'Log in';
  }

  toggleVisibility(field: 'password' | 'confirmation') {
    if(field == 'password' && this.formData.password.length > 0) {
      this.passwordFieldType = this.togglePasswordFieldType(this.passwordFieldType);
      this.focusLastPosition(field);
    } else if(this.formData.passwordConfirmation.length > 0) {
      this.passwordConfirmationFieldType = this.togglePasswordFieldType(this.passwordConfirmationFieldType);
      this.focusLastPosition(field);
    }
  }

  focusLastPosition(field: 'password' | 'confirmation') {
    let element: HTMLInputElement = this.passwordRef.nativeElement;
    if(field == 'confirmation') {
      element = this.passwordConfirmationRef.nativeElement;
    }
    setTimeout(() => {
      if (element) {
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
    switch (this.formMode) {
      case ('Sign up'): {
        console.log('sign up');
        break;
      }
      case ('Log in'):
      console.log('log in');
    }
    console.log(form);
  }
}
