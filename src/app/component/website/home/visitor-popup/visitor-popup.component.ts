import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VisitorEnquiryService } from '../../../services/visitor-enquiry/visitor-enquiry.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-visitor-popup',
  templateUrl: './visitor-popup.component.html',
  styleUrls: ['./visitor-popup.component.css']
})
export class VisitorPopupComponent implements OnInit, AfterViewInit {
  @ViewChild('visitorModal') visitorModal!: ElementRef;
  @Output() popupClosed = new EventEmitter<void>();

  isSubmitting: boolean = false;
  showPopup: boolean = true;
  modalInstance: any;

  // Form with validation
  visitorForm: FormGroup;

  constructor(
    private _visitorEnquiryService: VisitorEnquiryService,
    private _toastr: ToastrService
  ) {
    this.visitorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/) // 10 digit mobile number
      ]),
      propertyLocation: new FormControl('', [Validators.required]),
      additionalDetails: new FormControl('')
    });
  }

  ngOnInit(): void {
    // this.initializePopup();
    this.showPopupModal();
  }

  ngAfterViewInit(): void {
    this.showPopupModal();
  }

  /**
   * Initialize popup - check if user has already seen it
   */
  initializePopup(): void {
    const hasSeenPopup = localStorage.getItem('visitorPopupSeen');
    
    // Show popup only if user hasn't seen it before
    if (!hasSeenPopup) {
      this.showPopup = true;
    } else {
      this.showPopup = false;
    }
  }

  /**
   * Display the modal using Bootstrap
   */
  showPopupModal(): void {
    if (this.visitorModal && this.showPopup) {
      try {
        const modalElement = this.visitorModal.nativeElement;
        this.modalInstance = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        this.modalInstance.show();
      } catch (error) {
        console.error('Error initializing modal:', error);
      }
    }
  }

  /**
   * Submit visitor enquiry form
   */
  submitForm(): void {
    if (this.visitorForm.invalid) {
      this._toastr.error('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    this.isSubmitting = true;

    const formData = {
      name: this.visitorForm.get('name')?.value,
      email: this.visitorForm.get('email')?.value,
      mobile: this.visitorForm.get('mobile')?.value,
      propertyLocation: this.visitorForm.get('propertyLocation')?.value,
      additionalDetails: this.visitorForm.get('additionalDetails')?.value || ''
    };
    console.log('Submitting Visitor Enquiry:', formData);
    this._visitorEnquiryService.submitVisitorEnquiry(formData)?.subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this._toastr.success('Thank you! We will contact you soon.', 'Success');
        
        // Mark popup as seen
        localStorage.setItem('visitorPopupSeen', 'true');
        
        // Close modal
        this.closePopup();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error submitting enquiry:', err);
        this._toastr.error('Error submitting form. Please try again.', 'Error');
      }
    });
  }

  /**
   * Close the popup modal
   */
  closePopup(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    
    // Mark popup as seen even if user closes without submitting (optional)
    localStorage.setItem('visitorPopupSeen', 'true');
    
    this.popupClosed.emit();
  }

  /**
   * Get form control for template
   */
  get name() {
    return this.visitorForm.get('name');
  }

  get email() {
    return this.visitorForm.get('email');
  }

  get mobile() {
    return this.visitorForm.get('mobile');
  }

  get propertyLocation() {
    return this.visitorForm.get('propertyLocation');
  }

  get additionalDetails() {
    return this.visitorForm.get('additionalDetails');
  }
}
