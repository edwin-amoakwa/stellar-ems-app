import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { StaticDataService } from '../../static-data.service';

@Component({
  selector: 'app-guardian-create',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './guardian-create.component.html',
  styleUrls: ['./guardian-create.component.scss']
})
export class GuardianCreateComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() value: any | null = null;
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  // Option lists (mirror Staff component usage)
  religionOptions: any[] = StaticDataService.religion();
  regionsList: any[] = StaticDataService.regions();
  sexList: any[] = StaticDataService.gender();

  ngOnInit(): void {
    // Mirror fields from Staff form
    this.form = this.fb.group({
      id: [null],
      // Identity
      referenceNo: [''],
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      othernames: [''],
      dateOfBirth: [null],
      gender: [''],
      // Contacts
      emailAddress: [''],
      mobileNo: ['', Validators.required],
      otherContactNos: [''],
      // Location
      region: [null],
      religion: [null],
      homeTown: [''],
      postalAddress: [''],
      residentialAddress: [''],
      // Flags (kept for UI parity though not typically used for guardians)
      teachingStaff: [false],
      administrator: [false],
      classTeacher: [false],
      // Legacy/compat: keep fullname for backward compatibility if parent passes it
      fullname: ['']
    });

    if (this.value) {
      this.form.patchValue(this.value);
      // If fullname present but first/surname missing, attempt a simple split
      const v: any = this.value;
      if (v?.fullname && !v?.firstName && !v?.surname) {
        const parts = String(v.fullname).trim().split(/\s+/);
        this.form.patchValue({
          firstName: parts[0] || '',
          surname: parts.slice(1).join(' ') || ''
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.form) {
      this.form.reset({
        id: null,
        referenceNo: '',
        firstName: '',
        surname: '',
        othernames: '',
        dateOfBirth: null,
        gender: '',
        emailAddress: '',
        mobileNo: '',
        otherContactNos: '',
        region: null,
        religion: null,
        homeTown: '',
        postalAddress: '',
        residentialAddress: '',
        teachingStaff: false,
        administrator: false,
        classTeacher: false,
        fullname: ''
      });
      if (this.value) {
        this.form.patchValue(this.value);
        const v: any = this.value;
        if (v?.fullname && !v?.firstName && !v?.surname) {
          const parts = String(v.fullname).trim().split(/\s+/);
          this.form.patchValue({
            firstName: parts[0] || '',
            surname: parts.slice(1).join(' ') || ''
          });
        }
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    // Ensure fullname exists for APIs that expect it
    if (!payload.fullname) {
      const fn = (payload.firstName || '').toString().trim();
      const sn = (payload.surname || '').toString().trim();
      payload.fullname = [fn, sn].filter(Boolean).join(' ');
    }
    this.submit.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
