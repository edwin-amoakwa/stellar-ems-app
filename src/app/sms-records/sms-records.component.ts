import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

// Project imports
import { NotificationService } from '../core/notification.service';
import { CardComponent } from '../theme/shared/components/card/card.component';
import { SmsRecordsService } from './sms-records.service';

@Component({
  selector: 'app-sms-records',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './sms-records.component.html',
  styleUrls: ['./sms-records.component.css']
})
export class SmsRecordsComponent implements OnInit {
  private smsRecordsService = inject(SmsRecordsService);
  private notificationService = inject(NotificationService);

  smsRecords: any[] = [];
  isLoading: boolean = false;

  // Filter options and state
  sentStatusOptions = [
    { label: 'SENT', value: 'SENT' },
    { label: 'FAILED', value: 'FAILED' }
  ];
  yesNoOptions = [
    { label: 'YES', value: true },
    { label: 'NO', value: false }
  ];

  filterParam: any = {
    phoneNo: undefined,
    referenceNo: undefined,
    relatedPersonName: undefined,
    sentStatus: undefined,
    emailSent: undefined,
    smsSent: undefined,
    whatsAppSent: undefined
  };

  ngOnInit() {
    this.loadSmsRecords();
  }

  async loadSmsRecords() {
    this.isLoading = true;
    try {
      const response = await this.smsRecordsService.getSmsRecords(this.filterParam);
      this.smsRecords = response.data || [];
    } catch (error) {
      console.error('Error loading SMS records:', error);
      this.notificationService.error('Failed to load SMS records');
      this.smsRecords = [];
    } finally {
      this.isLoading = false;
    }
  }


  clearFilters() {
    this.filterParam = {
      phoneNo: undefined,
      referenceNo: undefined,
      relatedPersonName: undefined,
      sentStatus: undefined,
      emailSent: undefined,
      smsSent: undefined,
      whatsAppSent: undefined
    };
    this.loadSmsRecords();
  }

  getSmsStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  }

  getYesNoSeverity(value: boolean | string | null | undefined): 'success' | 'secondary' {
    // Green for true/"YES", Gray (secondary) for false/"NO"/null/undefined
    if (value === true || (typeof value === 'string' && value.toLowerCase() === 'yes')) {
      return 'success';
    }
    return 'secondary';
  }

  formatDateTime(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  formatCurrency(amount: number): string {
    if (amount == null || amount === undefined) return '0.00';
    return `${amount.toFixed(3)}`;
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
