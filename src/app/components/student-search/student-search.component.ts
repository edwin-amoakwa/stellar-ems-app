import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { StudentSearchDataService } from './student-search.data-service';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss']
})
export class StudentSearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dataService = inject(StudentSearchDataService);

  @Output() studentSelected = new EventEmitter<any>();

  form!: FormGroup;
  studentList: any[] = [];
  loading = false;
  error: string | null = null;
  private sub?: Subscription;

  ngOnInit(): void {
    this.form = this.fb.group({
      referenceNo: [''],
      surname: [''],
      firstName: ['']
    });

    // Load from localStorage cache on init (no API call)
    const cached = this.dataService.getCached();
    if (cached) {
      const filters = cached.filters || { referenceNo: '', surname: '', firstName: '' };
      this.form.patchValue(filters, { emitEvent: false });
      this.studentList = cached.data || [];
    }

    // Auto-search with debounce for subsequent changes (direct API call)
    this.sub = this.form.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.search());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async search(): Promise<void> {
    const filters = this.form.getRawValue() ;

    this.loading = true;
    this.error = null;
    try {
      const response = await this.dataService.search(filters);
      if (response?.success) {
        this.studentList = response.data;
      }

    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  clearFilters(): void {
    this.form.reset({ referenceNo: '', surname: '', firstName: '' });
    // search() will be triggered by valueChanges
  }

  onRowClick(item: any): void {
    this.studentSelected.emit(item);
  }
}
