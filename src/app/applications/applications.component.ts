
import { Component, OnInit, inject } from '@angular/core';

// PrimNG imports
import { ConfirmationService } from 'primeng/api';
import {Tag, TagModule} from 'primeng/tag';


// Project imports
import { FormView } from '../core/form-view';
import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { CardComponent } from '../theme/shared/components/card/card.component';
import { ApplicationType } from '../unity.model';
import { ApplicationService } from './application.service';
import { ButtonToolbarComponent } from '../theme/shared/components/button-toolbar/button-toolbar.component';
import {CoreModule} from '../core/core.module';
import { ApplicationFormComponent } from './application-form/application-form.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CoreModule,
    Tag,
    ButtonToolbarComponent,
    ApplicationFormComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  formView = FormView.listView();

  applications: any = [];
  isLoading: boolean = false;
  selectedApplication: any | null = null;

  ngOnInit() {
    this.loadApplications();
  }

  async loadApplications() {
    this.isLoading = true;
    try {
      const response = await this.applicationService.getApplications();
      this.applications = response.data;
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading applications:', error);
      this.notificationService.error('Failed to load applications');
      this.isLoading = false;
      this.applications = [];
    }
  }

  openCreateDialog() {
    this.selectedApplication = null;
    this.formView.resetToCreateView();
  }

  openEditDialog(application: any) {
    this.selectedApplication = { ...application };
    this.formView.resetToCreateView();
  }

  openDetailView(application: any) {
    this.selectedApplication = { ...application };
    this.formView.resetToDetailView();
  }

  async saveApplication(application: any) {
    try {
      const response = await this.applicationService.saveApplication(application);
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
      const response = await this.applicationService.renewApiKey(application.id);
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
        ? await this.applicationService.disableApplication(application.id)
        : await this.applicationService.enableApplication(application.id);

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
