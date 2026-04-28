import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { AuthEndPoints, ApiMethod } from '../../agent/core/consts';
import { HttpService } from '../../agent/core/http/http.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  copyRightYear: any;
  subscriptionForm!: FormGroup;
  isSubmitting: boolean = false;
  subscriptionMessage: string = '';
  subscriptionMessageType: 'success' | 'error' | 'info' = 'info';
  locations: string[] = [];
  formFields: any[] = [];
  isLoadingForm: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _subscriptionService: SubscriptionService,
    private _http: HttpService
  ) {
    this.copyRightYear = (new Date()).getFullYear();
  }

  ngOnInit(): void {
    this.loadStates();
    this.loadFormConfig();
  }

  loadStates(): void {
    this._http.requestCall(AuthEndPoints.STATES, ApiMethod.GET)?.subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.locations = response.map((state: any) => state.stateName).filter((name: string) => !!name);
        } else if (response && response.data && Array.isArray(response.data)) {
          this.locations = response.data.map((state: any) => state.stateName).filter((name: string) => !!name);;
        } else if (response && response.states && Array.isArray(response.states)) {
          this.locations = response.states;
        }
      },
      error: () => {
        console.log('Failed to load states, using default locations');
        // Fallback to default locations if API fails
        this.locations = [
          'Bangalore',
          'Delhi',
          'Mumbai',
          'Pune',
          'Hyderabad',
          'Kolkata',
          'Chennai',
          'Ahmedabad'
        ];
      }
    });
  }

  // Custom validator and transformer for email
  lowercaseEmailValidator(control: AbstractControl): any {
    if (control.value) {
      const lowercaseValue = control.value.toLowerCase();
      if (control.value !== lowercaseValue) {
        control.setValue(lowercaseValue, { emitEvent: false });
      }
    }
    return Validators.email(control);
  }

  loadFormConfig(): void {
    this._subscriptionService.getSubscriptionConfig()?.subscribe({
      next: (response: any) => {
        if (response && response.fields) {
          this.formFields = response.fields;
          this.initializeFormWithConfig(response.fields);
        } else {
          this.initializeFormWithDefaults();
        }
        this.isLoadingForm = false;
      },
      error: () => {
        this.initializeFormWithDefaults();
        this.isLoadingForm = false;
      }
    });
  }

  initializeFormWithConfig(fields: any[]): void {
    const formGroup: any = {};
    fields.forEach(field => {
      const validators = this.getValidators(field);
      formGroup[field.name] = ['', validators];
    });
    this.subscriptionForm = this._formBuilder.group(formGroup);
  }

  initializeFormWithDefaults(): void {
    this.formFields = [
      { name: 'name', label: 'Full Name', type: 'text', required: true, minLength: 2 },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'preferredLocation', label: 'Preferred Location', type: 'select', required: true, options: this.locations.length > 0 ? this.locations : ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai', 'Ahmedabad'] }
    ];
    this.subscriptionForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, this.lowercaseEmailValidator.bind(this)]],
      preferredLocation: ['', [Validators.required]]
    });
  }

  getValidators(field: any): any[] {
    const validators: any[] = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.type === 'email') {
      validators.push(this.lowercaseEmailValidator.bind(this));
    }
    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }
    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }
    return validators;
  }

  submit(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionMessage = 'Please fill in all fields correctly';
      this.subscriptionMessageType = 'error';
      return;
    }

    this.isSubmitting = true;
    this.subscriptionMessage = '';

    const payload = this.subscriptionForm.value;
    // Ensure email is lowercase before sending
    if (payload.email) {
      payload.email = payload.email.toLowerCase();
    }

    this._subscriptionService.subscribe(payload)?.subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success === false && response.message?.includes('already')) {
          this.subscriptionMessage = 'Already registered';
          this.subscriptionMessageType = 'info';
        } else if (response.success === true || response.statusCode === 200) {
          this.subscriptionMessage = 'Successfully subscribed!';
          this.subscriptionMessageType = 'success';
          this.subscriptionForm.reset();
        } else {
          this.subscriptionMessage = response.message || 'Subscription failed';
          this.subscriptionMessageType = 'error';
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        const message = error?.error?.message || error?.message || 'An error occurred';
        if (message.toLowerCase().includes('already')) {
          this.subscriptionMessage = 'Already registered';
          this.subscriptionMessageType = 'info';
        } else {
          this.subscriptionMessage = message;
          this.subscriptionMessageType = 'error';
        }
      }
    });
  }

  resetForm(): void {
    this.subscriptionForm.reset();
    this.subscriptionMessage = '';
  }
}