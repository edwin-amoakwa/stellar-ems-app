import {Component, inject, OnInit} from '@angular/core';
import { CoreModule } from '../../core/core.module';
import {TermClassComponent} from "../../components/term-class/term-class.component";
import {TermClassService} from "../../term-class.service";
import { TermClassService as TermClassDataService } from "../../components/term-class/term-class.service";
import {AttendanceService} from "../attendance.service";
import {FormView} from "../../core/form-view";
import {CollectionUtil, DateUtil} from "../../core/system.utils";
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import {AttendanceDetailComponent} from "../attendance-details/attendance-detail.component";

export enum AttendanceFilter {
    ALL,
    PRESENT,
    ABSENT
}

@Component({
  selector: 'app-class-daily-attendance',
  standalone: true,
    imports: [CoreModule, TermClassComponent, CalendarModule, DropdownModule, AttendanceDetailComponent],
  templateUrl: './class-daily-attendance.component.html',
  styleUrls: ['./class-daily-attendance.component.scss']
})
export class ClassDailyAttendanceComponent implements OnInit{

    private termClassService = inject(TermClassService);
    private termClassDataService = inject(TermClassDataService);
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
    termClassesList: any[] = [];


    ngOnInit(): void {
        this.loadAttendanceList();
        this.loadTermClasses();
    }

    public async loadAttendanceList(){
        const params:any = {};
        params.valueDate = DateUtil.toDate(this.selectedDate);
        const response = await this.attendanceService.getDailyAttendance(params);
        this.attendancesList = response.data ;
    }

    private async loadTermClasses(){
        try {
            const list = await this.termClassDataService.getCurrentClassesList();
            this.termClassesList = list || [];
        } catch (e) {
            this.termClassesList = [];
        }
    }

    // async selectTermClass(termClass: any) {
    //     this.selectedTermClass = termClass;
    //     this.formView.resetToListView();
    //
    //     console.log('Selected term class:', termClass);
    //
    //     this.isLoading = true;
    //
    //     const params:any = {};
    //     params.termClassId = termClass.id;
    //     params.attendanceType = this.schoolAttendanceType;
    //
    //     try {
    //         const response = await this.attendanceService.getAttendances(params);
    //         this.attendancesList = response.data ;
    //
    //     } catch (e: any) {
    //     } finally {
    //         this.isLoading = false;
    //     }
    // }


    async selectAttendance(attendance: any) {
        this.selectedAttendance = attendance;
        this.formView.resetToDetailView();
        // detail is handled by attendance-detail component

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
