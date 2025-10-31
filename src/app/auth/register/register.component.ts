// angular import
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { UserSession } from '../../core/user-session';
import { DataLookupService } from '../../core/services/data-lookup.service';
import {Select} from 'primeng/select';


@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, Select],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading = false;

  countries: any[] = [];

  private authService = inject(AuthService);
  private router = inject(Router);
  private dataLookup = inject(DataLookupService);
  private originalTheme: string | null = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.originalTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');

    this.initializeForm();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    if (this.originalTheme) {
      document.documentElement.setAttribute('data-theme', this.originalTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      "id": "",
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson: ['', [Validators.required, Validators.minLength(2)]],
      countryId: [''],
      mobileNo: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

  private async loadCountries(): Promise<void> {
    try {
      let response = await this.dataLookup.getCountries();
      this.countries = response.data;
    } catch (e) {
      console.error('Failed to load countries', e);
      this.countries = [];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;



      try {
        const response = await this.authService.register(formData);
        console.log('Registration successful:', response);
        if(response.success)
        {
          UserSession.login(response.data);
          this.router.navigate(['/dashboard']);
        }
        // Redirect to login page or show success message

      } catch (error) {
        console.error('Registration failed:', error);
        // Handle error - could show error message to user
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid mobile number';
      if (field.errors['requiredTrue']) return 'You must agree to the terms and conditions';
    }
    return '';
  }
}
