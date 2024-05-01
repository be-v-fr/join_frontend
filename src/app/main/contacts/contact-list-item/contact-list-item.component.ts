import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonBadgeComponent } from '../../../templates/person-badge/person-badge.component';
import { EmailComponent } from '../email/email.component';


/**
 * This component displays a contact card including name and badge.
 */
@Component({
  selector: 'app-contact-list-item',
  standalone: true,
  imports: [CommonModule, PersonBadgeComponent, EmailComponent],
  templateUrl: './contact-list-item.component.html',
  styleUrl: './contact-list-item.component.scss'
})
export class ContactListItemComponent {
  @Input() name: string = 'name';
  @Input() email?: string | undefined;
  @Input() color: string = '#DDDDDD';
  @Input() instance: 'contacts' | 'task' = 'contacts';
  @Input() selected?: boolean = false;
  @Input() designateAsYou?: boolean = false;
}