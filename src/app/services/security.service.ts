import { Injectable } from '@angular/core';
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider } from "@angular/fire/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  theUser = new BehaviorSubject<User>(new User());

  constructor(private auth: AngularFireAuth, private router: Router) { 
    const savedUser = localStorage.getItem("sessionUser");
    if (savedUser) {
      this.theUser.next(JSON.parse(savedUser));
    }

    this.observeFirebaseSession();
  }

  //Inicio de sesión con google
  loginWithGoogle() {
    return this.authLoginGoogle(new GoogleAuthProvider())
  }

  authLoginGoogle(provider: any) {
    return this.auth.signInWithPopup(provider).then(result => {
      console.log('Usuario Logeado', result);
      this.setSessionUser(result.user);
      this.router.navigate(["/dashboard"]);
    }).catch((error) => {
      console.log(error);
    })
  }

  //Inicio de sesión con GitHub
  loginWithGitHub() {
    return this.authLoginGitHub(new GithubAuthProvider());
  }

  authLoginGitHub(provider: any) {
    return this.auth.signInWithPopup(provider).then(result => {
      console.log('Usuario Logeado', result);
      this.setSessionUser(result.user);
      this.router.navigate(["/dashboard"]);
    }).catch((error) => {
      console.log(error);
    })
  }

  // Inicio de sesión con Microsoft (OAuthProvider 'microsoft.com')
  loginWithMicrosoft() {
    return this.authLoginMicrosoft(new OAuthProvider('microsoft.com'));
  }

  authLoginMicrosoft(provider: any) {
    return this.auth.signInWithPopup(provider).then(result => {
      console.log('Usuario Logeado (Microsoft)', result);
      this.setSessionUser(result.user);
      this.router.navigate(["/dashboard"]);
    }).catch((error) => {
      console.log(error);
    })
  }

  //Inicio de sesión con Usuario y contraseña
  login(user: User) {
    return from(this.auth.signInWithEmailAndPassword(user.email, user.password));
  }

  private observeFirebaseSession() {
    this.auth.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        this.setSessionUser(fbUser);
      } else {
        this.theUser.next(new User());
        localStorage.removeItem("sessionUser");
      }
    });
  }

  //Funciones para el control de inico de sesión
  setSessionUser(firebaseUser: any) {
    firebaseUser.getIdToken().then((token: string) => {
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email || "",
        password: "",
        token: token,
        photoURL: firebaseUser.photoURL || ""
      };

      this.theUser.next(user);

      localStorage.setItem("sessionUser", JSON.stringify(user));
    });
  }

  getUser(): Observable<User> {
    return this.theUser.asObservable();
  }

  get activeUserSession(): User {
    return this.theUser.value;
  }

  existSession(): boolean {
    return this.activeUserSession?.id ? true : false;
  }

  logOut() {
    this.auth.signOut();
    this.theUser.next(new User());
    localStorage.removeItem("sessionUser");
  }
}

