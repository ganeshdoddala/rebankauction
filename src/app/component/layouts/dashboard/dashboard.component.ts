import { Component } from '@angular/core';
import { AuthService } from '../../agent/auth/services/auth.service';
import { StorageService } from '../../agent/core/storage/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isAdmin:boolean = false;
  constructor(
      private _auth: AuthService, private _storage:StorageService
    ) {
      console.log(this._storage.getLocalvalue('user_type'))
      const userType = this._storage.getLocalvalue('user_type');
      this.isAdmin = userType == 'admin';
    }

  
  logout(){
    this._auth.logoutUser()
  }

}
