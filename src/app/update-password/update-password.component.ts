import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { UserService } from '../users/user.service';
import { NotificationService } from '../core/notification.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  updatePasswordForm!: FormGroup;
  loading = false;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.updatePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.updatePasswordForm.invalid) {
      Object.keys(this.updatePasswordForm.controls).forEach(key => {
        this.updatePasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.updatePasswordForm.value;
    const { currentPassword, newPassword, confirmPassword } = formValue;

    if (newPassword !== confirmPassword) {
      this.notificationService.error('New password and confirm password do not match');
      return;
    }

    try {
      this.loading = true;
      const response = await this.userService.updatePasswordWithCurrent(formValue);

      if (response.success) {
        this.notificationService.success('Password updated successfully');
        this.updatePasswordForm.reset();

      }
    } catch (error: any) {
      this.notificationService.error('Failed to update password');
    } finally {
      this.loading = false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.updatePasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.updatePasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least 8 characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'currentPassword': 'Current Password',
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }
}
