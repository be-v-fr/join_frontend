import { Injectable } from '@angular/core';
import { Contact } from "../../models/contact";
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contacts$: Subject<void> = new Subject<void>();

  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }


  /**
   * Synchronize contacts from the backend for the current user.
   * Retrieves the contacts list from the server and updates the current user's contacts locally.
   * @returns A Promise resolving when the contacts have been successfully synced.
   */
  async syncContacts(): Promise<void> {
    if (this.authService.currentUser && this.authService.currentUser.user.id != -1) {
      const url = environment.BASE_URL + 'contacts/';
      const resp = await lastValueFrom(this.http.get(url));
      this.authService.currentUser.contacts = [];
      (resp as Array<any>).forEach(cData => {
        this.authService.currentUser?.contacts?.push(new Contact(cData));
      });
      this.authService.currentUser$.next(this.authService.currentUser);
      this.contacts$.next();
    }
  }


  /**
   * Add a new contact to the current user's contact list.
   * Sends a POST request to the server to save the contact, and also updates the contact list locally.
   * @param contact The contact object to be added.
   * @returns A Promise resolving to the server's response, or undefined if no user is authenticated.
   */
  async addContact(contact: Contact): Promise<Object | undefined> {
    if (this.authService.currentUser) {
      this.addContactLocally(contact);
      const url = environment.BASE_URL + 'contacts/';
      const body = contact.toJson();
      return lastValueFrom(this.http.post(url, body));
    } return;
  }


  /**
   * Add a contact to the current user's contact list locally.
   * This does not communicate with the server and only updates the in-memory contact list.
   * @param contact The contact object to be added locally.
   */
  addContactLocally(contact: Contact): void {
    if (this.authService.currentUser) {
      if (!this.authService.currentUser.contacts) {
        this.authService.currentUser.contacts = [];
      }
      this.authService.currentUser.contacts.push(contact);
      this.contacts$.next();
    }
  }


  /**
   * Update an existing contact in the current user's contact list.
   * Sends a PUT request to the server to update the contact, and also updates the contact locally.
   * @param contact The contact object containing updated information.
   * @returns A Promise resolving to the server's response, or undefined if no user is authenticated or the contact has no valid ID.
   */
  async updateContact(contact: Contact): Promise<Object | undefined> {
    if (contact.id != -1 && this.authService.currentUser) {
      this.updateContactLocally(contact);
      const url = environment.BASE_URL + 'contacts/' + contact.id + '/';
      const body = contact.toJson();
      return lastValueFrom(this.http.put(url, body));
    } return;
  }


  /**
   * Update a contact in the current user's contact list locally.
   * This does not communicate with the server and only updates the in-memory contact list.
   * @param contact The contact object containing updated information.
   */
  updateContactLocally(contact: Contact): void {
    if (this.authService.currentUser && this.authService.currentUser.contacts) {
      const contactsArrayIndex = this.authService.currentUser.contacts.findIndex(c => c.id == contact.id);
      if (contactsArrayIndex >= 0) {
        this.authService.currentUser.contacts[contactsArrayIndex] = contact;
        this.contacts$.next();
      } else {
        console.error('Task with ID', contact.id, 'could not be updated (task not found).');
      }
    }
  }


  /**
   * Delete a contact from the current user's contact list.
   * Sends a DELETE request to the server to remove the contact, and also removes it locally.
   * @param id The ID of the contact to be deleted.
   * @returns A Promise resolving to the server's response, or undefined if no user is authenticated or the contact has no valid ID.
   */
  async deleteContact(id: number): Promise<Object | undefined> {
    if (id != -1 && this.authService.currentUser) {
      this.deleteContactLocally(id);
      const url = environment.BASE_URL + 'contacts/' + id + '/';
      return lastValueFrom(this.http.delete(url));
    } return;
  }


  /**
   * Delete a contact from the current user's contact list locally.
   * This does not communicate with the server and only removes the contact from the in-memory contact list.
   * @param id The ID of the contact to be removed locally.
   */
  deleteContactLocally(id: number): void {
    if (this.authService.currentUser && this.authService.currentUser.contacts) {
      const contactsArrayIndex = this.authService.currentUser.contacts.findIndex(c => c.id == id);
      if (contactsArrayIndex >= 0) {
        this.authService.currentUser.contacts.splice(contactsArrayIndex, 1);
        this.contacts$.next();
      } else {
        console.error('Task with ID', id, 'could not be deleted (task not found).');
      }
    }
  }
}