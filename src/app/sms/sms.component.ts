import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

// PrimNG imports
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';

// Project imports
import { FormView } from '../core/form-view';
import { NotificationService } from '../core/notification.service';
import { CollectionUtil, ObjectUtil } from '../core/system.utils';
import { MessageBox } from '../message-helper';
import { ButtonToolbarComponent } from '../theme/shared/components/button-toolbar/button-toolbar.component';
import { CardComponent } from '../theme/shared/components/card/card.component';
import { SmsService } from './sms.service';
import { CoreModule } from '../core/core.module';
import { ConfigService } from '../config.service';
import { DistributionGroupsService } from '../distribution-groups/distribution-groups.service';
import { StaticDataService } from '../static-data.service';

@Component({
  selector: 'app-sms',
  standalone: true,
  imports: [
    CoreModule,
    ButtonToolbarComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    CheckboxModule,
    CalendarModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    TableModule,
    TagModule,
    TooltipModule,
    FileUploadModule
  ],
  providers: [ConfirmationService],
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit {
  private smsService = inject(SmsService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  formView = FormView.listView();

  smsMessages: any[] = [];
  isLoading: boolean = false;
  // showDialog: boolean = false;
  selectedSms: any = {};
  selectedTemplateSms: any = null;

  // selectedSms: any | null = null;
  templateMsgs: any[] = [];
  showTemplateDialog:boolean = false;


    private fb = inject(FormBuilder);
    private configService = inject(ConfigService);
    private distributionGroupsService = inject(DistributionGroupsService);
    private messageService = inject(MessageService);

    smsForm!: FormGroup;
    senderIds: any[] = [];
    groups: any[] = [];
    smsNatures: any[] = StaticDataService.smsNature();
    characterCount: number = 0;
    smsCount: number = 1;

  ngOnInit() {
    this.loadSmsMessages();
  }

  async loadSmsMessages() {
    this.isLoading = true;
    try {
      this.templateMsgs = [];
      const response = await this.smsService.getSmsMessages();
      this.smsMessages = response.data;
      this.smsMessages.forEach(item=>{
        if(item.templateSms)
        {
          CollectionUtil.add(this.templateMsgs,item);
        }
      });
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading SMS messages:', error);
      this.notificationService.error('Failed to load SMS messages');
      this.isLoading = false;
      this.smsMessages = [];
    }
  }

  closeTemplateDialog()
  {
    this.selectedSms = null;
    this.showTemplateDialog = false;
  }

  createFromTemplateDialog()
  {
    this.selectedSms = null;
    this.showTemplateDialog = true;
  }

  async createFromTemplate() {
    try {
console.log("selectedTemplateSms",this.selectedTemplateSms);
      if(ObjectUtil.isNullOrUndefinedOrEmpty(this.selectedTemplateSms?.id))
      {
        this.notificationService.error("Select A Template SMS");
        return;
      }
        const response = await this.smsService.duplicateSmsMessage(this.selectedTemplateSms.id);
        if(!response.success)
        {
          MessageBox.errorDetail(response.message,response.data)
           const errorMessage = response.message;
          this.notificationService.error(errorMessage);
          return
        }

        // CollectionUtil.add(this.smsMessages, response.data);
        // this.formView.resetToListView();
      console.log("response.data",response.data);
        this.openEditDialog(response.data);

    } catch (error) {
      console.error('Error with SMS message:', error);
      const errorMessage = this.selectedSms ? 'Failed to Generate SMS message' : 'Failed to Generate SMS message';
      this.notificationService.error(errorMessage);
    }
  }


  createNewMessage() {
    this.selectedSms = {};
    this.selectedSms.smsMessageType = 'SINGLE_SMS';
    this.selectedSms.phoneNumbersSource = 'COPY_PASTE';
    this.selectedSms.smsNature = 'ONE_TIME';
    this.formView.resetToCreateView();

    // Initialize form for new SMS
    this.initializeForm();
    this.populateForm();
    this.updateCount();
  }

  openEditDialog(sms: any) {
    this.selectedSms = sms;
    this.formView.resetToCreateView();
    this.showTemplateDialog = false;

    // Initialize and populate form for edit
    this.initializeForm();
    this.populateForm();
    this.updateCount();
  }

  async onSmsSubmitted(sms: any) {
    try {

        const response = await this.smsService.saveSmsMessage( sms);
        if(!response.success)
        {
          MessageBox.errorDetail(response.message,response.data)
           const errorMessage = response.message;
          this.notificationService.error(errorMessage);
          return
        }

        CollectionUtil.add(this.smsMessages, response.data);
        if(response.data.templateSms)
        {
          CollectionUtil.add(this.templateMsgs,response.data);
        }
        else
        {
          try {
            CollectionUtil.remove(this.templateMsgs,response.data.id);
          } catch (error) {}
        }

        this.formView.resetToListView();


    } catch (error) {
      console.error('Error with SMS message:', error);
      const errorMessage = this.selectedSms ? 'Failed to update SMS message' : 'Failed to create SMS message';
      this.notificationService.error(errorMessage);
    }
  }

  async duplicateSms(sms: any) {
    try {

        const response = await this.smsService.duplicateSmsMessage(sms.id);
        if(!response.success)
        {
          MessageBox.errorDetail(response.message,response.data)
           const errorMessage = response.message;
          this.notificationService.error(errorMessage);
          return
        }

        this.openEditDialog(response.data);

    } catch (error) {
      console.error('Error with SMS message:', error);
      const errorMessage = this.selectedSms ? 'Failed to Duplicate SMS message' : 'Failed to Duplicate SMS message';
      this.notificationService.error(errorMessage);
    }
  }

  deleteSms(sms: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this SMS message?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (sms.id) {
          try {
           const response = await this.smsService.deleteSmsMessage(sms.id);
           if(response.success)
           {
             CollectionUtil.remove(this.smsMessages, sms.id);
           }

          } catch (error) {
            console.error('Error deleting SMS message:', error);
            this.notificationService.error('Failed to delete SMS message');
          }
        }
      }
    });
  }

  initiateSms(sms: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to Send this SMS message?`,
      header: 'Confirm Send / Initiated',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (sms.id) {
          try {
            // await this.smsService.sendSmsMessage(sms.id);

            const response = await this.smsService.sendSmsMessage(sms.id);
            if(response.success)
            {
              CollectionUtil.add(this.smsMessages, response.data);
            }

          } catch (error) {
            console.error('Error deleting SMS message:', error);
            this.notificationService.error('Failed to Initiate/Send SMS message');
          }
        }
      }
    });
  }

  getStatusSeverity(dispatched: boolean): 'success' | 'warning' | 'danger' | 'info' {
    return dispatched ? 'success' : 'warning';
  }

  formatPhoneNumbers(phoneNos: string): string {
    if (!phoneNos) return '';
    const phones = phoneNos.split(',');
    if (phones?.length > 3) {
      return `${phones.slice(0, 3).join(', ')} +${phones.length - 3} more`;
    }
    return phones.join(', ');
  }

  formatScheduledTime(scheduledTime: Date | undefined): string {
    if (!scheduledTime) return 'Not scheduled';
    return new Date(scheduledTime).toLocaleString();
  }

  // ================= Migrated Form Methods =================
  initNewSms() {
    this.smsForm.reset();
    const record: any = {};
    record.smsMessageType = 'SINGLE_SMS';
    record.phoneNumbersSource = 'COPY_PASTE';
    record.smsNature = 'ONE_TIME';
    this.smsForm.patchValue(record);
  }

  initializeForm() {
    this.smsForm = this.fb.group({
      id: '',
      senderId: ['', Validators.required],
      messageText: ['', [Validators.required, Validators.maxLength(1000)]],
      phoneNos: ['', [Validators.pattern(/^[\+]?[-0-9,\s\n]+$/)]],
      dispatched: [false],
      flashSms: [false],
      scheduleSms: [false],
      templateSms: [false],
      smsNature: ['ONE_TIME', Validators.required],
      scheduledTime: [null],
      smsMessageType: [null],
      phoneNumbersSource: [null],
      groupId: [null],
      uploadedFile: [null],
      templateName: [null],
      pagesCount: 0,
      totalRecipient: 0,
    });

    // Clean/monitor phone numbers and counts
    this.smsForm.get('phoneNos')?.valueChanges.subscribe((newValue: string) => {
      if (ObjectUtil.isNullOrUndefined(newValue)) return;
      const cleanedValue = newValue.replace(/[^0-9\s\-\n]/g, '');
      if (cleanedValue !== newValue) {
        newValue = ObjectUtil.standardizeNewlines(newValue);
        this.smsForm.get('phoneNos')?.setValue(cleanedValue, { emitEvent: false });
      }
      this.countContactsInTextBox(newValue);
    });

    this.loadDropdownData();
    this.setupFormSubscriptions();
  }

  setupFormSubscriptions() {
    this.smsForm.get('messageText')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const pagesCount = this.smsService.calculatePagesCount(value);
        this.smsForm.patchValue({ pagesCount }, { emitEvent: false });
      }
    });

    this.smsForm.get('phoneNos')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const phoneNumbers = value.split(',').filter(phone => phone.trim().length > 0);
        this.smsForm.patchValue({ totalReceipient: phoneNumbers.length }, { emitEvent: false });
      }
    });

    this.smsForm.get('scheduleSms')?.valueChanges.subscribe((value: boolean) => {
      const scheduledTimeControl = this.smsForm.get('scheduledTime');
      if (value) {
        scheduledTimeControl?.setValidators([Validators.required]);
      } else {
        scheduledTimeControl?.clearValidators();
        scheduledTimeControl?.setValue(null);
      }
      scheduledTimeControl?.updateValueAndValidity();
    });
  }

  async loadDropdownData() {
    this.configService.getSenderIds().then(response => {
      this.senderIds = response.data;
    });

    this.distributionGroupsService.getDistributionGroups().then(response => {
      this.groups = response.data;
    });
  }

  populateForm() {
    if (this.selectedSms && this.smsForm) {
      this.smsForm.patchValue(this.selectedSms);
    }
  }

  onGroupSelected() {
    const formValue = this.smsForm.getRawValue();
    const groupId = formValue.groupId;
    if (!ObjectUtil.isNullOrUndefined(groupId)) {
      const grp = CollectionUtil.findById(this.groups, groupId);
      if (grp) {
        this.smsForm.controls['totalRecipient'].setValue(grp.contactCount);
      }
    }
  }

  onSubmit() {
    if (this.smsForm.valid) {
      const formValue = this.smsForm.getRawValue();
      formValue.phoneNos = ObjectUtil.standardizeNewlines(formValue.phoneNos);
      try {
        formValue.scheduledTime = this.formatDateTimeForApi(formValue.scheduledTime);
      } catch (error) {}
      this.onSmsSubmitted(formValue);
    } else {
      ObjectUtil.logInvalidFields(this.smsForm);
      this.markFormGroupTouched(this.smsForm);
      this.notificationService.error('Please fill in all required fields correctly');
    }
  }

  onCancel() {
    this.formView.resetToListView();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.smsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.smsForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['pattern']) {
        return 'Please enter valid phone numbers separated by commas';
      }
    }
    return '';
  }

  async onFileSelect(event: FileSelectEvent) {
    const file = event.files?.[0];
    if (!file) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No file selected.' });
      return;
    }

    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|xlsx|xls|csv)$/i)) {
      // this.messageService.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please select a .txt, .xlsx, .xls, or .csv file.' });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        let phoneNumbers: string[] = [];

        if (file.name.endsWith('.txt') || file.type === 'text/plain') {
          phoneNumbers = new TextDecoder().decode(data).split(/\r?\n/);
        } else if (file.name.endsWith('.csv')) {
          phoneNumbers = new TextDecoder().decode(data).split(/\r?\n/).flatMap((line: string) => line.split(','));
        } else {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const sheetData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          phoneNumbers = sheetData.map(row => (row[0] ? String(row[0]).trim() : '')).filter(Boolean);
        }

        phoneNumbers = phoneNumbers.map(num => num.replace(/[^0-9\n\r\s\-]/g, '').trim()).filter(Boolean);
        const uniquePhones = Array.from(new Set(phoneNumbers));
        this.smsForm.patchValue({ phoneNos: uniquePhones.join('\n') });
      } catch (error) {
        console.error('Error reading file:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to read file.' });
      }
    };

    reader.onerror = () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to read file.' });
    };

    reader.readAsArrayBuffer(file);
  }

  clearFile() {
    this.smsForm.patchValue({ uploadedFile: null });
  }

  countContactsInTextBox(content: string) {
    content = ObjectUtil.standardizeNewlines(content);
    let lines = content.split(/\r?\n/);
    lines = lines.map(line => line.trim()).filter(line => line !== '');
    let phoneCount = 0;
    lines.forEach(line => {
      let cleanedLine = line.replace(/[^0-9]/g, '');
      if (cleanedLine.length >= 10) {
        phoneCount++;
      }
    });

    this.smsForm.patchValue({ totalRecipient: phoneCount }, { emitEvent: false });
  }

  updateCount() {
    const text: string = this.smsForm?.value?.messageText || '';
    this.characterCount = text?.replace(/\n/g, '\r\n').length || 0;
    try {
      this.smsCount = this.smsService.calculatePagesCount(text);
    } catch (error) {}
  }

  stripTrailingZ(timestamp: any) {
    try {
      timestamp = timestamp?.toString();
      if (timestamp?.endsWith('Z')) {
        return timestamp.slice(0, -1);
      }
      return timestamp;
    } catch (error) {
      return timestamp;
    }
  }

  formatDateTimeForApi(dateObj: any) {
    try {
      if (ObjectUtil.isNullOrUndefined(dateObj)) return undefined;
      if (typeof dateObj === 'string') {
        return this.stripTrailingZ(dateObj);
      }
      const pad = (num: number) => num.toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const month = pad(dateObj.getMonth() + 1);
      const day = pad(dateObj.getDate());
      const hours = pad(dateObj.getHours());
      const minutes = pad(dateObj.getMinutes());
      const seconds = pad(dateObj.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return dateObj;
    }
  }
}
