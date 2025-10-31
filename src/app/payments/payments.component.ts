import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimNG imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { Tooltip } from 'primeng/tooltip';
import { NotificationService } from '../core/notification.service';
import { StaticDataService } from '../static-data.service';
import { PaymentService } from './payment.service';
import { FormView } from '../core/form-view';
import { CardComponent } from '../theme/shared/components/card/card.component';
import { ButtonToolbarComponent } from '../theme/shared/components/button-toolbar/button-toolbar.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    TableModule,
    CardModule,
    TextareaModule,
    DialogModule,
    ToastModule,
    Tooltip,
    CardComponent,
    ButtonToolbarComponent
  ],
  providers: [MessageService],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);

  formView = FormView.listView();

  paymentForm!: FormGroup;
  payments: any[] = [];
  loading = false;
  editingPayment: any | null = null;
  showPaymentDialog = false;

  formOfPaymentOptions = StaticDataService.formsOfPayment();

  ngOnInit() {
    this.initializeForm();
    this.loadPayments();
  }

  private initializeForm() {
    this.paymentForm = this.fb.group({
      id: null,
      amount: [null, [Validators.required, Validators.min(0.01)]],
      paymentRefNo: "",
      paymentNotes: [''],
      formOfPayment: [null, [Validators.required]]
    });
  }

  async loadPayments() {
    try {
      this.loading = true;
      const response = await this.paymentService.getPayments();
      if (response.success) {
        this.payments = response.data || [];
      }
    } catch (error) {
      this.notificationService.error('Failed to load payments');
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.paymentForm.valid) {
      try {
        this.loading = true;
        const formValue = this.paymentForm.value;
        const response = await this.paymentService.savePayment(formValue);
        if (response.success) {
          this.paymentForm.reset();
          await this.loadPayments();
          this.formView.resetToListView();
        }
      } catch (error) {
        this.notificationService.error(`Failed to ${this.editingPayment ? 'update' : 'create'} payment`);
      } finally {
        this.loading = false;
      }
    } else {
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
    }
  }

  editPayment(payment: any) {
    this.editingPayment = payment;
    this.paymentForm.reset();
    this.paymentForm.patchValue(payment);
    this.formView.resetToCreateView();
  }

  async deletePayment(payment: any) {
    if (payment.id && confirm('Are you sure you want to delete this payment?')) {
      try {
        this.loading = true;
        const response = await this.paymentService.deletePayment(payment.id);
        if (response.success) {
          await this.loadPayments();
        }
      } catch (error) {
        this.notificationService.error('Failed to delete payment');
      } finally {
        this.loading = false;
      }
    }
  }

  openCreate() {
    this.editingPayment = null;
    this.paymentForm.reset();
    this.formView.resetToCreateView();
  }

  backToList() {
    this.formView.resetToListView();
    this.editingPayment = null;
    this.paymentForm.reset();
  }

  // Kept for backward compatibility with legacy dialog flow
  closePaymentDialog() {
    this.showPaymentDialog = false;
  }

  resetForm() {
    this.paymentForm.reset();
    this.editingPayment = null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      amount: 'Amount',
      paymentRefNo: 'Payment Reference No',
      paymentNotes: 'Payment Notes',
      formOfPayment: 'Form of Payment',
      initiationSource: 'Initiation Source'
    };
    return labels[fieldName] || fieldName;
  }
}
