import { Component } from '@angular/core';
import { CoreModule } from '../core/core.module';
import {TermClassComponent} from "../term-class/term-class.component";
import {StudentSearchComponent} from "../student-search/student-search.component";

@Component({
  selector: 'app-class-members',
  standalone: true,
    imports: [CoreModule, TermClassComponent, StudentSearchComponent],
  templateUrl: './class-members.component.html',
  styleUrls: ['./class-members.component.scss']
})
export class ClassMembersComponent {


    selectedTermClass: any = null;

  isLoading = false;
  error: string | null = null;

  items: Array<{ referenceNo: string; fullName: string; className: string }> = [
    { referenceNo: 'STU-001', fullName: 'Ama Mensah', className: 'JHS 1A' },
    { referenceNo: 'STU-002', fullName: 'Kojo Asante', className: 'JHS 1A' },
    { referenceNo: 'STU-003', fullName: 'Yaw Boateng', className: 'JHS 1B' }
  ];

  selectTermClass(termClass: any) {
      this.selectedTermClass = termClass;
    console.log('Selected term class:', termClass);
  }
}
