
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { NotificationService } from '../core/notification.service';
import { CollectionUtil } from '../core/system.utils';
import { StaticDataService } from '../static-data.service';
import { StudentService } from './student.service';
import {CoreModule} from "../core/core.module";
import {FormView} from "../core/form-view";
import {ValidateInputDirective} from "../core/directives/input-required.directive";
import { AcademicTermClassesDataService } from './academic-term-classes.data-service';
import { StudentGuardianComponent } from './student-guardian/student-guardian.component';

@Component({
  selector: 'app-users',
  standalone: true,
    imports: [
        CoreModule,
        StudentGuardianComponent
    ],
  providers: [MessageService],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);
  private termClassDataService = inject(AcademicTermClassesDataService);
  
  // Guardians
  guardiansList: any[] = [];
  guardiansLoading = false;

  defaultStudent:any = {};
  formView:FormView = new FormView();
  studentList: any[] = [];
  studentForm!: FormGroup;
  selectedStudent: any | null = null;
  loading = false;

  // Term classes for dropdown
  termClasses: any[] = [];
  termClassesLoading = false;
  termClassesError: string | null = null;

  religionOptions: any[] = StaticDataService.religion();
  regionsList: any[] = StaticDataService.regions();
  sexList: any[] = StaticDataService.gender();


  ngOnInit() {
    this.initializeForm();

    this.loadStudents();
    this.loadTermClasses();
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      id: [null],
      username: [''],
      externalId: [''],
      referenceNo: [''],
      dateOfBirth: [null],
      gender: [''],
      currentClassId: [null],
      surname: [''],
      othernames: [''],
      firstName: [''],
      postalAddress: [''],
      mobileNo: [''],
      otherContactNos: [''],
      emailAddress: [''],
      region: null,
      religion: null,
      homeTown: [''],
      residentialAddress: ['']
    });

    this.defaultStudent = this.studentForm.getRawValue();
  }

  async loadStudents() {
    try {
      this.loading = true;
      const param:any = {};
      param.general = true;
      const response = await this.studentService.getStudent(param);

      if (response.success) {
        this.studentList = response.data;
      }

    } catch (error: any) {

    } finally {
      this.loading = false;
    }
  }

  async saveStudent(user: any) {
    try {
      const response = await this.studentService.saveStudent(user);
      if (response.success) {
        CollectionUtil.add(this.studentList, response.data);
        this.closeUserDialog();
      }
    } catch (error: any) {
    }
  }

  async loadTermClasses() {
    this.termClassesLoading = true;
    this.termClassesError = null;
    try {
      const resp = await this.termClassDataService.list();
      if (resp?.success) {
        this.termClasses = resp.data || [];
      } else {
        this.termClasses = [];
        this.termClassesError = resp?.message || 'Failed to load classes';
      }
    } catch (e) {
      this.termClasses = [];
      this.termClassesError = 'Failed to load classes';
    } finally {
      this.termClassesLoading = false;
    }
  }

  async onSubmit() {
      console.log(this.studentForm.invalid);
      if (ValidateInputDirective.invalidForm(this.studentForm)) {
          console.log(this.studentForm.invalid);
          return;
      }

    const userData = this.studentForm.value;
    if (this.selectedStudent) {
      userData.id = this.selectedStudent.id;
    }
    await this.saveStudent(userData);
  }

  editStudent(student: any) {
    this.selectedStudent = student;
    this.studentForm.patchValue(student);
    this.formView.resetToCreateView();
  }

  viewDetails(student: any) {
    this.selectedStudent = student;
    this.formView.resetToDetailView();
  }

  async deleteStudent(student: any) {
    if (confirm(`Are you sure you want to delete Staff "${student.fullname}"?`)) {
      try {
        this.loading = true;
        const response = await this.studentService.deleteStudent(student.id!);

        if (response.success) {
          CollectionUtil.remove(this.studentList, student.id);
        }
      } catch (error: any) {
        this.notificationService.error('Failed to delete Staff');
      } finally {
        this.loading = false;
      }
    }
  }

  initNewStudent() {
    this.selectedStudent = null;
    this.resetForm();
    this.formView.resetToCreateView();

  }

  closeUserDialog() {
    this.formView.resetToListView();
    this.resetForm();
  }

  goBackToList() {
    this.formView.resetToListView();
  }

  resetForm() {
    this.studentForm.reset(this.defaultStudent);
  }


}
