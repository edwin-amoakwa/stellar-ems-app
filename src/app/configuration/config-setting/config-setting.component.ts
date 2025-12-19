// import { Component, OnInit } from '@angular/core';
// import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
// import { CompanyConfig } from 'src/app/company-config';
// import { CoreModule } from 'src/app/core/core.module';
// import { FormView } from 'src/app/core/form-view';
// import { ObjectUtil } from 'src/app/core/system.utils';
// import { AppCommonModule } from 'src/app/shared/app.common.module';
// import { ConfigService } from "../service/config.service";
//
//
// @Component({
//     selector: 'app-config-setting',
//     templateUrl: './config-setting.component.html',
//     styleUrls: ['./config-setting.component.scss'],
//         imports:[CoreModule, AppCommonModule],
//     standalone: true
// })
// export class ConfigSettingComponent implements OnInit
// {
//   formView:FormView = FormView.listView();
//   display: boolean = false;
//
//   settingForm: UntypedFormGroup;
//   selectedConfig;
//
//   settingsList:any = [];
//   loading: any;
//   router: any;
//
//   constructor(
//     private fb: UntypedFormBuilder,
//     private configService: ConfigService) { }
//
//   ngOnInit(): void
//   {
//     this.initAccountForm();
//
//     this.fetchLookUps();
//   }
//
//   initNewUser()
//   {
//     this.settingForm.reset();
//
//     this.settingForm.patchValue({});
//     this.formView.resetToCreateView();
//   }
//
//   async fetchLookUps()
//   {
//     const response = await this.configService.getConfigGeneralList({});
//     this.settingsList = response.data;
//     CompanyConfig.saveCompanyConfig(response.data);
//   }
//
//   async saveConfig()
//   {
//     const user = this.settingForm.value;
//     if(!ObjectUtil.hasValue(user.isEmployee))
//     {
//       user.isEmployee = false;
//     }
//     if(!ObjectUtil.hasValue(user.agent))
//     {
//       user.agent = false;
//     }
//     if(this.selectedConfig?.dataType == 'BOOLEAN')
//     {
//       user.settingValue = user.booleanValue;
//     }
//     //console.log("config settings to save = ",user);
//     const result = await this.configService.saveConfig(user);
//     if(result.success)
//     {
//       this.formView.resetToListView();
//       // CollectionUtil.add(this.userAccountList, result.data);
//       CompanyConfig.saveCompanyConfig(this.settingsList);
//     }
//   }
//
//
//
//   async editSetting(config: any)
//   {
//     this.formView.resetToCreateView();
//
//     this.selectedConfig = config;
//
//     this.settingForm.patchValue(this.selectedConfig);
//
//   }
//
//
//
//
//   initAccountForm()
//   {
//     this.settingForm = this.fb.group({
//       id: null,
//       settingValue: null,
//       booleanValue: false
//     });
//   }
//
//
// }
