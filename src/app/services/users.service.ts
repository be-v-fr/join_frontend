import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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
        this.users.push(this.setUserObject(element.data(), element.uid));
      });
      this.usersUpdate.next();
    });
  }

  getCurrentUsers(): Observable<void> {
    return this.usersUpdate.asObservable();
  }

  getColRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(uid: string) {
    return doc(this.getColRef(), uid);
  }

  async addUser(user: User) {
    await addDoc(this.getColRef(), this.getJsonFromUser(user))
      .catch((err: Error) => { console.error(err) });
  }

  async updateUser(user: User) {
    if (user.uid) {
      let docRef = this.getSingleDocRef(user.uid);
      let noteJson = this.getJsonFromUser(user);
      await updateDoc(docRef, noteJson)
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
      'contacts': user.contacts
    }
  }

  getUserByUid(uid: string): User {
    let user = new User('', '');
    this.users.forEach(u => {
      if (u.uid == uid) { user = u }
    });
    return user;
  }

  setUserObject(obj: any, uid: string): User {
    let user = new User('', '');
    user.uid = uid;
    if (obj.name) {user.name = obj.name}
    if (obj.color) {user.color = obj.color}
    if (obj.contacts) {user.contacts = obj.contacts}
    return user;
  }
}