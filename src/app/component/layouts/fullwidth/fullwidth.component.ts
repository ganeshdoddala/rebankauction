import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../auth/services/auth.service';
// import { StorageService } from '../../core/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fullwidth',
  templateUrl: './fullwidth.component.html',
  styleUrls: ['./fullwidth.component.scss']
})
export class FullwidthComponent {
  constructor(
    // private _auth: AuthService,
    // private _toast: ToastrService,
    // private _storage: StorageService,
    // private _router: Router
  ) {}

  // loginFail: boolean = false;

  ngOnInit(): void {
    console.log("Fullwidth")
    // this._storage.removeLoginData();
    // const token = localStorage.getItem('token');
    // const user = localStorage.getItem('user');

    // if (token && user) {
    //   // console.log("login token full", token)
    //   this._auth.verifyToken()?.subscribe({
    //     next: (response: any) => {
    //       console.log('1', response);
    //       if (response.logged_in_as) {
    //         // console.log("into dash full")
    //         this._router.navigateByUrl('/dashboard');
    //       }
    //     },
    //     error: (err: any) => {
    //       this.loginFail = true;
    //       console.error(err);
    //       this._router.navigateByUrl('/login');
    //       // console.log("2nd login full")
    //       this._storage.removeLoginData();
    //     }
    //   });
  //   }
  }
}
