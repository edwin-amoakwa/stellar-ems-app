import { Component, OnInit, inject } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { TermClassComponent } from "../components/term-class/term-class.component";
import { StudentSearchComponent } from "../components/student-search/student-search.component";
import { MessageBox } from '../message-helper';
import { TermClassService } from './term-class.service';

@Component({
  selector: 'app-class-members',
  standalone: true,
  imports: [CoreModule, TermClassComponent, StudentSearchComponent],
  templateUrl: './class-members.component.html',
  styleUrls: ['./class-members.component.scss']
})
export class ClassMembersComponent implements OnInit {

  private termClassService = inject(TermClassService);

  selectedTermClass: any = null;
  selectedStudent: any = null;

  isLoading = false;
  error: string | null = null;

  // List of students already in the selected class
  studentList: Array<{ referenceNo: string; fullname: string }> = [];

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

  selectTermClass(termClass: any) {
    this.selectedTermClass = termClass;
    console.log('Selected term class:', termClass);
    if (termClass?.id) {
      this.loadMembers(termClass.id);
    }
  }

  async selectStudent(student: any) {
    this.selectedStudent = student;
    console.log('Selected student:', student);

    if (!this.selectedTermClass?.id) {
      MessageBox.warning('Please select a class first');
      return;
    }

    const confirm = await MessageBox.confirm(
      'Add Student',
      `Do you want to add ${student?.fullname || 'this student'} to ${this.selectedTermClass?.schoolClassName || 'the selected class'}?`
    );
    if (!confirm.value) return;

    try {
      this.isLoading = true;
      const resp = await this.termClassService.addStudentToClass(this.selectedTermClass.id, student.id);
      if (resp?.success) {
        MessageBox.success(resp?.message || 'Student added to class');
        await this.loadMembers(this.selectedTermClass.id);
      } else {
        MessageBox.error(resp?.message || 'Failed to add student');
      }
    } catch (e: any) {
      console.error('Failed to add student', e);
      MessageBox.error(e?.error?.message || e?.message || 'Failed to add student');
    } finally {
      this.isLoading = false;
    }
  }

}
