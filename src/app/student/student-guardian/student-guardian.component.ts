import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { StudentGuardianService } from '../student-guardian.service';
import {GuardianSearchComponent} from "../../components/guardian-search/guardian-search.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../static-data.service';
import { GuardianService } from '../../guardian/guardian.service';

@Component({
  selector: 'app-student-guardian',
  standalone: true,
    imports: [CommonModule, CoreModule, GuardianSearchComponent],
  templateUrl: './student-guardian.component.html',
  styleUrls: ['./student-guardian.component.scss']
})
export class StudentGuardianComponent implements OnChanges {
  private service = inject(StudentGuardianService);
  private guardianService = inject(GuardianService);
  private fb = inject(FormBuilder);

  @Input() student: any | null = null;

  selectedGuardian: any ;
  guardiansList: any[] = [];
  loading = false;
  error: string | null = null;

  // Dialog state
  showAddGuardian = false;
  showCreateGuardian = false;
  showEditGuardian = false;

  // track currently editing guardian
  private editingGuardian: any | null = null;

  // Relationship selection for adding existing guardian to student
  selectedRelationship: any = null;

  // Create guardian form
  guardianForm: FormGroup = this.fb.group({
    guardianName: ['', [Validators.required]],
    mobileNo: ['', [Validators.required]],
    emailAddress: ['', [Validators.email]],
    gender: [null, ],
    postalAddress: [''],
    relationship: [null, ]
  });

  relations = StaticDataService.relationsList();
  genders = StaticDataService.gender();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      this.loadGuardians();
    }
  }

  selectGuardian(guardian)
  {
      this.selectedGuardian = guardian;
      // console.log(this.student);
      // console.log(this.selectedGuardian);
  }

  async loadGuardians(): Promise<void> {
    if (!this.student?.id) {
      this.guardiansList = [];
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      const resp = await this.service.listByStudentId(this.student.id);
      if (resp?.success) {
        this.guardiansList = resp.data || [];
      } else {
        this.guardiansList = [];
        this.error = resp?.message || 'Failed to load guardians';
      }
    } catch (e) {
      this.guardiansList = [];
      this.error = 'Failed to load guardians';
    } finally {
      this.loading = false;
    }
  }

  openAddGuardian(): void {
    this.selectedRelationship = null;
    this.showAddGuardian = true;
  }

  closeAddGuardian(): void {
    this.showAddGuardian = false;
    this.selectedRelationship = null;
  }

  openCreateGuardian(): void {
    this.guardianForm.reset();
    this.showCreateGuardian = true;
  }

  closeCreateGuardian(): void {
    this.showCreateGuardian = false;
  }

  async saveNewGuardian(): Promise<void> {
    if (!this.student?.id) {
      this.error = 'No student selected';
      return;
    }
    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    const payload:any = this.guardianForm.value;
      payload.studentId= this.student.id

    try {
      const resp = await this.guardianService.saveGuardian(payload);
      if (resp?.success) {
        this.closeCreateGuardian();
        await this.loadGuardians();
      } else {
        this.error = resp?.message || 'Failed to save guardian';
      }
    } catch (e) {
      this.error = 'Failed to save guardian';
    }
  }

  onSetPassword(guardian: any): void {
    // Placeholder handler
    // TODO: Implement backend call to trigger password set/reset for guardian
    console.log('Set password for guardian', guardian);
  }

  async addSelectedGuardianToStudent(): Promise<void> {
    if (!this.student?.id) {
      this.error = 'No student selected';
      return;
    }
    if (!this.selectedGuardian?.id) {
      this.error = 'No guardian selected';
      return;
    }
    if (!this.selectedRelationship) {
      this.error = 'Please select relationship';
      return;
    }

    const payload = {
      id: this.selectedGuardian.id,
      studentId: this.student.id,
      relationship: this.selectedRelationship
    };

    try {
      const resp = await this.guardianService.addStudent(payload);
      if (resp?.success) {
        await this.loadGuardians();
        this.closeAddGuardian();
      } else {
        this.error = resp?.message || 'Failed to add guardian to student';
      }
    } catch (e) {
      this.error = 'Failed to add guardian to student';
    }
  }

  openEditGuardian(item: any): void {
    this.editingGuardian = item || null;
    // patch form with existing values
    this.guardianForm.reset();
    this.guardianForm.patchValue({
      guardianName: item?.guardianName ?? '',
      mobileNo: item?.mobileNo ?? '',
      emailAddress: item?.emailAddress ?? '',
      gender: item?.gender ?? null,
      postalAddress: item?.postalAddress ?? '',
      relationship: item?.relationship ?? null,
    });
    this.showEditGuardian = true;
  }

  closeEditGuardian(): void {
    this.showEditGuardian = false;
    this.editingGuardian = null;
  }

  async saveEditedGuardian(): Promise<void> {
    if (!this.student?.id) {
      this.error = 'No student selected';
      return;
    }
    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    const payload: any = {
      ...this.guardianForm.value,
      id: this.editingGuardian?.id,
      studentId: this.student.id,
    };

    try {
      const resp = await this.guardianService.saveGuardian(payload);
      if (resp?.success) {
        this.closeEditGuardian();
        await this.loadGuardians();
      } else {
        this.error = resp?.message || 'Failed to update guardian';
      }
    } catch (e) {
      this.error = 'Failed to update guardian';
    }
  }

  async onDeleteGuardian(item: any): Promise<void> {
    if (!item?.id) {
      return;
    }
    const ok = typeof window !== 'undefined' ? window.confirm(`Delete guardian "${item.guardianName}"? This action cannot be undone.`) : true;
    if (!ok) return;

    try {
      const resp = await this.guardianService.deletestudentGuardian(item.studentGuardianId);
      if (resp?.success) {
        await this.loadGuardians();
      } else {
        this.error = resp?.message || 'Failed to delete guardian';
      }
    } catch (e) {
      this.error = 'Failed to delete guardian';
    }
  }
}
