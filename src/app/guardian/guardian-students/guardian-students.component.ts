import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { GuardianService } from '../guardian.service';

@Component({
  selector: 'app-guardian-students',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './guardian-students.component.html',
  styleUrls: ['./guardian-students.component.css']
})
export class GuardianStudentsComponent implements OnChanges {
  private service = inject(GuardianService);

  @Input() guardian: any | null = null;

  loading = false;
  error: string | null = null;
  students: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guardian']) {
      this.loadStudents();
    }
  }

  async loadStudents(): Promise<void> {
    if (!this.guardian?.id) {
      this.students = [];
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      const resp = await this.service.getStudentsForGuardian(this.guardian.id);

        this.students = resp.data ;

    } catch (e) {
      this.students = [];
      this.error = 'Failed to load students';
    } finally {
      this.loading = false;
    }
  }
}
