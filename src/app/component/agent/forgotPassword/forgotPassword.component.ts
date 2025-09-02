import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-forgotPassword',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  responseMessage = '';
  isSubmitting = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    
  }
  ngOnInit() {
    
  }
  forgotForm = new FormGroup({
      email:  new FormControl('', [Validators.required, Validators.email])
    });

  resetPassword() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const email = this.forgotForm.value.email;
    if (!email) {
      this.responseMessage = 'Please enter a valid email address.';
      this.isSubmitting = false;
      return;
    }
    this.authService.sendResetLink(email)?.subscribe({
      next: (res: any) => {
        this.responseMessage = res.message || 'Reset link sent to your email.';
        this.isSubmitting = false;
      },
      error: () => {
        this.responseMessage = 'Something went wrong. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}