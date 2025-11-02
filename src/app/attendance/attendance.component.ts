import {Component, inject} from '@angular/core';
import { CoreModule } from '../core/core.module';
import {TermClassComponent} from "../components/term-class/term-class.component";
import {StudentSearchComponent} from "../components/student-search/student-search.component";
import {TermClassService} from "../class-members/term-class.service";
import {AttendanceService} from "./attendance.service";
import {FormView} from "../core/form-view";
import {CollectionUtil, DateUtil} from "../core/system.utils";
import { CalendarModule } from 'primeng/calendar';

export enum AttendanceFilter {
    ALL,
    PRESENT,
    ABSENT
}

@Component({
  selector: 'app-class-members',
  standalone: true,
    imports: [CoreModule, TermClassComponent, StudentSearchComponent, CalendarModule],
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

    // date picker model
    selectedDate: Date = new Date();

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



    startEdit(item: any) {
        this.editingId = item?.id ;
        this.editModel = item;
    }

    cancelEdit() {
        this.editingId = null;
        this.editModel = null;
        this.savingId = null;
    }

    async saveEdit(item: any) {
        if (!this.selectedAttendance) return;

        this.savingId = item?.id;
        // const payload = {
        //     present: !!this.editModel?.present,
        //     clockInTime: this.combineDateAndTimeToIso(this.selectedAttendance?.valueDate, this.editModel?.clockInTime),
        //     clockOutTime: this.combineDateAndTimeToIso(this.selectedAttendance?.valueDate, this.editModel?.clockOutTime)
        // };
        try {
            const response = await this.attendanceService.updateAttendee(this.selectedAttendance.id,item);
            CollectionUtil.add(this.attendeesList, response.data);

            this.cancelEdit();
        } catch (e) {
            console.error('Update failed', e);
        } finally {
            this.savingId = null;
        }
    }

    async notify(item: any) {

        this.notifyingId = item?.id ;
        try {
            await this.attendanceService.notifyAttendee(this.selectedAttendance.id, item?.id);
        } catch (e) {
            console.error('Notify failed', e);
        } finally {
            this.notifyingId = null;
        }
    }

    async initAttendance() {
        if (!this.selectedTermClass) return;
        this.isLoading = true;
        this.error = null;
        const payload: any = {
            academicTermClassId: this.selectedTermClass.id,
            attendanceType: this.schoolAttendanceType,
            attendees: 'STUDENTS_ONLY',
            valueDate: DateUtil.toDate(this.selectedDate)
        };
        try {
            const response = await this.attendanceService.initAttendance(payload);
            if(!response.success)
            {
                return;
            }

            // await this.selectTermClass(this.selectedTermClass);
            await this.selectAttendance(response.data);

        } catch (e: any) {
            console.error('Init attendance failed', e);
            this.error = e?.message || 'Failed to initialize attendance';
        } finally {
            this.isLoading = false;
        }
    }

}
