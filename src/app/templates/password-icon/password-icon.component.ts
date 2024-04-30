import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * This component displays the icon marking a password input field.
 * Depending on the input state, there a three different icons.
 */
@Component({
  selector: 'app-password-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-icon.component.html',
  styleUrl: './password-icon.component.scss'
})
export class PasswordIconComponent {
@Input() state: 'default' | 'password' | 'text' = 'default';
}
