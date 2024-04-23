import { Component, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactListItemComponent, PersonBadgeComponent, EmailComponent, AddContactComponent, HeadlineSloganComponent, ArrowBackBtnComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private usersSub = new Subscription();

  users: User[] = [];
  currentUser: User = new User('', '');
  sortedContacts: Contact[] = [];

  selection: number = -1;
  contactOverlay: 'add' | 'edit' | null = null;
  @ViewChild('viewer') contactViewerRef!: ElementRef;
  contactViewerResponsive: 'desktop' | 'mobile' = 'desktop';
  showEditMenuResponsive: boolean = false;

  ngOnInit(): void {
    const uid = this.authService.getCurrentUid();
    if (uid) {
      this.currentUser = this.usersService.getUserByUid(uid);
      this.initUsers();
    }
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  initUsers() {
    this.setUsers();
    this.usersSub = this.subUsers()
  }

  setUsers() {
    this.users = this.usersService.users;
    this.sortedContacts = this.getSortedContacts();
  }

  subUsers(): Subscription {
    return this.usersService.users$.subscribe(() => this.setUsers());
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

  unselectContact() {
    this.selection = -1;
    this.toggleEditMenuResponsive(false);
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
    this.usersService.updateUser(this.currentUser);
    this.sortedContacts = this.getSortedContacts();
  }

  cancelOverlay() {
    this.contactOverlay = null;
  }

  deleteSelectedContact() {
    this.currentUser.contacts.splice(this.selection, 1);
    this.usersService.updateUser(this.currentUser);
    this.unselectContact();
  }

  toggleEditMenuResponsive(show?: boolean) {
    if (show == true || show == false) {
      this.showEditMenuResponsive = show;
    } else {
      this.showEditMenuResponsive = !this.showEditMenuResponsive;
    }
  }
}
