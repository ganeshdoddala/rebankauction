import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../services/properties/properties.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent {
  propertyDetails: any;
  defaultImage: string = '../../../assets/img/property-1.jpg';
  InterestedFormVisibility:boolean = false;
  formResponse:any = null;
  constructor(private route: ActivatedRoute, private _properties: PropertiesService, private _router: Router,private _service:SettingsService) {
    this.formResponse = null;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.formResponse = null;
    if (!id) {
      console.error('Property ID is not available');
      this._router.navigateByUrl('/properties');
      return;
    }
    this._properties.getPropertyDetails(id)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.propertyDetails=res;
          }
        })
  }
  InterestedFormselect() {
    this.InterestedFormVisibility = !this.InterestedFormVisibility;
    this.formResponse = null;
    this.leadform.reset();
  }
  submitLeadForm() {
      console.log('Lead form submitted:', this.leadform.value);

    if (this.leadform.valid) {
      var payload:any = this.leadform.value;
      payload.property = this.propertyDetails;
      this._service.sendContactForm(payload)?.subscribe({
          next: (res: any) => {
            if(res){
            this.formResponse=res.message;
            this.leadform.reset();
            }
          }
        })
      this.InterestedFormVisibility = false; // Hide the form after submission
    } else {
      console.log('Lead form is invalid');
    }
  }

  leadform = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl(''),
  })
}