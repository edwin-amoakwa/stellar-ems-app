
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ApplicationType } from '../../unity.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputSwitchModule
  ],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() application: any | null = null;
  @Output() applicationSubmitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  applicationForm!: FormGroup;
  applicationTypes = [
    { label: 'SMS', value: ApplicationType.SMS },
  ];

  ngOnInit() {
    this.initializeForm();
    if (this.application) {
      this.populateForm();
    }
  }

  private initializeForm() {
    this.applicationForm = this.fb.group({
      id: "",
      appName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      applicationType: [null, [Validators.required]],
      callBackUrl: [''],
      allowedIpAddresses: [''],
      enableIpRestriction: [false]
    });

    // Watch for application type changes to update type name
    this.applicationForm.get('applicationType')?.valueChanges.subscribe(type => {
      if (type) {
        const selectedType = this.applicationTypes.find(t => t.value === type);
        if (selectedType) {
          this.applicationForm.patchValue({
            applicationTypeName: selectedType.label
          }, { emitEvent: false });
        }
      }
    });
  }

  private populateForm() {
    if (this.application) {
      this.applicationForm.patchValue(this.application);
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      const formValue = this.applicationForm.value;

      this.applicationSubmitted.emit(formValue);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }



  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      appName: 'Application Name',
      apiKey: 'API Key',
      currentPrice: 'Current Price',
      applicationType: 'Application Type',
      applicationTypeName: 'Application Type Name',
      merchantId: 'Merchant ID',
      callBackUrl: 'Callback URL',
      allowedIpAddresses: 'Allowed IP Addresses',
      enableIpRestriction: 'Enable IP Restriction'
    };
    return labels[fieldName] || fieldName;
  }
}
