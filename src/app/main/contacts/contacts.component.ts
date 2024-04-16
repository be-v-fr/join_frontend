import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2, HostListener } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { Contact } from '../../../models/contact';
import { User } from '../../../models/user';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';
import { EmailComponent } from './email/email.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';
import { CommonModule } from '@angular/common';
import { ArrowBackBtnComponent } from '../../templates/arrow-back-btn/arrow-back-btn.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactListItemComponent, PersonBadgeComponent, EmailComponent, AddContactComponent, HeadlineSloganComponent, ArrowBackBtnComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  users: User[] = [];
  currentUser: User = new User('', '');
  sortedContacts: Contact[] = [];

  selection: number = -1;
  contactOverlay: 'add' | 'edit' | null = null;
  @ViewChild('viewer') contactViewerRef!: ElementRef;
  contactViewerResponsive: 'desktop' | 'mobile' = 'desktop';
  showEditMenuResponsive: boolean = false;

  ngOnInit(): void {
    this.authService.user$.subscribe(() => {
      const uid = this.authService.getCurrentUid();
      if (uid) {
        this.users = this.usersService.users;
        this.currentUser = this.usersService.getUserByUid(uid);
        this.sortedContacts = this.getSortedContacts();
        this.usersService.getUsers().subscribe(() => {
          this.users = this.usersService.users;
          this.sortedContacts = this.getSortedContacts();
        })
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.setContactViewerResponsive() }, 0);
  }

  setContactViewerResponsive() {
    const width = this.contactViewerRef.nativeElement.offsetWidth;
    width >= 698 ? this.contactViewerResponsive = 'desktop' : this.contactViewerResponsive = 'mobile';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setContactViewerResponsive();
  }

  getContactsWithUsers(): Contact[] {
    const contacts: Contact[] = this.currentUser.contacts;
    this.users.forEach(u => {
      if (u.uid != this.currentUser.uid && !this.currentUser.hasUserInContacts(u)) {
        contacts.push(u.asContact());
      }
    });
    return contacts;
  }

  getSortedContacts(): Contact[] {
    return this.getContactsWithUsers().sort((a: Contact, b: Contact) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  }

  getFirstLetter(contact: Contact): string {
    return contact.name.charAt(0).toUpperCase();
  }

  hasNextLetter(index: number) {
    if (index > 0) {
      const current = this.getFirstLetter(this.sortedContacts[index]);
      const previous = this.getFirstLetter(this.sortedContacts[index - 1]);
      if (current == previous) { return false; }
    }
    return true;
  }

  selectContact(index: number) {
    this.selection == index ? this.selection = -1 : this.selection = index;
  }

  showContactOverlay(mode: 'add' | 'edit') {
    this.contactOverlay = mode;
  }

  submitContact(contact: Contact) {
    if (this.contactOverlay == 'add') {
      this.currentUser.addContact(contact);
    } else {
      this.sortedContacts[this.selection] = contact;
    }
    this.updateContacts();
    this.cancelOverlay();
  }

  updateContacts() {
    this.currentUser.contacts = this.filterOutUneditedUsers();
    this.usersService.updateUser(this.currentUser);
    this.sortedContacts = this.getSortedContacts();
  }

  filterOutUneditedUsers() {
    return this.sortedContacts.filter(c => !c.isUneditedUser());
  }

  cancelOverlay() {
    this.contactOverlay = null;
  }

  deleteSelectedContact() {
    this.currentUser.contacts.splice(this.selection, 1);
    this.usersService.updateUser(this.currentUser);
    this.selection = -1;
  }

  toggleEditMenuResponsive(show?: boolean) {
    show ? this.showEditMenuResponsive = show : this.showEditMenuResponsive = !this.showEditMenuResponsive;
  }
}
