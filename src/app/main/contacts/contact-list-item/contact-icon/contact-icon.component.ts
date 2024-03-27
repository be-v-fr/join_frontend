import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-icon.component.html',
  styleUrl: './contact-icon.component.scss'
})
export class ContactIconComponent {
  @Input() name: string = '##';
  @Input() color: string = '#CCCCCC';

  getInitials() {
    const nameParts: string[] = this.name.split(' ');
    const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return capitalized;
  }
}
