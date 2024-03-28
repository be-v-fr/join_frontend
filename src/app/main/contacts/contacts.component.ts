import { Component } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { Contact } from '../../../models/contact';
import { ContactIconComponent } from './contact-list-item/contact-icon/contact-icon.component';
import { EmailComponent } from './email/email.component';
import { AddContactComponent } from './add-contact/add-contact.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactListItemComponent, ContactIconComponent, EmailComponent, AddContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  contacts: Contact[] = [
    new Contact('test 1', 'email 1'),
    new Contact('test 2', 'email 2'),
    new Contact('no email')
  ];
  selection: number = -1;
  contactOverlay: 'add' | 'edit' | null = null;

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

  selectContact(index: number) {
    this.selection = index;
  }

  addContact() {
    this.selection = -1;
    this.contactOverlay = 'add';
  }

  cancelOverlay() {
    this.contactOverlay = null;
  }
}
