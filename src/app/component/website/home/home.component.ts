import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../agent/core/storage/storage.service';
import { AgentsService } from '../../services/agents/agents.service';
import { PropertiesService } from '../../services/properties/properties.service';
import { SettingsService } from '../../services/settings/settings.service';
import { OrderByPipe } from 'src/app/component/agent/core/util/util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthEndPoints } from '../../agent/core/consts';
import { environment } from 'src/environments/environment';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allProperties: any;
  allPropertiesTypes: any;
  stateNames: any;
  defaultImage: string = '../../../assets/img/property-1.jpg';
  listPrivateProperties: any = {};
  nullProperties:any = null;
  districtNames:any;
  selectedState:any = "";
  propertyDetails:any;
  showSuccess = false;
  rowLimit: number = 6; // Default limit for the number of rows to display
  constructor( private _properties: PropertiesService,private _settings: SettingsService,private _agent: AgentsService,
          private _storage:StorageService, private _router: Router,private _propery: PropertiesService,  private _service:SettingsService, private http:HttpClient) { 
          this._properties.getProperties()?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.allProperties=res;
            }
          })
          this._settings.getPropertyTypeAndCount()?.subscribe({
              next: (res: any) => {
                console.log(res)
                this.allPropertiesTypes=Object.values(res);
              }
            })
            
            this._settings.getSates()?.subscribe({
              next: (res: any) => {
                console.log(res[0].states)
                this.stateNames=res[0].states
              }
            })
            const getPPdata:any = {
              admin_approval:"approved",
              sale_type:"private"
            };
            this._properties.getPrivateProperties(getPPdata)?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.listPrivateProperties=res;
            }
          })

                  this._settings.getPropertyType()?.subscribe({
                      next: (res: any) => {
                        console.log(res)
                        this.allPropertiesTypes=Object.values(res);
                      }
                    })
          
                    let params = new HttpParams();
                      params = params.set('api-key', environment.stateanddistrictsapiKkey);
                      params = params.set('format', "json");
                      params = params.set('limit', 100);
                      this.http.get(AuthEndPoints.GET_STATE, { params })?.subscribe({
                            next: (res: any) => {
                              console.log(res.records)
                              this.stateNames = res.records.sort((a:any, b:any) =>
                                a.state_name_english.localeCompare(b.state_name_english)
                              );  
                            }
                      })
    }

  ngOnInit(): void {
  }

  viewProperty(id: any) {
    console.log(id);
    const url = this._router.serializeUrl(
    this._router.createUrlTree(['/property-details', id])
  );
  window.open(url, '_blank');
  }



  searchForm = new FormGroup({
        keyword: new FormControl(''),
        state: new FormControl(''),
        district: new FormControl(''),
        property_type: new FormControl('')
    })
  
  onStateChange(event:Event){
      console.log(this.selectedState)
      let params = new HttpParams();
      params = params.set('api-key', environment.stateanddistrictsapiKkey);
      params = params.set('format', "json");
      params = params.set('limit', 100);
      params = params.set('filters[state_name_english]', this.selectedState);
      this.http.get(AuthEndPoints.GET_DISTRICT, { params })?.subscribe({
        next: (res: any) => {
          this.districtNames = res.records.sort((a:any, b:any) =>
            a.district_name_english.localeCompare(b.district_name_english)
          )
        }
      })
    }
  
  submitForm() {
      var payload:any = this.searchForm.value;
        this._propery.querySearch(payload)?.subscribe({
            next: (res: any) => {
              console.log(res)
              if(res){
              this.allProperties=Object.values(res);
              }
            }
          })
    }
viewMoreProperties(){
  const url = this._router.serializeUrl(
      this._router.createUrlTree(['/properties'])
    );
    window.open(url, '_self');
}


  shareWhatsapp(property:any){
        const whatsappMessage = {
          title: property.title,
          price: property.reserveprice,
          location: `${property.location}, ${property.district}, ${property.state}`,
          link: `https://rebankauctions.com//property-details/${property._id}`
        };
  
      // const auctionMessage = `🏡 *${whatsappMessage.title}*\n📍 Location: ${whatsappMessage.location}\n💰 Price: ${whatsappMessage.price}\n🔗 View: ${whatsappMessage.link}\n🔗 Action ID: ${property.auctionId}`;
      const auctionMessage = `🏡 *${whatsappMessage.title}*\n📍 Location: ${whatsappMessage.location}\n💰 Price: ${whatsappMessage.price}\n🔗 View: ${whatsappMessage.link}\n🔗 Action ID: ${property.auctionId}`;
      const encodedMessage = encodeURIComponent(auctionMessage);
      const whatsappUrl = `https://wa.me/918277133999?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  
  
    selectedProperty:any | null = null;
    userDetails = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    
    openModal(property: Property): void {
      this.selectedProperty = property;
      console.log('Selected Property:', property);
      this.userDetails = { name: '', email: '', phone: '', message: '' };
      const modal = document.getElementById('interestModal');
      if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    }
    closeModal(): void {
    const modalElement = document.getElementById('interestModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
    getPropertyDetails(id: string): void {this._properties.getPropertyDetails(id)?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.propertyDetails=res;
            }
          })
        }
  
    submitInterest() {
      if (!this.selectedProperty) return;
      if (this.leadform.valid) {
        var payload:any = this.leadform.value;
        payload.property = this.selectedProperty;
        this._service.sendContactForm(payload)?.subscribe({
            next: (res: any) => {
              if(res){
              this.leadform.reset();
              this.closeModal();
              this.selectedProperty = null;
              // Auto-hide after 5 seconds
              setTimeout(() => this.showSuccess = false, 5000);
              }
            }
          })
      } else {
        console.log('Lead form is invalid');
      }
    }
  leadform = new FormGroup({
          name: new FormControl('', Validators.required),
          phoneNumber: new FormControl('', Validators.required),
          email: new FormControl('', Validators.required),
          message: new FormControl(''),
    })
  
  }
  
  
  export interface Property {
    id: string;
    name: string;
    location: string;
    price: number;
  }
