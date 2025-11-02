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

        const response = await this.attendanceService.getAttendeesList(this.selectedAttendance.id);
        this.attendeesList = response.data ;

    }

  selectStudent(student: any) {
      this.selectedStudent = student;
      console.log('Selected student:', student);

  }

}
