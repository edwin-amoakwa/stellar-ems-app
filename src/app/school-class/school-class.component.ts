
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimNG imports
import { ConfirmationService } from 'primeng/api';



// Project imports
import { FormView } from '../core/form-view';
import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { ApplicationType } from '../unity.model';
import { SchoolClassService } from './school-class.service';
import { ButtonToolbarComponent } from '../theme/shared/components/button-toolbar/button-toolbar.component';
import {CoreModule} from '../core/core.module';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CoreModule
  ],
  providers: [ConfirmationService],
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {
  private schoolClassService = inject(SchoolClassService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  formView = FormView.listView();

  applications: any = [];
  isLoading: boolean = false;
  selectedApplication: any | null = null;

  applicationForm!: FormGroup;
  applicationTypes = [
    { label: 'SMS', value: ApplicationType.SMS },
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadApplications();
  }

  private initializeForm() {
    this.applicationForm = this.fb.group({
      id: [''],
      appName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      applicationType: [null, [Validators.required]],
      callBackUrl: [''],
      allowedIpAddresses: [''],
      enableIpRestriction: [false]
    });

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

  private populateForm(application: any | null) {
    if (application) {
      this.applicationForm.patchValue(application);
    } else {
      this.applicationForm.reset({
        id: '',
        appName: '',
        applicationType: null,
        callBackUrl: '',
        allowedIpAddresses: '',
        enableIpRestriction: false
      });
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      this.saveApplication(this.applicationForm.value);
    } else {
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.formView.resetToListView();
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

  openCreateDialog() {
    this.selectedApplication = null;
    this.populateForm(null);
    this.formView.resetToCreateView();
  }

  openEditDialog(application: any) {
    this.selectedApplication = { ...application };
    this.populateForm(this.selectedApplication);
    this.formView.resetToCreateView();
  }

  async loadApplications() {
    this.isLoading = true;
    try {
      const response = await this.schoolClassService.getClassesList();
      this.applications = response.data;
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading applications:', error);
      this.notificationService.error('Failed to load applications');
      this.isLoading = false;
      this.applications = [];
    }
  }


  openDetailView(application: any) {
    this.selectedApplication = { ...application };
    this.formView.resetToDetailView();
  }

  async saveApplication(application: any) {
    try {
      const response = await this.schoolClassService.saveClass(application);
      if (response.success) {
        CollectionUtil.add(this.applications, response.data);
        this.formView.resetToListView();
      }
    } catch (error) {
      console.error('Error with application:', error);
    }
  }

  async renewApiKey(application: any) {
    try {
      const response = await this.schoolClassService.renewApiKey(application.id);
      if (response.success) {

this.selectedApplication = response.data;
        CollectionUtil.add(this.applications, response.data);

        this.notificationService.success('API Key renewed successfully');
      }
    } catch (error) {
      console.error('Error renewing API key:', error);
      this.notificationService.error('Failed to renew API key');
    }
  }

  async toggleApplicationStatus(application: any) {
    try {
      const response = application.activeStatus
        ? await this.schoolClassService.disableApplication(application.id)
        : await this.schoolClassService.enableApplication(application.id);

      if (response.success) {
        this.selectedApplication = response.data;
        CollectionUtil.add(this.applications, response.data);

        const action = application.activeStatus ? 'disabled' : 'enabled';
        this.notificationService.success(`Application ${action} successfully`);
      }
    } catch (error) {
      console.error('Error toggling application status:', error);
      this.notificationService.error('Failed to update application status');
    }
  }



  getApplicationTypeSeverity(type: ApplicationType | null): 'success' | 'warning' | 'danger' | 'info' {
    if (!type) return 'info';

    switch (type) {
      case ApplicationType.SMS:
        return 'success';
      default:
        return 'info';
    }
  }



  maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length <= 8) return apiKey;
    return apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
  }
}
