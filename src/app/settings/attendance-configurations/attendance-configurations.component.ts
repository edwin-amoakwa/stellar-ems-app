import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { AttendanceService } from '../../attendance/attendance.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-attendance-configurations',
  standalone: true,
  imports: [CoreModule, InputSwitchModule],
  templateUrl: './attendance-configurations.component.html',
  styleUrls: ['./attendance-configurations.component.scss']
})
export class AttendanceConfigurationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(AttendanceService);

  form!: FormGroup;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      clockOutTimeAfter: [''],
      firstCheckoutAsFinalCheckout: [false],
      sendAlertToGuardians: [false]
    });
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.error = null;
    this.success = null;
    try {
      const resp = await this.service.getConfig();
      const data = resp?.data || {};
      // Map backend LocalTime (HH:mm or HH:mm:ss) to HTML time input (HH:mm)
      let time: string = data.clockOutTimeAfter || '';
      if (time && time.length === 8 && time.includes(':')) {
        time = time.substring(0, 5);
      }
      this.form.patchValue({
        clockOutTimeAfter: time || '',
        firstCheckoutAsFinalCheckout: !!data.firstCheckoutAsFinalCheckout,
        sendAlertToGuardians: !!data.sendAlertToGuardians
      });
    } catch (e) {
      console.error('Failed to load attendance config', e);
      this.error = 'Failed to load attendance configuration';
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    this.error = null;
    this.success = null;
    const raw = this.form.getRawValue();
    let time: string = raw.clockOutTimeAfter || '';
    // Ensure seconds for LocalTime (HH:mm:ss)
    if (time && time.length === 5) {
      time = `${time}:00`;
    }
    const payload = {
      clockOutTimeAfter: time || null,
      firstCheckoutAsFinalCheckout: !!raw.firstCheckoutAsFinalCheckout,
      sendAlertToGuardians: !!raw.sendAlertToGuardians
    };
    try {
      const resp = await this.service.saveConfig(payload);
      if (resp?.success) {
        this.success = 'Configuration saved successfully';
        await this.load();
      }
    } catch (e) {
      console.error('Failed to save attendance config', e);
      this.error = 'Failed to save attendance configuration';
    }
  }
}
