import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceDeviceService } from './attendance-device.service';
import {CoreModule} from "../core/core.module";

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './attendance-device.component.html',
  styleUrls: ['./attendance-device.component.scss']
})
export class AttendanceDeviceComponent implements OnInit {
  private service = inject(AttendanceDeviceService);
  private fb = inject(FormBuilder);

  items: any[] = [];
  isLoading = false;
  error: string | null = null;

  listView = true;
  current: any | null = null;

  form!: FormGroup;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.isLoading = true;
    this.error = null;
    try {
      const resp = await this.service.getNotificationSettings();
      this.items = resp?.data ?? [];
    } catch (e: any) {
      console.error('Failed to load notification settings', e);
      this.error = 'Failed to load notification settings';
      this.items = [];
    } finally {
      this.isLoading = false;
    }
  }

  edit(item: any) {
    this.current = item;
    this.listView = false;
    // initialize form when switching to edit view
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      notificationTypeName: [{ value: '', disabled: true }],
      recipientNumber: [''],
      recipientEmail: ['', [Validators.email]],
      recipientEmailCc: ['', [Validators.email]],
      recipientEmailBcc: ['', [Validators.email]],
      enabled: [false]
    });
    if (this.current) {
      this.form.patchValue(this.current);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const updated = {
        id: raw.id,
        merchantId: (raw as any).merchantId,
        recipientNumber: raw.recipientNumber,
        recipientEmail: raw.recipientEmail,
        recipientEmailCc: raw.recipientEmailCc,
        recipientEmailBcc: raw.recipientEmailBcc,
        enabled: raw.enabled
      };
      this.onSave(updated);
    } else {
      Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched());
    }
  }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  async onSave(updated: any) {
    try {
      const resp = await this.service.saveNotificationSetting(updated);
      if (resp?.success) {
        await this.load();
        this.listView = true;
        this.current = null;
      }
    } catch (e) {
      console.error('Failed to save notification setting', e);
    }
  }

  onCancel() {
    this.listView = true;
    this.current = null;
  }
}
