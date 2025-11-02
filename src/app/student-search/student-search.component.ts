import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { StudentSearchDataService, StudentSearchFilters } from './student-search.data-service';
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
  items: any[] = [];
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
      this.items = cached.data || [];
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
    const filters = this.form.getRawValue() as StudentSearchFilters;
    this.loading = true;
    this.error = null;
    try {
      const resp = await this.dataService.search(filters);
      if (resp?.success) {
        this.items = resp.data || [];
      } else {
        this.items = [];
        this.error = resp?.message || 'Failed to load students';
      }
    } catch (e) {
      console.error('Student search failed', e);
      this.items = [];
      this.error = 'An unexpected error occurred while loading students';
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
