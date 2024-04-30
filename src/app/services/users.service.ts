import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { User } from '../../models/user';


/**
 * This injectable handles generic users operations.
 * This includes Firestore communication.
 * However, Firebase authentication is not included here
 * (see "authService" for user authentication). 
 */
@Injectable({
  providedIn: 'root'
})

export class UsersService implements OnDestroy {
  users: User[] = [];
  users$: Subject<void> = new Subject<void>();
  unsubUsers;
  firestore: Firestore = inject(Firestore);


  /**
   * Create subscription
   */
  constructor() {
    this.unsubUsers = this.subUsers();
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy() {
    this.unsubUsers();
  }


  /**
   * Subscribe to Firestore "users" collection to synchronize "users" array.
   * Also trigger "users$" observable on snapshot.
   * @returns subscription
   */
  subUsers() {
    return onSnapshot(this.getColRef(), (list: any) => {
      this.users = [];
      list.forEach((element: any) => {
        this.users.push(this.setUserObject(element.data()));
      });
      this.users$.next();
    });
  }


  /**
   * Get reference to Firestore "users" collection
   * @returns reference
   */
  getColRef() {
    return collection(this.firestore, 'users');
  }


  /**
   * Get reference to single user Firestore data
   * @param id Firestore task ID
   * @returns reference
   */
  getSingleDocRef(uid: string) {
    return doc(this.getColRef(), uid);
  }


  /**
   * Add user to Firestore collection.
   * The Firestore document ID will be identical to the user's Firebase authentication ID.
   * @param user user to be added
   */
  async addUserByUid(user: User) {
    await setDoc(this.getSingleDocRef(user.uid), this.getJsonFromUser(user))
      .catch((err: Error) => { console.error(err) });
  }


  /**
   * Update user in Firestore collection.
   * The update will only be executed if the user (i.e., its Firestore ID) exists in the Firestore collection.
   * @param user user to be updated
   */
  async updateUser(user: User) {
    if (user.uid) {
      if(user.uid == 'guest') {
        user.saveLocalGuestContacts();
      } else {
      let docRef = this.getSingleDocRef(user.uid);
      let userJson = this.getJsonFromUser(user);
      await updateDoc(docRef, userJson)
        .catch((err: Error) => { console.error(err) });
      }
    }
  }


  /**
   * Delete user from Firestore collection
   * @param id Firestore user ID of user to be deleted
   */
  async deleteUser(uid: string) {
    let docRef = this.getSingleDocRef(uid);
    await deleteDoc(docRef)
      .catch((err: Error) => { console.error(err) });
  }


  /**
   * Transform user object properties to JSON
   * @param user user to be transformed
   * @returns JSON
   */
  getJsonFromUser(user: User): {} {
    return {
      'uid': user.uid,
      'name': user.name,
      'color': user.color,
      'contacts': user.getMapFromContacts()
    }
  }


  /**
   * Retrieve a complete user object from user ID
   * @param id Firestore user ID
   * @returns user object
   */
  getUserByUid(uid: string): User {
    if (uid == 'guest') {
      return new User('Guest', uid);
    } else {
      let user = new User('', '');
      this.users.forEach(u => {
        if (u.uid == uid) { user = this.setUserObject(u) }
      });
      return user;
    }
  }


  /**
   * Set "User" object from "any" object
   * @param obj any object (should consist of user properties)
   * @returns userr object
   */
  setUserObject(obj: any): User {
    const user = new User('', '');
    if (obj.uid) { user.uid = obj.uid }
    if (obj.name) { user.name = obj.name }
    if (obj.color) { user.color = obj.color }
    if (obj.contacts) { user.contacts = user.getContactsFromMap(obj.contacts) }
    return user;
  }
}