
import { Routes } from '@angular/router';
import { SenderIdComponent } from './sender-id/sender-id.component';
import { AuthGuard } from './core/auth.guard';
import { BuyCreditComponent } from './buy-credit/buy-credit.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ProvidersComponent } from './providers/providers.component';

// Eagerly loaded (no lazy loading)
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffComponent } from './staff/staff.component';
import { SchoolClassComponent } from './school-class/school-class.component';
import { DistributionGroupsComponent } from './distribution-groups/distribution-groups.component';
import { SmsComponent } from './sms/sms.component';
import { SmsRecordsComponent } from './sms-records/sms-records.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {PlainComponent} from './layouts/plain/plain.component';
import {TestComponent} from './test/test.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import {StudentComponent} from "./student/student.component";
import {SettingComponent} from "./setting/setting.component";
import {AppRouteNames} from "./setting/lookup.service";
import {GenericLookupComponent} from "./setting/generic-lookup/generic-lookup.component";
import {AttendanceDeviceComponent} from "./attendance-device/attendance-device.component";
import { ClassMembersComponent } from './class-members/class-members.component';
import {AttendanceComponent} from "./attendance/attendance.component";

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

        { path: 'staffs', component: StaffComponent },
        { path: 'students', component: StudentComponent },
        { path: 'class-members', component: ClassMembersComponent },
        { path: 'attendance', component: AttendanceComponent },
        { path: 'attendance-devices', component: AttendanceDeviceComponent },
        { path: 'buy-credit', component: BuyCreditComponent },
        // { path: 'settings', component: SettingComponent },




      { path: 'sender-id', component: SenderIdComponent },


      { path: 'providers', component: ProvidersComponent },
      { path: 'test', component: TestComponent },

      { path: 'classes', component: SchoolClassComponent },
      { path: 'group-contacts', component: DistributionGroupsComponent },
      { path: 'send-sms', component: SmsComponent },
      { path: 'sms-records', component: SmsRecordsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'update-password', component: UpdatePasswordComponent },
      { path: 'notification-settings', loadComponent: () => import('./notification-settings/notification-settings.component').then(m => m.NotificationSettingsComponent) },
        {
            path: AppRouteNames.Settings,
            component: SettingComponent,
            // data: { authorize: Privileges.Setting },
            children: [
                {
                    path: AppRouteNames.GenericSettings,
                    component: GenericLookupComponent,
                    // data: { authorize: Privileges.Setting }
                }
            ]
        },
    ]
  },

  {
    path: '',
    component: PlainComponent,
    children: [
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'denied', component: AccessDeniedComponent }
    ]
  }
];

