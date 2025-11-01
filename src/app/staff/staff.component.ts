
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimNG imports
import { MessageService } from 'primeng/api';

import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { StaticDataService } from '../static-data.service';
import { StaffService } from './staff.service';
import {CoreModule} from "../core/core.module";
import {FormView} from "../core/form-view";
import {ValidateInputDirective} from "../core/directives/input-required.directive";


// Permissions model interfaces
interface PermissionAction {
  name: string;
  enabled: boolean;
}

interface PermissionPage {
  enabled: boolean;
  pageName: string;
  pageCode: string;
  pageUrl: string;
  actions: PermissionAction[];
}

@Component({
  selector: 'app-users',
  standalone: true,
    imports: [
        CoreModule
    ],
  providers: [MessageService],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(StaffService);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);

  defaultStaff:any = {};
  formView:FormView = new FormView();
  staffList: any[] = [];
  userForm!: FormGroup;
  editingUser: any | null = null;
  loading = false;

  // Password dialog properties
  passwordForm!: FormGroup;
  showPasswordDialog = false;
  currentUser: any | null = null;
  passwordLoading = false;

  // Permissions & Roles dialog properties
  showPermRolesDialog = false;
  permRolesUser: any | null = null;
  permLoading = false;
  permSaveLoading = false;
  permError: string | null = null;

  // Permissions data model
  permissionsData: PermissionPage[] = [];
  private readonly defaultPermissions: PermissionPage[] = [
    {
      enabled: true,
      pageName: 'Dashboard',
      pageCode: 'DASH_001',
      pageUrl: '/dashboard',
      actions: [
        { name: 'view', enabled: true },
        { name: 'edit', enabled: false }
      ]
    },
    {
      enabled: false,
      pageName: 'Settings',
      pageCode: 'SET_002',
      pageUrl: '/settings',
      actions: [
        { name: 'modify', enabled: false },
        { name: 'delete', enabled: false }
      ]
    }
  ];

  // Dropdown options
  accountCategoryOptions: any[] = StaticDataService.accountCategories();
  accountStatusOptions: any[] = StaticDataService.accountStatuses();
  religionOptions: any[] = StaticDataService.religion();
  regionsList: any[] = StaticDataService.regions();
  sexList: any[] = StaticDataService.gender();

  ngOnInit() {
    this.initializeForm();

    this.loadUsers();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      id: [null],
      systemId: [''],
      username: [''],
      referenceNo: [''],
      dateOfBirth: [null],
      gender: [''],
      surname: [''],
      othernames: [''],
      firstName: [''],
      postalAddress: [''],
      mobileNo: [''],
      otherContactNos: [''],
      emailAddress: [''],
      region: [''],
      religion: [''],
      homeTown: [''],
      teachingStaff: [false],
      administrator: [false],
      classTeacher: [false],
      residentialAddress: ['']
    });

    this.defaultStaff = this.userForm.getRawValue();
    console.log("default value ....",this.defaultStaff);

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }


  async loadUsers() {
    try {
      this.loading = true;
      const response = await this.userService.getUsers();

      if (response.success) {
        this.staffList = response.data;
      }

    } catch (error: any) {

    } finally {
      this.loading = false;
    }
  }

  async saveUser(user: any) {
    try {
      const response = await this.userService.saveUser(user);
      if (response.success) {
        CollectionUtil.add(this.staffList, response.data);
        this.closeUserDialog();
      }
    } catch (error: any) {
    }
  }

  async onSubmit() {
      console.log(this.userForm.invalid);
      if (ValidateInputDirective.invalidForm(this.userForm)) {
          console.log(this.userForm.invalid);
          return;
      }

    const userData = this.userForm.value;
    if (this.editingUser) {
      userData.id = this.editingUser.id;
    }
    await this.saveUser(userData);
  }

  editUser(user: any) {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.formView.resetToCreateView();
  }

  async deleteUser(staff: any) {
    if (confirm(`Are you sure you want to delete Staff "${staff.fullname}"?`)) {
      try {
        this.loading = true;
        const response = await this.userService.deleteUser(staff.id!);

        if (response.success) {
          CollectionUtil.remove(this.staffList, staff.id);
        }
      } catch (error: any) {
        this.notificationService.error('Failed to delete Staff');
      } finally {
        this.loading = false;
      }
    }
  }

  initNewStaff() {
    this.editingUser = null;
    this.resetForm();
    this.formView.resetToCreateView();

  }

  closeUserDialog() {
    this.formView.resetToListView();
    this.resetForm();
  }

  resetForm() {
    this.userForm.reset(this.defaultStaff);
  }


  // Password dialog methods
  openPasswordDialog(user: any) {
    this.currentUser = user;
    this.resetPasswordForm();
    this.showPasswordDialog = true;
  }

  closePasswordDialog() {
    this.showPasswordDialog = false;
    this.resetPasswordForm();
    this.currentUser = null;
  }

  resetPasswordForm() {
    this.passwordForm.reset();
  }

  async updatePassword() {
    console.log(this.passwordForm.invalid);
    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    const newPassword = this.passwordForm.value.newPassword;
    const confirmPassword = this.passwordForm.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.notificationService.error('Passwords do not match');
      return;
    }

    const payload:any = {};
    payload.userId = this.currentUser.id;
    payload.newPassword = newPassword;
    payload.confirmPassword = confirmPassword;

    try {
      this.passwordLoading = true;
      const response = await this.userService.updatePassword(payload);

      if (response.success) {
        this.closePasswordDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password updated successfully'
        });
      } else {
        this.notificationService.error(response.message || 'Failed to update password');
      }
    } catch (error: any) {
      this.notificationService.error('Failed to update password');
    } finally {
      this.passwordLoading = false;
    }
  }

  // Permissions & Roles dialog methods
  async openPermRolesDialog(user: any) {
    this.permRolesUser = user;
    this.showPermRolesDialog = true;
    this.permLoading = true;
    this.permError = null;
    try {
      const resp = await this.userService.getUserPermissions(String(user.id ?? user.userId ?? ''));
      if (resp?.success) {
        const data = (resp.data || []) as any[];
        // Normalize to PermissionPage[] shape if backend differs
        this.permissionsData = data.map((p: any) => ({
          enabled: !!p.enabled,
          pageName: p.pageName ?? p.name ?? '',
          pageCode: p.pageCode ?? p.code ?? '',
          pageUrl: p.pageUrl ?? p.url ?? '',
          actions: (p.actions || []).map((a: any) => ({
            name: a.name ?? a.action ?? '',
            enabled: !!a.enabled
          }))
        }));
      } else {
        this.notificationService.error(resp?.message || 'Failed to load permissions');
        // Fallback to defaults
        this.permissionsData = this.defaultPermissions.map(p => ({...p, actions: p.actions.map(a => ({...a}))}));
      }
    } catch (e) {
      this.notificationService.error('Failed to load permissions');
      this.permissionsData = this.defaultPermissions.map(p => ({...p, actions: p.actions.map(a => ({...a}))}));
    } finally {
      this.permLoading = false;
    }
  }

  async savePermissions() {
    if (!this.permRolesUser) return;
    try {
      this.permSaveLoading = true;
      const resp = await this.userService.saveUserPermissions(String(this.permRolesUser.id ?? this.permRolesUser.userId ?? ''), this.permissionsData);
      if (resp?.success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permissions saved' });
        this.closePermRolesDialog();
      } else {
        this.notificationService.error(resp?.message || 'Failed to save permissions');
      }
    } catch (e) {
      this.notificationService.error('Failed to save permissions');
    } finally {
      this.permSaveLoading = false;
    }
  }

  closePermRolesDialog() {
    this.showPermRolesDialog = false;
    this.permLoading = false;
    this.permSaveLoading = false;
    this.permError = null;
    this.permRolesUser = null;
  }
}
