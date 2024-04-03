import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"join-aeecd","appId":"1:1099061928562:web:a1fa0ab464ae4ac65d58eb","storageBucket":"join-aeecd.appspot.com","apiKey":"AIzaSyDIYWhou41ZgYXCnLu2dwtiWCk9z3DE3mA","authDomain":"join-aeecd.firebaseapp.com","messagingSenderId":"1099061928562"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
