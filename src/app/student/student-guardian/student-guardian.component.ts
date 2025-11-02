import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { StudentGuardianService } from '../student-guardian.service';

@Component({
  selector: 'app-student-guardian',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './student-guardian.component.html',
  styleUrls: ['./student-guardian.component.scss']
})
export class StudentGuardianComponent implements OnChanges {
  private service = inject(StudentGuardianService);

  @Input() student: any | null = null;

  guardiansList: any[] = [];
  loading = false;
  error: string | null = null;

  // Dialog state
  showAddGuardian = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      this.loadGuardians();
    }
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
    this.showAddGuardian = true;
  }

  closeAddGuardian(): void {
    this.showAddGuardian = false;
  }

  onSetPassword(guardian: any): void {
    // Placeholder handler
    // TODO: Implement backend call to trigger password set/reset for guardian
    console.log('Set password for guardian', guardian);
  }
}
