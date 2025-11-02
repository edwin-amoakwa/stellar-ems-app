import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { GuardianSearchDataService } from './guardian-search.data-service';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-guardian-search',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './guardian-search.component.html',
  styleUrls: ['./guardian-search.component.scss']
})
export class GuardianSearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dataService = inject(GuardianSearchDataService);

  @Output() guardianSelected = new EventEmitter<any>();

  form!: FormGroup;
  guardianList: any[] = [];
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
      this.guardianList = cached.data || [];
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
    const filters = this.form.getRawValue();

    this.loading = true;
    this.error = null;
    try {
      const response = await this.dataService.search(filters);
      if (response?.success) {
        this.guardianList = response.data;
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
    this.guardianSelected.emit(item);
  }
}
