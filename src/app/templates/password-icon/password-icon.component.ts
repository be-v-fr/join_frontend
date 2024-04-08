import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
