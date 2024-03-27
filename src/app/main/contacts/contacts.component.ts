import { Component } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactListItemComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  contacts: Contact[] = [
    new Contact('test 1', 'email 1'),
    new Contact('test 2', 'email 2'),
    new Contact('no email')
  ];
}
