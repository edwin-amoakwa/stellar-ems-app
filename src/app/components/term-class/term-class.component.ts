import {Component, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {TermClass, TermClassService} from './term-class.service';

@Component({
  selector: 'app-term-class',
  standalone: true,
  imports: [CommonModule, CoreModule],
  templateUrl: './term-class.component.html',
  styleUrls: ['./term-class.component.scss']
})
export class TermClassComponent implements OnInit {
  private service = inject(TermClassService);

  // Inputs
  @Input() displayMode: 'table' | 'dropdown' = 'table';
  @Input() showHeader: boolean = true; // For table mode
  @Input() placeholder: string = 'Select a class'; // For dropdown mode

  // Outputs
  @Output() termClassSelected = new EventEmitter<TermClass>();

  items: TermClass[] = [];
  isLoading = false;
  error: string | null = null;
  selectedId: string | null = null; // for dropdown binding

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(force = false): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const schoolId = this.service.getSchoolId();
      const academicTermId = this.service.getAcademicTermId();

      if (!schoolId || !academicTermId) {
        this.items = [];
        this.error = 'Missing school or academic term information. Please sign in again or select a term.';
        return;
      }

      if (!force) {
        const cached = this.service.getCached();
        if (cached) {
          this.items = cached;
          return;
        }
      }

      const resp = await this.service.fetchTermClasses(schoolId, academicTermId);
      if (resp?.success) {
        const data = resp.data ?? [];
        this.items = data;
        this.service.setCache(data);
      } else {
        this.items = [];
        this.error = resp?.message || 'Failed to load classes.';
      }
    } catch (e) {
      console.error('Failed to load term classes', e);
      this.items = [];
      this.error = 'An unexpected error occurred while loading classes.';
    } finally {
      this.isLoading = false;
    }
  }

  refresh(): void {
    this.service.clearCache();
    this.load(true);
  }

  onRowClick(item: TermClass): void {
    this.termClassSelected.emit(item);
  }

  onDropdownChange(id: string | null): void {
    if (!id) return;
    const found = this.items.find(x => x.schoolClassId === id);
    if (found) {
      this.termClassSelected.emit(found);
    }
  }
}
