import { Component, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ContactListItemComponent } from './contact-list-item/contact-list-item.component';
import { Contact } from '../../../models/contact';
import { AppUser } from '../../../models/app-user';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { PersonBadgeComponent } from '../../templates/person-badge/person-badge.component';
import { EmailComponent } from './email/email.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';
import { CommonModule } from '@angular/common';
import { ArrowBackBtnComponent } from '../../templates/arrow-back-btn/arrow-back-btn.component';
import { Subscription } from 'rxjs';
import { ContactsService } from '../../services/contacts.service';


/**
 * This component displays the contacts of the active user.
 * By default, the contacts comprise all other users without their email address (which is dismissed for privacy reasons).
 * Individual contacts can be added by the user. Email adresses and phone numbers can be added to all contacts.
 */
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
  private contactsService = inject(ContactsService);
  private authSub = new Subscription();
  private contactsSub = new Subscription();
  private usersSub = new Subscription();
  users: AppUser[] = [];
  currentUser?: AppUser;
  sortedContacts: Contact[] = [];
  selection: number = -1;
  contactOverlay: 'add' | 'edit' | null = null;
  @ViewChild('viewer') contactViewerRef!: ElementRef;
  contactViewerResponsive: 'desktop' | 'mobile' = 'desktop';
  showEditMenuResponsive: boolean = false;


  /**
   * Initialize currently active user and full users array.
   */
  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
    }
    this.authSub = this.subAuth();
    this.setContacts();
    this.subContacts();
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.contactsSub.unsubscribe();
    this.usersSub.unsubscribe();
  }


  /**
   * Returns authService/currentUser subscription to synchronize current user,
   * contacts and perform addictional usersService/users subscription.
   * @returns {Subscription} current user subscription
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.setContacts();
        this.usersSub = this.subUsers();
      }
    })
  }


  /**
   * Update users array according to usersService and update sorted contacts afterwards.
   */
  setContacts() {
    this.users = this.usersService.users;
    this.sortedContacts = this.getSortedContacts();
  }


  /**
   * Subscribe to "contactsService.contacts$"
   * @returns subscription
   */
  subContacts(): Subscription {
    return this.contactsService.contacts$.subscribe(() => this.setContacts())
  }


  /**
   * Subscribe to "usersService.users$"
   * @returns subscription
   */
  subUsers(): Subscription {
    return this.usersService.users$.subscribe(() => this.setContacts());
  }


  /**
   * Responsive style settings with instant timeout as a workaround
   */
  ngAfterViewInit(): void {
    setTimeout(() => { this.setContactViewerResponsive() }, 0);
  }


  /**
   * Set "contactViewerResponsive" property according to the contact viewer width in pixels.
   * Since the width of a specific HTML element is being checked here, this cannot be achieved using a CSS media query.
   * Hence, this typescript solution is being used.
   */
  setContactViewerResponsive() {
    const width = this.contactViewerRef.nativeElement.offsetWidth;
    this.contactViewerResponsive = (width >= 768 ? 'desktop' : 'mobile');
  }


  /**
   * Set "contactViewerResponsive" property after window resizing
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setContactViewerResponsive();
  }


  /**
   * Get an array containing both individual contacts and users transformed to contacts
   * @returns contacts array
   */
  getContactsWithUsers(): Contact[] {
    if (this.currentUser) {
      const contacts: Contact[] = this.currentUser.contacts || [];
      this.users.forEach(u => {
        if (this.currentUser) {
          const contactsArrayIndex = this.currentUser.hasUserInContacts(u);
          if (contactsArrayIndex == -1) {
            contacts.push(u.asContact());
          } else {
            contacts[contactsArrayIndex].name = u.user.username;
            contacts[contactsArrayIndex].email = u.user.email;
          }
        }
      });
      return contacts;
    } else {
      return [];
    }
  }


  /**
   * Get alphabetically sorted contacts including both individual contacts and users transformed to contacts
   * @returns sorted contacts array
   */
  getSortedContacts(): Contact[] {
    return this.getContactsWithUsers().sort((a: Contact, b: Contact) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  }


  /**
   * Checks if a contact is also a user.
   * @param {Contact} contact - Contact to check 
   * @returns {boolean} Check result
   */
  isUser(contact: Contact): boolean {
    return this.usersService.isUser(contact);
  }


  /**
   * Get the first letter of a contact name from a contact
   * @param contact contact
   * @returns first letter (upper case)
   */
  getFirstLetter(contact: Contact): string {
    return contact.name.charAt(0).toUpperCase();
  }


  /**
   * Check whether a certain contact name's first letter is different from the previous contact name's first letter
   * @param index alphabetically sorted contacts array index
   * @returns check result
   */
  hasNextLetter(index: number) {
    if (index > 0) {
      const current = this.getFirstLetter(this.sortedContacts[index]);
      const previous = this.getFirstLetter(this.sortedContacts[index - 1]);
      if (current == previous) { return false; }
    }
    return true;
  }


  /**
   * Set "selection" property to contact index.
   * Unset property (value: -1) in case a selected contact is clicked a second time.
   * @param index alphabetically sorted contacts array index
   */
  selectContact(index: number) {
    this.selection = (this.selection == index ? -1 : index);
  }


  /**
   * Unset "selection" propoerty and close responsive contact editing buttons menu
   */
  unselectContact() {
    this.selection = -1;
    this.toggleEditMenuResponsive(false);
  }


  /**
   * Show "add contact" overlay by setting the "contactOverlay" property to the desired form mode
   * @param mode form mode
   */
  showContactOverlay(mode: 'add' | 'edit') {
    this.contactOverlay = mode;
  }


  /**
   * Submit "add contact" form according to form mode ("add"/"edit")
   * @param contact "add contact" form data
   */
  async submitContact(contact: Contact) {
    if (this.currentUser) {
      contact.id == -1 ? await this.contactsService.addContact(contact) : await this.contactsService.updateContact(contact);
      this.cancelOverlay();
    }
  }


  /**
   * Cancel "add contact" overlay by unsetting the form mode
   */
  cancelOverlay() {
    this.contactOverlay = null;
  }


  /**
   * Delete selected/viewed contact.
   */
  deleteSelectedContact() {
    if (this.currentUser && this.currentUser.contacts) {
      const contact_id = this.sortedContacts[this.selection].id;
      this.contactsService.deleteContact(contact_id);
      this.unselectContact();
    }
  }


  /**
   * Toggle responsive contact editing buttons menu display
   * @param show desired display setting
   */
  toggleEditMenuResponsive(show?: boolean) {
    this.showEditMenuResponsive = ((show == true || show == false) ? show : !this.showEditMenuResponsive);
  }
}