import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * This component displays a badge showing a Person's initials and individual background color.
 * There are some optional variables for styling in different contexts. 
 */
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
  @Input() large?: boolean;
  @Input() currentUser?: boolean;
  @Input() responsive?: 'desktop' | 'mobile';


  /**
   * Get capitalized initials from "name"
   * @returns initials
   */
  getInitials() {
    const nameParts: string[] = this.name.split(' ');
    const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return capitalized;
  }
}
