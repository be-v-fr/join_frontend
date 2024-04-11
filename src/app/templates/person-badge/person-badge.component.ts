import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-badge.component.html',
  styleUrl: './person-badge.component.scss'
})
export class PersonBadgeComponent {
  @Input() name: string = '';
  @Input() color: string = '#d1d1d1';
  @Input() large?: boolean = false;
  @Input() currentUser?: boolean = false;

  getInitials() {
    const nameParts: string[] = this.name.split(' ');
    const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return capitalized;
  }
}
