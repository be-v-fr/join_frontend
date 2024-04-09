import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  users: User[] = [];
  private usersUpdate: Subject<void> = new Subject<void>();
  unsubUsers;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubUsers = this.subUsers();
  }

  ngOnDestroy() {
    this.unsubUsers();
  }

  subUsers() {
    return onSnapshot(this.getColRef(), (list: any) => {
      this.users = [];
      list.forEach((element: any) => {
        this.users.push(this.setUserObject(element.data()));
      });
      this.usersUpdate.next();
    });
  }

  getUsers(): Observable<void> {
    return this.usersUpdate.asObservable();
  }

  getColRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(uid: string) {
    return doc(this.getColRef(), uid);
  }

  async addUserByUid(user: User) {
    await setDoc(this.getSingleDocRef(user.uid), this.getJsonFromUser(user))
      .catch((err: Error) => { console.error(err) });
  }

  async updateUser(user: User) {
    if (user.uid) {
      let docRef = this.getSingleDocRef(user.uid);
      let userJson = this.getJsonFromUser(user);
      await updateDoc(docRef, userJson)
        .catch((err: Error) => { console.error(err) });
    }
  }

  async deleteUser(uid: string) {
    let docRef = this.getSingleDocRef(uid);
    await deleteDoc(docRef)
      .catch((err: Error) => { console.error(err) });
  }

  getJsonFromUser(user: User): {} {
    return {
      'uid': user.uid,
      'name': user.name,
      'color': user.color,
      'contacts': JSON.stringify(user.contacts)
    }
  }

  getUserByUid(uid: string): User {
    let user = new User('', '');
    this.users.forEach(u => {
      if (u.uid == uid) {
        user = u;
        user.contacts = [];
        for (let i = 0; i < u.contacts.length; i++) {user.contacts.push(u.contacts[i])}
      }
    });
    return user;
  }

  setUserObject(obj: any): User {
    let user = new User('', '');
    if (obj.uid) { user.uid = obj.uid }
    if (obj.name) { user.name = obj.name }
    if (obj.color) { user.color = obj.color }
    if (obj.contacts) { user.contacts = obj.contacts }
    return user;
  }
}