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

  getSortedContacts(): Contact[] {
    return this.contacts.sort((a: Contact, b: Contact) => a.name > b.name ? 1 : -1);
  }

  getFirstLetter(contact: Contact): string {
    return contact.name.charAt(0).toUpperCase();
  }

  hasNextLetter(index: number) {
    if(index > 0) {
      const current = this.getFirstLetter(this.contacts[index]);
      const previous = this.getFirstLetter(this.contacts[index - 1]);
      if(current == previous) {return false;}
    }
      return true;
  }
}
