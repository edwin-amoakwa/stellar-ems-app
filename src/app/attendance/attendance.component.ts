import {Component, inject} from '@angular/core';
import { CoreModule } from '../core/core.module';
import {TermClassComponent} from "../components/term-class/term-class.component";
import {StudentSearchComponent} from "../components/student-search/student-search.component";
import {TermClassService} from "../class-members/term-class.service";
import {AttendanceService} from "./attendance.service";
import {FormView} from "../core/form-view";

export enum AttendanceFilter {
    ALL,
    PRESENT,
    ABSENT
}

@Component({
  selector: 'app-class-members',
  standalone: true,
    imports: [CoreModule, TermClassComponent, StudentSearchComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {

    private termClassService = inject(TermClassService);
    private attendanceService = inject(AttendanceService);

    // expose enum to template
    AttendanceFilter = AttendanceFilter;

    formView:FormView = new FormView();
    currentFilter: AttendanceFilter = AttendanceFilter.ALL;

    schoolAttendanceType = 'SCHOOL_ATTENDANCE';
    selectedTermClass: any = null;
    selectedStudent
    selectedAttendance: any = null;

    isLoading = false;
    error: string | null = null;

    attendancesList: any[] = [];
    attendeesList: any[] = [];

    // inline edit state
    editingId: any = null; // attendee record id currently editing
    editModel: any = null; // working copy for the row
    savingId: any = null; // attendee id being saved
    notifyingId: any = null; // attendee id being notified

    async selectTermClass(termClass: any) {
        this.selectedTermClass = termClass;
        this.formView.resetToListView();

        console.log('Selected term class:', termClass);

        this.isLoading = true;

        const params:any = {};
        params.termClassId = termClass.id;
        params.attendanceType = this.schoolAttendanceType;

        try {
            const response = await this.attendanceService.getAttendances(params);
            this.attendancesList = response.data ;

        } catch (e: any) {
        } finally {
            this.isLoading = false;
        }
    }


    async selectAttendance(attendance: any) {
        this.selectedAttendance = attendance;
        this.formView.resetToDetailView();
        // reset filter to ALL when opening detail view
        this.currentFilter = AttendanceFilter.ALL;
        // exit edit mode if switching
        this.cancelEdit();

        const response = await this.attendanceService.getAttendeesList(this.selectedAttendance.id);
        this.attendeesList = response.data ;

    }

    selectStudent(student: any) {
        this.selectedStudent = student;
        console.log('Selected student:', student);

    }

    setFilter(filter: AttendanceFilter) {
        this.currentFilter = filter;
    }

    get filteredAttendees() {
        if (!this.attendeesList) return [];
        switch (this.currentFilter) {
            case AttendanceFilter.PRESENT:
                return this.attendeesList.filter(a => a.present === true);
            case AttendanceFilter.ABSENT:
                return this.attendeesList.filter(a => a.present === false);
            default:
                return this.attendeesList;
        }
    }

    // ---------- Inline edit helpers ----------
    private toLocalInput(iso?: string | null): string | null {
        if (!iso) return null;
        try {
            const d = new Date(iso);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const yyyy = d.getFullYear();
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const mi = pad(d.getMinutes());
            return `${yyyy}-${mm}-${dd}T${hh}:${mi}`; // suitable for datetime-local
        } catch {
            return null;
        }
    }

    private toIso(localStr?: string | null): string | null {
        if (!localStr) return null;
        // Treat as local time, convert to ISO
        const d = new Date(localStr);
        return isNaN(d.getTime()) ? null : d.toISOString();
    }

    startEdit(item: any) {
        const attendeeId = item?.id ?? item?.attendeeId;
        this.editingId = attendeeId;
        this.editModel = {
            present: !!item.present,
            clockInTimeLocal: this.toLocalInput(item.clockInTime),
            clockOutTimeLocal: this.toLocalInput(item.clockOutTime)
        };
    }

    cancelEdit() {
        this.editingId = null;
        this.editModel = null;
        this.savingId = null;
    }

    async saveEdit(item: any) {
        if (!this.selectedAttendance) return;
        const attendeeId = item?.id ?? item?.attendeeId;
        this.savingId = attendeeId;
        const payload = {
            present: !!this.editModel?.present,
            clockInTime: this.toIso(this.editModel?.clockInTimeLocal),
            clockOutTime: this.toIso(this.editModel?.clockOutTimeLocal)
        };
        try {
            const res = await this.attendanceService.updateAttendee(this.selectedAttendance.id, attendeeId, payload);
            // Merge updated fields into local list; prefer server response if provided
            const updated = res?.data ?? { ...item, ...payload };
            const idx = this.attendeesList.findIndex(a => (a.id ?? a.attendeeId) === attendeeId);
            if (idx >= 0) {
                this.attendeesList[idx] = { ...this.attendeesList[idx], ...updated };
            }
            this.cancelEdit();
        } catch (e) {
            console.error('Update failed', e);
        } finally {
            this.savingId = null;
        }
    }

    async notify(item: any) {
        if (!this.selectedAttendance) return;
        const attendeeId = item?.id ?? item?.attendeeId;
        this.notifyingId = attendeeId;
        try {
            await this.attendanceService.notifyAttendee(this.selectedAttendance.id, attendeeId);
        } catch (e) {
            console.error('Notify failed', e);
        } finally {
            this.notifyingId = null;
        }
    }

}
