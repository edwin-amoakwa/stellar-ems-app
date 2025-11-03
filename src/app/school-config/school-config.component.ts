import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CoreModule } from '../core/core.module';
import { environment } from '../../environments/environment';

interface AcademicTermDto {
  id: string;
  name?: string;
  termCode?: string;
}

export enum ScoringTemplate {
  SUMMARY_SCORE = 'SUMMARY_SCORE',
  FULL_SCORE = 'FULL_SCORE'
}

@Component({
  selector: 'app-school-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreModule],
  templateUrl: './school-config.component.html',
  styleUrls: ['./school-config.component.scss']
})
export class SchoolConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // Separate forms
  mainForm!: FormGroup;
  logoForm!: FormGroup;

  loading = false;
  savingMain = false;
  savingLogo = false;
  errorMain: string | null = null;
  successMain: string | null = null;
  errorLogo: string | null = null;
  successLogo: string | null = null;

  scoringTemplates = [
    { label: 'Summary Score', value: ScoringTemplate.SUMMARY_SCORE },
    { label: 'Full Score', value: ScoringTemplate.FULL_SCORE }
  ];

  academicTerms: AcademicTermDto[] = [];

  ngOnInit(): void {
    this.mainForm = this.fb.group({
      postalAddress: [''],
      schoolCode: ['', Validators.required],
      contactNo: [''],
      convertClassMark: [false],
      convertExamMark: [false],
      classMarkPercentile: [0, [Validators.min(0), Validators.max(100)]],
      examMarkPercentile: [0, [Validators.min(0), Validators.max(100)]],
      scoringTemplate: [ScoringTemplate.SUMMARY_SCORE, Validators.required],
      academicTermId: [null, Validators.required],
      useSystemGrading: [true],
      showStudentClassRankOnTerminalReport: [false],
      showSignatureSectionOnTerminalReport: [false],
      showStaffNamesOnTerminalReport: [false]
    });

    this.logoForm = this.fb.group({
      schoolLogoSRC: ['']
    });

    this.loadAcademicTerms();
  }

  async loadAcademicTerms() {
    this.loading = true;
    // Clear only main form error state for loading terms
    this.errorMain = null;
    try {
      const res: any = await this.http.get(`${environment.baseUrl}/academic-terms`).toPromise();
      // Many endpoints wrap in ApiResponse { success, data }
      this.academicTerms = Array.isArray(res)
        ? res
        : (res?.data ?? []);
    } catch (e: any) {
      this.errorMain = e?.message || 'Failed to load academic terms';
    } finally {
      this.loading = false;
    }
  }

  onLogoSelected(event: any) {
    const file: File | undefined = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.logoForm.patchValue({ schoolLogoSRC: String(reader.result || '') });
    };
    reader.readAsDataURL(file);
  }

  get logoSrc() {
    return this.logoForm.get('schoolLogoSRC')?.value || '';
  }

  async onSubmitMain() {
    this.errorMain = null;
    this.successMain = null;
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }
    this.savingMain = true;
    try {
      const payload = this.mainForm.getRawValue();
      const res: any = await this.http.post(`${environment.baseUrl}/school-config`, payload).toPromise();
      this.successMain = (res?.message) || 'Configuration saved successfully.';
    } catch (e: any) {
      this.errorMain = e?.error?.message || e?.message || 'Failed to save configuration';
    } finally {
      this.savingMain = false;
    }
  }

  async onSubmitLogo() {
    this.errorLogo = null;
    this.successLogo = null;
    this.savingLogo = true;
    try {
      const payload = this.logoForm.getRawValue();
      // Send only the logo payload; backend should merge/patch this
      const res: any = await this.http.post(`${environment.baseUrl}/school-config`, payload).toPromise();
      this.successLogo = (res?.message) || 'Logo saved successfully.';
    } catch (e: any) {
      this.errorLogo = e?.error?.message || e?.message || 'Failed to save logo';
    } finally {
      this.savingLogo = false;
    }
  }

  resetLogo() {
    this.logoForm.patchValue({ schoolLogoSRC: '' });
  }
}
