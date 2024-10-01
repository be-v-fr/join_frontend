import { Injectable } from '@angular/core';
import { Contact } from "../../models/contact";
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, from, lastValueFrom } from "rxjs";
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


  async syncContacts(): Promise<void> {
    if (this.authService.currentUser && this.authService.currentUser.user.id != -1) {
      if (this.authService.currentUser.user.id == 'guest') {
        this.authService.currentUser.loadLocalGuestContacts();
      } else {
        await this.syncRegisteredUserContacts();
        console.log('contacts synced', this.authService.currentUser.contacts);
      }
      this.contacts$.next();
    }
  }


  async syncRegisteredUserContacts(): Promise<void> {
    if (this.authService.currentUser) {
      const url = environment.BASE_URL + 'contacts';
      const resp = await lastValueFrom(this.http.get(url, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
      this.authService.currentUser.contacts = [];
      (resp as Array<any>).forEach(cData => {
        this.authService.currentUser?.contacts?.push(new Contact(cData));
      });
      this.authService.currentUser$.next(this.authService.currentUser);
    }
  }


  async addContact(contact: Contact): Promise<Object | undefined> {
    if (this.authService.currentUser) {
      this.addContactLocally(contact);
      const url = environment.BASE_URL + 'contacts';
      const body = contact.toJson();
      return lastValueFrom(this.http.post(url, body, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


  addContactLocally(contact: Contact): void {
    if (this.authService.currentUser) {
      if (!this.authService.currentUser.contacts) {
        this.authService.currentUser.contacts = [];
      }
      this.authService.currentUser.contacts.push(contact);
      this.contacts$.next();
    }
  }


  async updateContact(contact: Contact): Promise<Object | undefined> {
    if (contact.id != -1 && this.authService.currentUser) {
      this.updateContactLocally(contact);
      if (this.authService.currentUser.user.id == 'guest') {
        console.log('update contacts for guest user inactive so far');
        return;
      } else {
        const url = environment.BASE_URL + 'contacts/' + contact.id;
        const body = contact.toJson();
        return lastValueFrom(this.http.put(url, body, {
          headers: this.authService.getAuthTokenHeaders(),
        }));
      }
    } else return;
  }


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


  async deleteContact(id: number): Promise<Object | undefined> {
    if (id != -1 && this.authService.currentUser) {
      this.deleteContactLocally(id);
      const url = environment.BASE_URL + 'contacts/' + id;
      return lastValueFrom(this.http.delete(url, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


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