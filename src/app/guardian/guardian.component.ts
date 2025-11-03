import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { FormView } from '../core/form-view';
import { MessageService } from 'primeng/api';
import { GuardianService } from './guardian.service';
import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { GuardianCreateComponent } from './guardian-create/guardian-create.component';
import { GuardianStudentsComponent } from './guardian-students/guardian-students.component';

@Component({
  selector: 'app-guardians',
  standalone: true,
  imports: [CoreModule, GuardianCreateComponent, GuardianStudentsComponent],
  providers: [MessageService],
  templateUrl: './guardian.component.html',
  styleUrl: './guardian.component.scss'
})
export class GuardianComponent implements OnInit {
  private fb = inject(FormBuilder);
  private guardianService = inject(GuardianService);
  private notificationService = inject(NotificationService);

  formView: FormView = new FormView();
  guardianForm!: FormGroup;
  defaultGuardian: any = {};

  guardiansList: any[] = [];
  selectedGuardian: any | null = null;
  loading = false;



  ngOnInit(): void {
    this.initializeForm();
    this.loadGuardians();
  }

  initializeForm() {
    this.guardianForm = this.fb.group({
      id: [null],
      fullname: [''],
      mobileNo: [''],
      emailAddress: ['']
    });
    this.defaultGuardian = this.guardianForm.getRawValue();
  }

  async loadGuardians() {
    try {
      this.loading = true;
      const param: any = { general: true };
      const resp = await this.guardianService.getGuardians(param);

        this.guardiansList = resp.data ;

    } catch (e) {
      this.guardiansList = [];
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    const payload = this.guardianForm.value;
    if (this.selectedGuardian) {
      payload.id = this.selectedGuardian.id;
    }
    await this.saveGuardian(payload);
  }

  async saveGuardian(payload: any) {
    try {
      const resp = await this.guardianService.saveGuardian(payload);
      if (resp?.success) {
        CollectionUtil.add(this.guardiansList, resp.data);
        this.closeDialog();
      }
    } catch (e) {
      this.notificationService.error('Failed to save Guardian');
    }
  }

  editGuardian(guardian: any) {
    this.selectedGuardian = guardian;
    this.guardianForm.patchValue(guardian);
    this.formView.resetToCreateView();
  }

  viewDetails(guardian: any) {
    this.selectedGuardian = guardian;
    this.formView.resetToDetailView();
  }

  async deleteGuardian(guardian: any) {
    if (confirm(`Delete guardian "${guardian.fullname || guardian.mobileNo}"?`)) {
      try {
        this.loading = true;
        const resp = await this.guardianService.deleteGuardian(guardian.id);
        if (resp?.success) {
          CollectionUtil.remove(this.guardiansList, guardian.id);
        }
      } catch (e) {
        this.notificationService.error('Failed to delete Guardian');
      } finally {
        this.loading = false;
      }
    }
  }

  initNew() {
    this.selectedGuardian = null;
    this.resetForm();
    this.formView.resetToCreateView();
  }

  closeDialog() {
    this.formView.resetToListView();
    this.resetForm();
  }

  goBackToList() {
    this.formView.resetToListView();
  }

  resetForm() {
    this.guardianForm.reset(this.defaultGuardian);
  }
}
