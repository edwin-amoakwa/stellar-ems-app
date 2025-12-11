import {Component, inject} from '@angular/core';
import { CoreModule } from '../../core/core.module';
import {TermClassComponent} from "../../components/term-class/term-class.component";
import {StudentSearchComponent} from "../../components/student-search/student-search.component";
import {TermClassService} from "../../term-class.service";
import {AttendanceService} from "../attendance.service";
import {FormView} from "../../core/form-view";
import {CollectionUtil, DateUtil} from "../../core/system.utils";
import { CalendarModule } from 'primeng/calendar';
import {AttendanceDetailComponent} from "../attendance-details/attendance-detail.component";

export enum AttendanceFilter {
    ALL,
    PRESENT,
    ABSENT
}

@Component({
  selector: 'app-class-attendance-history',
  standalone: true,
    imports: [CoreModule, TermClassComponent, CalendarModule, AttendanceDetailComponent],
  templateUrl: './class-attendance-history.component.html',
  styleUrls: ['./class-attendance-history.component.scss']
})
export class ClassAttendanceHistoryComponent {


    private attendanceService = inject(AttendanceService);


    formView:FormView = new FormView();


    schoolAttendanceType = 'SCHOOL_ATTENDANCE';
    selectedTermClass: any = null;

    selectedAttendance: any = null;

    // date picker model
    selectedDate: Date = new Date();

    isLoading = false;
    error: string | null = null;

    attendancesList: any[] = [];

    deletingId: any = null; // attendance id being deleted

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
        // detail is handled by attendance-detail component

    }


    async deleteAttendance(attendance: any) {
        if (!attendance?.id) return;
        const confirmed = window.confirm('Are you sure you want to delete this attendance record?');
        if (!confirmed) return;

        this.deletingId = attendance.id;
        try {
            const resp = await this.attendanceService.deleteAttendance(attendance.id);
            if (resp?.success !== false) {
                CollectionUtil.remove(this.attendancesList, attendance.id);
            }
        } catch (e) {
            console.error('Delete attendance failed', e);
        } finally {
            this.deletingId = null;
        }
    }
}
