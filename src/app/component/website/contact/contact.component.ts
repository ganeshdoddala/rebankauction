import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
 formResponse:String | undefined;
  constructor(private _service:SettingsService) { }

  ngOnInit(): void {
  }
  
contactForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      mesage: new FormControl('')
  })


  submitForm() {
    var payload:any = this.contactForm.value;
      this._service.sendContactForm(payload)?.subscribe({
          next: (res: any) => {
            if(res){
            this.formResponse=res.message;
            }
          }
        })
  }
}
