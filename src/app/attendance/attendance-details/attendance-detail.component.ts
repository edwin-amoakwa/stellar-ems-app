import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject} from '@angular/core';
import {CoreModule} from '../../core/core.module';
import {AttendanceService} from '../attendance.service';

export enum AttendanceDetailFilter {
  ALL,
  PRESENT,
  ABSENT
}

@Component({
  selector: 'app-attendance-detail',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnChanges {

  private attendanceService = inject(AttendanceService);

  @Input() attendance: any | null = null;
  @Output() close = new EventEmitter<void>();

  // expose enum to template
  AttendanceFilter = AttendanceDetailFilter;

  currentFilter: AttendanceDetailFilter = AttendanceDetailFilter.ALL;

  attendeesList: any[] = [];

  // inline edit state
  editingId: any = null; // attendee record id currently editing
  editModel: any = null; // working copy for the row
  savingId: any = null; // attendee id being saved
  notifyingId: any = null; // attendee id being notified

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['attendance'] && this.attendance?.id) {
      await this.loadAttendees();
      // reset filter and editing state when attendance changes
      this.currentFilter = AttendanceDetailFilter.ALL;
      this.cancelEdit();
    }
  }

  private async loadAttendees() {
    if (!this.attendance) return;
    const response = await this.attendanceService.getAttendeesList(this.attendance.id);
    this.attendeesList = response.data || [];
  }

  setFilter(filter: AttendanceDetailFilter) {
    this.currentFilter = filter;
  }

  get filteredAttendees() {
    if (!this.attendeesList) return [];
    switch (this.currentFilter) {
      case AttendanceDetailFilter.PRESENT:
        return this.attendeesList.filter(a => a.present === true);
      case AttendanceDetailFilter.ABSENT:
        return this.attendeesList.filter(a => a.present === false);
      default:
        return this.attendeesList;
    }
  }

  startEdit(item: any) {
    this.editingId = item?.id;
    this.editModel = item;
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = null;
    this.savingId = null;
  }

  async saveEdit(item: any) {
    if (!this.attendance) return;
    this.savingId = item?.id;

    try {
      const response = await this.attendanceService.updateAttendee(this.attendance.id, item);
      // Update local list with new data
      const idx = this.attendeesList.findIndex(a => (a.id ?? a.attendeeId) === (response.data?.id ?? response.data?.attendeeId));
      if (idx >= 0) {
        this.attendeesList[idx] = response.data;
      }
      this.cancelEdit();
    } catch (e) {
      console.error('Update failed', e);
    } finally {
      this.savingId = null;
    }
  }

  async notify(item: any) {
    if (!this.attendance) return;
    this.notifyingId = item?.id;
    try {
      await this.attendanceService.notifyAttendee(this.attendance.id, item?.id);
    } catch (e) {
      console.error('Notify failed', e);
    } finally {
      this.notifyingId = null;
    }
  }
}
