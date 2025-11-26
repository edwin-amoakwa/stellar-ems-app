import { Component, OnInit, inject } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { TermClassComponent } from "../components/term-class/term-class.component";
import { StudentSearchComponent } from "../components/student-search/student-search.component";
import { DeviceCaptureComponent } from "../components/device-capture/device-capture.component";
import {TermClassService} from "../term-class.service";
import {GeneralService} from "../general.service";

@Component({
  selector: 'app-class-members',
  standalone: true,
  imports: [CoreModule, TermClassComponent, StudentSearchComponent, DeviceCaptureComponent],
  templateUrl: './attendance-registration.component.html',
  styleUrls: ['./attendance-registration.component.scss']
})
export class AttendanceRegistrationComponent implements OnInit {
  private termClassService = inject(TermClassService);
  private generalService = inject(GeneralService);

  selectedTermClass: any = null;
  selectedStudent: any = null;

  isLoading = false;
  error: string | null = null;

  // List of students already in the selected class
  studentList: Array<{ id: string; referenceNo: string; fullname: string }> = [];

  // Dialog state
  showDialog = false;
  activeStudent: any = null;

  ngOnInit(): void {
    // If a class is preselected (unlikely), load its members
    if (this.selectedTermClass?.id) {
      this.loadMembers(this.selectedTermClass.id);
    }
  }

  async loadMembers(termClassId: string) {
    this.isLoading = true;

    try {
      const resp = await this.termClassService.getClassMembers(termClassId);
      if (resp.success) {
        this.studentList = resp.data || [];
      }
    } catch (e: any) {
    } finally {
      this.isLoading = false;
    }
  }

  // ============ Attendance Registration Dialog ============
  openRegistration(student: any) {
    this.activeStudent = student;
    this.showDialog = true;
  }


    async sendDataToDevice(data:any) {
        this.isLoading = true;

        try {
            const resp = await this.generalService.sendToDevice(data.studentId)
            if (resp.success) {

            }
        } catch (e: any) {
        } finally {
            this.isLoading = false;
        }
    }

  onCaptureSaved(evt: { studentId: string; imageBase64: string }) {
    // Potentially refresh or give additional feedback; dialog closes via two-way binding
    console.log('Capture saved for student', evt?.studentId);
  }

  selectTermClass(termClass: any) {
    this.selectedTermClass = termClass;
    console.log('Selected term class:', termClass);
    if (termClass?.id) {
      this.loadMembers(termClass.id);
    }
  }

}
