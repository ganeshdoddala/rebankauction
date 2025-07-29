import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {SettingsService} from '../../../services/settings/settings.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  getemailIdentifier?:string;
  allPropertiesTypes:any;
  constructor(private _settings: SettingsService,){
  }
  ngOnInit() {
    this._settings.getEmail()?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.getemailIdentifier=res._id;
            this.setingsForm.patchValue({
              email: res.email,
              id:res._id
            });
          }
        })

      this._settings.getPropertyType()?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.allPropertiesTypes=Object.values(res);
          }
        })
    
  }
  
  mailSetResponse:any;

  setingsForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      id:new FormControl('')
    });


    addPropertyForm = new FormGroup({
      propertyType: new FormControl('', [Validators.required, Validators.email]),
      id:new FormControl('')
    });

    submitForm() {
      console.log(this.setingsForm.value);
      var payload = this.setingsForm.value;
      console.log(payload)
      payload.id = this.getemailIdentifier;
      this._settings.setEmail(payload)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.mailSetResponse=res.message;
          }
        })
    }

    submitPropertyForm(){
      console.log(this.addPropertyForm.value);
      var payload = this.addPropertyForm.value;
      console.log(payload)
      this._settings.setPropertyType(payload)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.mailSetResponse=res.message;
          }
        });
       this.addPropertyForm.reset(); 
    }

    
}
