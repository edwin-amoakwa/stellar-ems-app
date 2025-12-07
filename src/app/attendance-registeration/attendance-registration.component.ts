import { Component, OnInit, inject } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { TermClassComponent } from "../components/term-class/term-class.component";
import { DeviceCaptureComponent } from "../components/device-capture/device-capture.component";
import {TermClassService} from "../term-class.service";
import {PictureService} from "../picture.service";
import {CollectionUtil} from "../core/system.utils";
import {TabPanel, TabView} from "primeng/tabview";

@Component({
  selector: 'app-class-members',
  standalone: true,
    imports: [CoreModule, TermClassComponent, DeviceCaptureComponent, TabPanel, TabView],
  templateUrl: './attendance-registration.component.html',
  styleUrls: ['./attendance-registration.component.scss']
})
export class AttendanceRegistrationComponent implements OnInit {
  private termClassService = inject(TermClassService);
  private pictureService = inject(PictureService);

  selectedTermClass: any = null;
  selectedStudent: any = null;

  isLoading = false;
  error: string | null = null;

  studentList: Array<any> = [];
  // Search text for Picture View filter
  pictureSearchText: string = '';

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
      const resp = await this.pictureService.classMembers(termClassId);
      if (resp.success) {
        this.studentList = resp.data || [];
      }
    } catch (e: any) {
    } finally {
      this.isLoading = false;
    }
  }

  // ============ Attendance Registration Dialog ============
  takePicture(student: any) {
    this.activeStudent = student;
    this.showDialog = true;
  }


    async sendDataToDevice(data:any) {
        this.isLoading = true;

        try {
            // const resp = await this.pictureService.sendToDevice(data.studentId)
            const resp = await this.pictureService.sendToDevice(data.id)
            if (resp.success) {

            }
        } catch (e: any) {
        } finally {
            this.isLoading = false;
        }
    }

  onCaptureSaved(evt) {
    // Potentially refresh or give additional feedback; dialog closes via two-way binding
    //   console.log()
    console.log('Capture saved for student', evt);

    let student = this.studentList.find(s => s.id === evt.id);
    student.pictureBase64 = evt.pictureBase64;

    CollectionUtil.add(this.studentList, student);
  }

  selectTermClass(termClass: any) {
    this.selectedTermClass = termClass;
    console.log('Selected term class:', termClass);
    if (termClass?.id) {
      this.loadMembers(termClass.id);
    }
  }

  getStudentImageSrc(item: any): string {
    const base64 = item?.pictureBase64 || item?.imageBase64 || null;
    if (base64) {
      const isDataUri = typeof base64 === 'string' && base64.trim().startsWith('data:');
      return isDataUri ? base64 : `data:image/jpeg;base64,${base64}`;
    }
    // Inline SVG placeholder (neutral avatar)
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <circle cx="200" cy="150" r="80" fill="#cbd5e1"/>
        <rect x="80" y="250" width="240" height="90" rx="45" fill="#cbd5e1"/>
      </svg>
    `.trim());
  }

  // Filtered list for Picture View based on pictureSearchText
  get pictureViewFiltered(): any[] {
    const q = (this.pictureSearchText || '').toString().trim().toLowerCase();
    if (!q) return this.studentList || [];
    const fields = ['personName', 'studentName', 'fullname', 'referenceNo', 'studentId', 'id'];
    return (this.studentList || []).filter((item: any) =>
      fields.some(f =>
        (item?.[f] ?? '').toString().toLowerCase().includes(q)
      )
    );
  }

}
