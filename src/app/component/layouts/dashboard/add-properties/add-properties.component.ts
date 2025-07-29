import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(private _settings: SettingsService,private _agent: AgentsService,
      private _storage:StorageService, private _router: Router,private _propery: PropertiesService, private http:HttpClient){
    }
    ngOnInit() {
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

    
auctionDetailsForm = new FormGroup({
    title: new FormControl('', Validators.required),
    organizationName: new FormControl('', Validators.required),
    organizationBranch: new FormControl(''),
    propertyCategory: new FormControl('', Validators.required),
    propertySubCategory: new FormControl('', Validators.required),
    propertyDescription: new FormControl('', Validators.required),
    borrowerName: new FormControl('', Validators.required),
    country: new FormControl('India', Validators.required),
    state: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    saleType: new FormControl('', Validators.required),
    propertyType: new FormControl('', Validators.required),
    projectSize: new FormControl('', Validators.required),
    phonenumber: new FormControl('', Validators.required),
    reserveprice: new FormControl('', Validators.required),
    emdAmount: new FormControl('', Validators.required),
    emdSubmission: new FormControl('', Validators.required),
    auctiondatetime: new FormControl('', Validators.required),
    auctionId: new FormControl('', Validators.required),
  });

  submitForm() {
    console.log(this.auctionDetailsForm.value);
    var payload:any = this.auctionDetailsForm.value;
    payload.createdBy = this._storage.getLocalvalue('user_type');
    this._propery.addProperty(payload)?.subscribe({
      next: (res: any) => {
        console.log(res)
        this.forResponse=res.message;
        this._router.navigateByUrl('/dashboard/getproperties');
      }
    })
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
  // submitBulkProperties(event: Event){
  //   const formData = new FormData();
  //   formData.append('file', this.auctionDetailsUploadForm.get('file')?.value);
  //   console.log(this.auctionDetailsUploadForm.get('file')?.value);
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   console.log(file)
  //   if (file && file.name.endsWith('.csv')) {
      
  //     // this.auctionDetailsUploadForm.patchValue({ fileSource: file });
  //     var payload:any = this.auctionDetailsUploadForm.get('file')?.value;
  //     console.log(payload);
  //     return true;
  //     // payload.createdBy = this._storage.getLocalvalue('user_type');
  //     this._propery.uploadBulkProperties(payload)?.subscribe({
  //       next: (res: any) => {
  //         console.log(res)
  //         this.forResponse=res.message;
  //         this._router.navigateByUrl('/dashboard/getproperties');
  //       }
  //     })
  //   } else {
  //     alert('Please upload a valid CSV file.');
  //     this.auctionDetailsUploadForm.reset({
  //       file:null
  //     });
  //     this.auctionDetailsUploadFormResponse="Please add a valid CSV file"
  //   }
  //   return this.auctionDetailsUploadFormResponse;
  // }

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

  auctionDetailsUploadFormCancel(){
  this.bulkUploadSection = false;
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
}
