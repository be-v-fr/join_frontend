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
      const url = environment.BASE_URL + 'contacts';
      const body = contact.toJson();
      return lastValueFrom(this.http.post(url, body, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


  async updateContact(contact: Contact): Promise<Object | undefined> {
    if (contact.id != -1 && this.authService.currentUser) {
      const url = environment.BASE_URL + 'contacts/' + contact.id;
      const body = contact.toJson();
      return lastValueFrom(this.http.put(url, body, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


  async deleteContact(id: number): Promise<Object | undefined> {
    if (id != -1 && this.authService.currentUser) {
      const url = environment.BASE_URL + 'contacts/' + id;
      return lastValueFrom(this.http.delete(url, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }
}