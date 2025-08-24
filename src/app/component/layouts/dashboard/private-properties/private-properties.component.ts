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

@Component({
  selector: 'app-private-properties',
  templateUrl: './private-properties.component.html',
  styleUrls: ['./private-properties.component.css']
})
export class PrivatePropertiesComponent {

  allProperties:any;
  viewApprovalRequireProperties:any;
  viewPrivateProperties:boolean =true;
  addPrivateProperties:boolean =false;
  viewadminApprovals:boolean =false;
  isPrivatePropertySubmitting:boolean =false;
  allPropertiesTypes:any;
  propertySubTypes:any;
  stateNames:any;
  districNames:any;
  selectedState:any="";
  isAdmin:boolean = false;

  getPPdata = {
      admin_approval:"approved",
      sale_type:"private",
      postedBy:this._storage.getLocalvalue('email')
    }
  constructor(
    private _properties: PropertiesService,private _settings: SettingsService,private _agent: AgentsService,
          private _storage:StorageService, private _router: Router, private http:HttpClient
  ){
    this.getPrivateProperties();
    console.log(this._storage.getLocalvalue('email'))
  }
  ngOnInit() {
  this.isAdmin = this._storage.getLocalvalue('user_type') === 'admin';

    this.viewPrivateProperties = true;
    this.addPrivateProperties =false;
    this.viewadminApprovals =false;
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


  getPrivateProperties(){
    this._properties.getPrivateProperties(this.getPPdata)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.allProperties=res;
          }
        });
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

 cancelAddProperty(){
   this.viewPrivateProperties=true;
   this.addPrivateProperties =false;
   this.viewadminApprovals =false;
   this.isPrivatePropertySubmitting = false;
  }

  addPropertyComponent(){
    this.viewPrivateProperties=false;
    this.addPrivateProperties =true;
    this.viewadminApprovals =false;
    this.isPrivatePropertySubmitting = false;
  }

  editProperty(id:any) {
    this._properties.getPropertyDetails(id)?.subscribe(data => {
      this.PPDetailsForm.patchValue(data);
      this.viewPrivateProperties=false;
      this.addPrivateProperties =true;
      this.viewadminApprovals =false;
      this.isPrivatePropertySubmitting = false;
    });
  }
  addProperty(){
    this.isPrivatePropertySubmitting = true;
    console.log(this.PPDetailsForm.value)
    var payload:any = this.PPDetailsForm.value;
    payload.createdBy = this._storage.getLocalvalue('user_type');
    payload.postedBy = this._storage.getLocalvalue('email');
    this._properties.addPrivateProperty(payload)?.subscribe({
      next: (res: any) => {
        console.log(res)
        this.getPrivateProperties();
        this.PPDetailsForm.reset();
        this.viewPrivateProperties=true;
        this.isPrivatePropertySubmitting = false;
        this.addPrivateProperties = false;
        this._router.navigateByUrl('/dashboard/privateproperties');
      }
    })

  }
  viewAdminApprovals(){
    this.viewPrivateProperties=false;
    this.addPrivateProperties =false;
    this.viewadminApprovals =true;
    const getPPdata = {
      admin_approval:"pending",
      sale_type:"private",
      postedBy: ''
    }
    this._properties.getPrivateProperties(getPPdata)?.subscribe({
          next: (res: any) => {
            if(res.length != 0){
            this.viewApprovalRequireProperties=res;
            } else {
              this.viewApprovalRequireProperties = [];
            }
          }
        });
  }

  viewProperty(id:any){
    this._properties.getPropertyDetails(id)?.subscribe({
          next: (res: any) => {
            const url = this._router.serializeUrl(
            this._router.createUrlTree(['/property-details', id])
          );
          window.open(url, '_blank');
            this.viewAdminApprovals()
            this.viewPrivateProperties = false;
            this.addPrivateProperties =false;
            this.viewadminApprovals =true;
          }
        })
  }
  approveProperty(id:any){
    this._properties.approveProperty(id)?.subscribe({
          next: (res: any) => {
            // this.reloadComponent();
            this.viewAdminApprovals()
            this.viewPrivateProperties = false;
            this.addPrivateProperties =false;
            this.viewadminApprovals =true;
          }
        })
  }

 delPrivateProperty(id:any){
    this._properties.delProperty(id)?.subscribe({
          next: (res: any) => {
            // this.reloadComponent();
            this.viewAdminApprovals();
          }
        })
  }

  reloadComponent() {
  const currentUrl = this._router.url;
  this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this._router.navigate([currentUrl]);
  });
}
  PPDetailsForm = new FormGroup({
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
      saleType: new FormControl('private', Validators.required),
      propertyType: new FormControl('', Validators.required),
      projectSize: new FormControl('', Validators.required),
      phonenumber: new FormControl('', Validators.required),
      reserveprice: new FormControl('', Validators.required),
      emdAmount: new FormControl('', Validators.required),
      emdSubmission: new FormControl('', Validators.required),
      auctiondatetime: new FormControl('', Validators.required),
      auctionId: new FormControl('', Validators.required),
    });

  onCancel(): void {
  if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
    this.PPDetailsForm.reset();
    this.addPrivateProperties = false;
    this.viewPrivateProperties = true;
  }
}
}
