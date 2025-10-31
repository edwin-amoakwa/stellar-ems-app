import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

// PrimNG imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { StaticDataService } from '../static-data.service';
import { UserService } from './user.service';
import {ButtonToolbarComponent} from '../theme/shared/components/button-toolbar/button-toolbar.component';
import {CardComponent} from '../theme/shared/components/card/card.component';

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
    ToggleSwitchModule,
    ButtonToolbarComponent,
    CardComponent
  ],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);

  users: any[] = [];
  userForm!: FormGroup;
  showUserDialog = false;
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

  ngOnInit() {
    this.initializeForm();

    this.loadUsers();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      accountName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required]],
      accountCategory: ['', [Validators.required]],
      accountStatus: ['', [Validators.required]]
    });

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
        this.users = response.data;
      } else {
        this.notificationService.error(response.message|| 'Failed to load users');
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: response.message || 'Failed to load users'
        // });
      }
    } catch (error: any) {
      this.notificationService.error( 'Failed to load users');
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Failed to load users'
      // });
    } finally {
      this.loading = false;
    }
  }

  async saveUser(user: any) {
    try {
      const response = await this.userService.saveUser(user);
      if (response.success) {
        CollectionUtil.add(this.users, response.data);
        this.closeUserDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.editingUser ? 'User updated successfully' : 'User created successfully'
        });
      } else {
        this.notificationService.error(response.message || (this.editingUser ? 'Failed to update user' : 'Failed to create user'));
      }
    } catch (error: any) {
      const errorMessage = this.editingUser ? 'Failed to update user' : 'Failed to create user';
      this.notificationService.error(errorMessage);
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
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
    this.userForm.patchValue({
      accountName: user.accountName,
      emailAddress: user.emailAddress,
      phoneNo: user.phoneNo,
      accountCategory: user.accountCategory,
      accountStatus: user.accountStatus,
    });
    this.showUserDialog = true;
  }

  async deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user "${user.accountName}"?`)) {
      try {
        this.loading = true;
        const response = await this.userService.deleteUser(user.id!);

        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully'
          });
          await this.loadUsers();
        } else {
          this.notificationService.error(response.message || 'Failed to delete user');
        }
      } catch (error: any) {
        this.notificationService.error('Failed to delete user');
      } finally {
        this.loading = false;
      }
    }
  }

  openNewUserDialog() {
    this.editingUser = null;
    this.resetForm();
    this.showUserDialog = true;
  }

  closeUserDialog() {
    this.showUserDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.userForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'accountName': 'Account Name',
      'emailAddress': 'Email Address',
      'phoneNo': 'Phone Number',
      'accountCategory': 'Account Category',
      'merchantName': 'Merchant Name',
      'merchantId': 'Merchant ID',
      'accountStatus': 'Account Status',
      'userCategory': 'User Category'
    };
    return labels[fieldName] || fieldName;
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

  isPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getPasswordFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getPasswordFieldLabel(fieldName)} must be at least 6 characters`;
      }
    }
    return '';
  }

  getPasswordFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
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
