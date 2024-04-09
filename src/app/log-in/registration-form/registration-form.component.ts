import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordIconComponent } from '../../templates/password-icon/password-icon.component';
import { AuthService } from '../../services/auth.service';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{
      if(user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          name: user.displayName!
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
    });
  }

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
    console.log(field);
    let element: HTMLInputElement | null = null;
    if (field == 'password') {
      element = this.passwordRef.nativeElement;
    }
    if (field == 'confirmation') {
      element = this.passwordConfirmationRef.nativeElement;
    }
    console.log(element);
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
    if(this.formMode == 'Log in') {
      this.submitLogIn(form);
    } else {
      this.submitSignUp(form);
    }
  }

  submitLogIn(form: NgForm) {

  }

  submitSignUp(form: NgForm) {

  }

  // LOG IN:
  // onSubmit(): void {
  //   const rawForm = this.form.getRawValue();
  //   this.authService.logIn(rawForm.email, rawForm.password).subscribe({
  //     next: () => this.router.navigate((['/'])),
  //     error: (err) => this.errorMsg = err.code
  //   });
  // }

  // SIGN UP:
  // onSubmit(): void {
  //   const rawForm = this.form.getRawValue();
  //   this.authService.register(rawForm.name, rawForm.email, rawForm.password).subscribe({
  //     next: () => this.router.navigate((['/'])),
  //     error: (err) => this.errorMsg = err.code
  //   });
  // }
}
