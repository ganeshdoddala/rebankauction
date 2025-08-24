import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';
import { StorageService } from '../core/storage/storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

loginForm: FormGroup;
  loginFail: boolean = false;
  emptyForm: boolean = false;

  constructor(
    private _auth: AuthService,
    private _storage: StorageService,
    private _router: Router,
    // private _toast: ToastrService
  ) {

    if (localStorage.getItem('user')) {
      this._router.navigate(['/dashboard']);
    }
  
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      remember: new FormControl(false)
    });
  }

  ngOnInit(): void {
    // this._storage.removeLoginData();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // console.log("login token", token)
      // this._auth.verifyToken().subscribe({
      //   next: (response: any) => {
      //     if (response.logged_in_as) {
      //       this._router.navigateByUrl('/dashboard');
      //     }
      //   },
      //   error: (err: any) => {
      //     this.loginFail = true;
      //     console.error(err);
      //     this._router.navigateByUrl('/login');
      //     this._storage.removeLoginData();
      //   }
      // });
    }
  }

  login() {
    if (this.loginForm.value) {
      let validation = this.validations(this.loginForm.value);
      let loginData = this.loginForm.value;
      // const keyWordArray = CryptoJS.enc.Utf8.parse(environment.encryptionKey);
      // const ivWordArray = CryptoJS.enc.Utf8.parse(environment.encryptionIv);

      // Encrypt the password using AES-CBC with PKCS7 padding
      // const encrypted = CryptoJS.AES.encrypt(loginData.password, keyWordArray, {
      //   iv: ivWordArray,
      //   mode: CryptoJS.mode.CBC,
      //   padding: CryptoJS.pad.Pkcs7
      // });
      // loginData.password = encrypted.toString();

      console.log('loginData', this.loginForm.value);
      if (validation) {
        this.loginFail = false;
        this._auth.login(this.loginForm.value)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.setUser(res);
            this._router.navigateByUrl('/dashboard');
            console.log('User logged in:', res.user.role);
            this._storage.setLocalObject('location', res.user.location);
            this._storage.setLocalObject('user_type', res.user.role);
            if (res.user.role == 'admin' || res.user.role == 'agent') {
              this._storage.setLocalObject('userId', res.user._id);
              this._storage.setLocalObject('email', res.user.email);
            }
          },
          error: (err: any) => {
            this.loginFail = true;
            console.error(err);
          }
        });
      }
    }
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  setUser(res: any) {
    console.log(res.user)
    this._storage.setToken(res.user.token.access);
    this._storage.setLocalObject('user', res);
  }

  validations(formValues: { email: string; password: string }) {
    if (formValues.email == '' || formValues.password == '') {
      this.emptyForm = true;
      return false;
    } else {
      this.emptyForm = false;
      return true;
    }
  }

  me() {
    this._auth.currentUser();
  }

  logout() {
    this._auth.logoutUser();
  }
}
