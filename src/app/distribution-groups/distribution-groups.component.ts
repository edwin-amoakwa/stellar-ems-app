import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { MessageBox } from '../message-helper';
import { StaticDataService } from '../static-data.service';
import { DistributionGroupsService } from './distribution-groups.service';
import { GroupContactsComponent } from './group-contacts/group-contacts.component';
import {ButtonToolbarComponent} from '../theme/shared/components/button-toolbar/button-toolbar.component';
import {FormView} from '../core/form-view';
import {CardComponent} from '../theme/shared/components/card/card.component';

@Component({
  selector: 'app-distribution-groups',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    CardModule,
    DialogModule,
    ToastModule,
    Tooltip,
    GroupContactsComponent,
    Textarea, ScrollPanelModule, ButtonToolbarComponent, CardComponent
  ],
  templateUrl: './distribution-groups.component.html',
  styleUrls: ['./distribution-groups.component.scss']
})
export class DistributionGroupsComponent implements OnInit {

   private fb = inject(FormBuilder);
   private notificationService = inject(NotificationService);
   private distributionGroupsService = inject(DistributionGroupsService);


  groups: any[] = [];
  groupForm!: FormGroup;
  formView = FormView.listView();

  showGroupDialog = false;
  // Dialog for add/remove phone numbers
  showPhoneDialog = false;
  phoneDialogMode: 'add' | 'remove' | null = null;
  editingGroup: any | null = null;
  selectedGroup: any | null = null;
  loading = false;

  newFreeFormPhoneNos:string = '';

  groupTypeList = StaticDataService.groupTypes();

  constructor() {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadGroups();

  }

  initializeForm(): void {
    this.groupForm = this.fb.group({
      id: [""],
      groupType: ["", [Validators.required]],
      groupName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  countContactsInTextBox()
  {
    console.log("==countContactsInTextBox() called==");
    console.log("==countContactsInTextBox() newFreeFormPhoneNos == ",this.newFreeFormPhoneNos);
    const lines = this.newFreeFormPhoneNos.split(/\r?\n/).filter(line => line.trim() !== '');
    console.log("==countContactsInTextBox() lines == ",lines);
    // const length = lines.length > 0 ? lines.length - 1 : 0;
    const length = lines.length;
    // this.groupForm.controls['totalRecipient'].setValue(length);
    this.selectedGroup.contactCount = length;
  }

  async loadGroups(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.distributionGroupsService.getDistributionGroups();
      this.groups = response.data;
    } catch (error) {
      this.notificationService.error('Failed to load distribution groups');
    } finally {
      this.loading = false;
    }
  }

  async saveGroup(group: any): Promise<void> {
    try {

      const response = await this.distributionGroupsService.saveDistributionGroup(group);

        if (response.success) {
            CollectionUtil.add(this.groups, response.data)
      }

    } catch (error) {
      this.notificationService.error('An error occurred while saving the group');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
      await this.saveGroup(formValue);
      this.closeGroupDialog();
    } else {
      Object.keys(this.groupForm.controls).forEach(key => {
        this.groupForm.get(key)?.markAsTouched();
      });
    }
  }

  editGroup(group: any): void {
    this.editingGroup = group;
    this.groupForm.patchValue(group);
    this.showGroupDialog = true;
  }


  // Opens the dialog and applies the requested operation on Apply
  async addPhoneNumbers()
  {
    await this.mangeFreeFormContacts('add');
    this.showPhoneDialog = false;
  }

  async removePhoneNumbers()
  {
    await this.mangeFreeFormContacts('remove');
    this.showPhoneDialog = false;
  }

  async mangeFreeFormContacts(operation: any): Promise<void> {

    let request:any = {};
    request.operation = operation;
    request.groupId = this.selectedGroup.id;
    request.phoneNos = this.newFreeFormPhoneNos;

    try {
      const response = await this.distributionGroupsService.mangeFreeFormNumbers(request);
      if (response.success) {
        CollectionUtil.add(this.groups, response.data);
        this.selectedGroup = response.data;
        this.newFreeFormPhoneNos = null;
      }
      else
      {
        MessageBox.errorDetail(response.message,response.data);
      }
    } catch (error) {
      this.notificationService.error('An error occurred while updating the contact');
    }
  }


  async deleteGroup(group: any): Promise<void> {
    if (!group.id) return;

    const confirm = await MessageBox.deleteConfirmDialog("Delete Group?","Are you sure you want to delete Group?");
    if (!confirm.value) return;

    try {
      const response = await this.distributionGroupsService.deleteDistributionGroup(group.id);
      if (response.success) {
        CollectionUtil.remove(this.groups, group.id);
      } else {
        this.notificationService.error(response.message || 'Failed to delete group');
      }
    } catch (error) {
      this.notificationService.error('An error occurred while deleting the group');
    }
  }

  openNewGroupDialog(): void {
    this.editingGroup = null;
    this.resetForm();
    this.showGroupDialog = true;
  }

  closeGroupDialog(): void {
    this.showGroupDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.groupForm.reset({});
  }

  // Helpers for phone numbers dialog
  get phoneDialogTitle(): string {
    return this.phoneDialogMode === 'add' ? 'Add Phone Numbers' : 'Remove Phone Numbers';
  }

  openPhoneDialog(mode: 'add' | 'remove'): void {
    this.phoneDialogMode = mode;
    this.showPhoneDialog = true;
  }

  closePhoneDialog(): void {
    this.showPhoneDialog = false;
  }

  applyPhoneDialog(): void {
    if (this.phoneDialogMode === 'add') {
      this.addPhoneNumbers();
    } else if (this.phoneDialogMode === 'remove') {
      this.removePhoneNumbers();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.groupForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      groupType: 'Group Type',
      groupName: 'Group Name'
    };
    return labels[fieldName] || fieldName;
  }

  manageGroup(group: any): void
  {
    this.selectedGroup = group;
    if(this.selectedGroup.groupType == "FREE_FORM")
    {
      // this.newFreeFormPhoneNos = this.selectedGroup.phoneNos;
    }
    this.formView.resetToDetailView();
  }

  backToList(): void {
    this.formView.resetToListView();
    this.selectedGroup = null;
  }

  contactsUpdated(group)
  {
    this.selectedGroup = group;
    CollectionUtil.add(this.groups, group);
  }
}
