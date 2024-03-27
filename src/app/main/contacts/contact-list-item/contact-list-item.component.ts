import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../../models/contact';
import { ContactIconComponent } from './contact-icon/contact-icon.component';
import { EmailComponent } from '../email/email.component';

@Component({
  selector: 'app-contact-list-item',
  standalone: true,
  imports: [CommonModule, ContactIconComponent, EmailComponent],
  templateUrl: './contact-list-item.component.html',
  styleUrl: './contact-list-item.component.scss'
})
export class ContactListItemComponent {
  @Input() name: string = 'name';
  @Input() email?: string | undefined;
  @Input() color: string = '#DDDDDD';
  @Input() instance: 'contacts' | 'task' = 'contacts';
}