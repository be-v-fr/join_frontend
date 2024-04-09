import { Component, inject, OnInit } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { Contact } from '../../../models/contact';
import { User } from '../../../models/user';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';
import { EmailComponent } from './email/email.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactListItemComponent, PersonBadgeComponent, EmailComponent, AddContactComponent, HeadlineSloganComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  currentUser: User = new User('', '');

  selection: number = -1;
  contactOverlay: 'add' | 'edit' | null = null;


  // LADEN DER KONTAKTE FUNKTIONIERT NOCH NICHT 
  ngOnInit(): void {
    this.authService.user$.subscribe(() => {
      const uid = this.authService.getCurrentUid();
      if (uid) {
        this.currentUser = this.usersService.getUserByUid(uid);
        console.log(this.currentUser.contacts);
      }
    });
  }

  getSortedContacts(): any[] {
    return [].slice.call(this.currentUser.contacts) // wieder vereinfacht probieren, wenn Laden funktioniert!!
      .sort((a: Contact, b: Contact) => a.name > b.name ? 1 : -1);
  }

  getFirstLetter(contact: Contact): string {
    if (contact.name) {
      return contact.name.charAt(0).toUpperCase();
    } else {
      return '';
    }
  }

  hasNextLetter(index: number) {
    if (this.currentUser && index > 0) {
      const current = this.getFirstLetter(this.currentUser.contacts[index]);
      const previous = this.getFirstLetter(this.currentUser.contacts[index - 1]);
      if (current == previous) { return false; }
    }
    return true;
  }

  selectContact(index: number) {
    this.selection = index;
  }

  showContactOverlay(mode: 'add' | 'edit') {
    this.contactOverlay = mode;
  }

  submitContact(contact: Contact) {
    console.log('Vor Update:');
    console.log(this.currentUser.contacts);
    if (this.currentUser) {
      if (this.contactOverlay == 'add') {
        this.currentUser.addContact(contact);
      } else {
        this.currentUser.contacts[this.selection] = contact;
      }
      this.usersService.updateUser(this.currentUser);
    }
    this.cancelOverlay();
  }

  cancelOverlay() {
    this.contactOverlay = null;
  }

  deleteSelectedContact() {
    if (this.currentUser) {
      this.currentUser.contacts.splice(this.selection, 1);
      this.usersService.updateUser(this.currentUser);
    }
  }
}
