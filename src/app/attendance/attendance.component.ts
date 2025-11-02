import {Component, inject} from '@angular/core';
import { CoreModule } from '../core/core.module';
import {TermClassComponent} from "../components/term-class/term-class.component";
import {StudentSearchComponent} from "../components/student-search/student-search.component";
import {TermClassService} from "../class-members/term-class.service";

@Component({
  selector: 'app-class-members',
  standalone: true,
    imports: [CoreModule, TermClassComponent, StudentSearchComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {

    private termClassService = inject(TermClassService);

    selectedTermClass: any = null;
    selectedStudent

  isLoading = false;
  error: string | null = null;

  studentList: Array<{ referenceNo: string; fullName: string; className: string }> = [
    { referenceNo: 'STU-001', fullName: 'Ama Mensah', className: 'JHS 1A' },
    { referenceNo: 'STU-002', fullName: 'Kojo Asante', className: 'JHS 1A' },
    { referenceNo: 'STU-003', fullName: 'Yaw Boateng', className: 'JHS 1B' }
  ];

  async selectTermClass(termClass: any) {
      this.selectedTermClass = termClass;
    console.log('Selected term class:', termClass);

      this.isLoading = true;

      try {
          const resp = await this.termClassService.getClassMembers(termClass.id);
          this.studentList = resp.data ;

      } catch (e: any) {
      } finally {
          this.isLoading = false;
      }
  }

  selectStudent(student: any) {
      this.selectedStudent = student;
      console.log('Selected student:', student);



  }

}
