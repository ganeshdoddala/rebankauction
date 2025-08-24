import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthEndPoints } from 'src/app/component/agent/core/consts';
import { StorageService } from 'src/app/component/agent/core/storage/storage.service';
import { AgentsService } from 'src/app/component/services/agents/agents.service';
import { PropertiesService } from 'src/app/component/services/properties/properties.service';
import { SettingsService } from 'src/app/component/services/settings/settings.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-properties',
  templateUrl: './add-properties.component.html',
  styleUrls: ['./add-properties.component.css']
})
export class AddPropertiesComponent {
  allPropertiesTypes: any;
  propertySubTypes:any;
  stateNames:any;
  districNames:any;
  forResponse:any;
  selectedState:any ="";
  bulkUploadSection:boolean = false;
  auctionDetailsUploadFormResponse:String | undefined;
  fileToUpload: File | null = null;
  isauctionDetailsSubmitting: boolean = false;
  isEditMode = false;
  propertyId: string | null = null;

  constructor(private _settings: SettingsService,private _agent: AgentsService,
      private _storage:StorageService, private _router: Router,private _propery: PropertiesService, private http:HttpClient, private route: ActivatedRoute){
    }
    ngOnInit() {
      this.propertyId = this.route.snapshot.paramMap.get('id');
      this.isEditMode = !!this.propertyId;
      if (this.isEditMode) {
        this.loadPropertyDetails(this.propertyId);
      }
      this.bulkUploadSection = false;
        this._settings.getPropertyType()?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.allPropertiesTypes=Object.values(res);
            }
          })

          this._settings.getSubPropertyType()?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.propertySubTypes=Object.values(res);
            }
          })
            let params = new HttpParams();
            params = params.set('api-key', environment.stateanddistrictsapiKkey);
            params = params.set('format', "json");
            params = params.set('limit', 100);
            this.http.get(AuthEndPoints.GET_STATE, { params })?.subscribe({
                  next: (res: any) => {
                    console.log(res.records)
                    this.stateNames = res.records
                  }
            })
          
    }

     loadPropertyDetails(id: any): void {
        this._propery.getPropertyDetails(id)?.subscribe(data => {
          this.auctionDetailsForm.patchValue(data);
        }); 
      }

    auctionDetailsForm = new FormGroup({
    title: new FormControl('', Validators.required),
    organizationName: new FormControl('', Validators.required),
    organizationBranch: new FormControl(''),
    propertyCategory: new FormControl('', Validators.required),
    propertySubCategory: new FormControl(''),
    propertyDescription: new FormControl('', Validators.required),
    borrowerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]),
    country: new FormControl('India'),
    state: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    location: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z\s,.-]+$/)
    ]),
    saleType: new FormControl('auction'),
    propertyType: new FormControl('', Validators.required),
    projectSize: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?\s?(Acr|Sqft|Sqm|Ha)$/i)
    ]),
    phonenumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/), // Valid Indian mobile number
      Validators.maxLength(10)
    ]),
    reserveprice: new FormControl('', [Validators.required, Validators.min(1000)]),
    emdAmount: new FormControl('', [Validators.required, Validators.min(1000)]),
    emdSubmission: new FormControl('', Validators.required),
    auctiondatetime: new FormControl('', [
      Validators.required,
      this.futureDateValidator
    ]),
    auctionId: new FormControl('', Validators.required)
  });

  futureDateValidator(control: FormControl): { [key: string]: any } | null {
  const selectedDate = new Date(control.value);
  return selectedDate > new Date() ? null : { pastDate: true };
  }

  submitForm() {
  
  if (this.auctionDetailsForm.invalid) {
    this.auctionDetailsForm.markAllAsTouched();
    return;
  }
  else{
    this.isauctionDetailsSubmitting = true;
    const payload = {
      ...this.auctionDetailsForm.value,
      createdBy: this._storage.getLocalvalue('user_type')
    };
    if (this.isEditMode) {
      this._propery.updateProperty(this.propertyId, payload)?.subscribe({
        next: (res: any) => {
          console.log('Property updated:', res);
          this.forResponse = res.message;
          setTimeout(() => {
          this.forResponse = null;
        }, 5000); // hides after 5 seconds
        this.auctionDetailsForm.reset();
        this._router.navigateByUrl('/dashboard/getproperties');
        this.isauctionDetailsSubmitting = false;
        }
      });
    } else {
      this._propery.addProperty(payload)?.subscribe({
        next: (res: any) => {
          console.log('Property added:', res);
          this.forResponse = res.message;
        setTimeout(() => {
          this.forResponse = null;
        }, 5000); // hides after 5 seconds
        this.auctionDetailsForm.reset();
        this._router.navigateByUrl('/dashboard/getproperties');
        this.isauctionDetailsSubmitting = false;
      },
      error: (err: any) => {
        console.error('Error adding property:', err);
        this.forResponse = 'Something went wrong. Please try again.';
        this.isauctionDetailsSubmitting = false;
      }
    });
  }
  }
}


  onStateChange(event:Event){
    console.log(this.selectedState)
    let params = new HttpParams();
    params = params.set('api-key', environment.stateanddistrictsapiKkey);
    params = params.set('format', "json");
    params = params.set('limit', 100);
    params = params.set('filters[state_name_english]', this.selectedState);
    this.http.get(AuthEndPoints.GET_DISTRICT, { params })?.subscribe({
      next: (res: any) => {
        this.districNames = res.records
      }
    })
  }

  loadBulkUpload(){
    this.bulkUploadSection = true;
  }
  

uploadExcel(){
    if(this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this._propery.uploadBulkProperties(formData)?.subscribe({
    next: (res: any) => {
      console.log(res);
      this.forResponse = res.message;
      this._router.navigateByUrl('/dashboard/getproperties');
    }
  })
}
}
  auctionDetailsUploadForm = new FormGroup({
    file: new FormControl<File | null>(null, Validators.required)
  });

  auctionDetailsUploadFormCancel(): void {
    this.auctionDetailsUploadForm.reset();
    this.bulkUploadSection = false;
    this.auctionDetailsUploadFormResponse = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
      console.log("Selected file:", this.fileToUpload);
    } else {
      this.fileToUpload = null;
      console.log("No file selected");
    }
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      this.auctionDetailsForm.reset();
      this.bulkUploadSection = false;
      this.forResponse = null;
    }
  }
}
