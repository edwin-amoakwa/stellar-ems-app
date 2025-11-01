import { NgForOf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { findWhere, where } from "underscore";
import { LookUpModel, LookUps } from './lookup.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  imports: [
    RouterOutlet,
    NgForOf
  ],
  standalone: true
})
export class SettingComponent implements OnInit {

  selectedModelId: any
  models: LookUpModel[];
  settingRoute:string;

  constructor(private router: Router )
    {

    }

  ngOnInit()
  {
      this.settingRoute = "settings";
      this.models = where(LookUps.ems, { hidden: false })

    //console.log("===AM HERE IN SETTINGS");
    // this.settingRoute = AppRouteNames.getModuleSettingRoute(this.router.url);
    //console.log("this.settingRoute  == ",this.settingRoute );
    // if(this.settingRoute == AppRouteNames.AccountSettings)
    // {
    //   this.models = where(LookUps.accounting, { hidden: false })
    // }
    // else if(this.settingRoute == AppRouteNames.HrSettings)
    // {
    //   this.models = where(LookUps.hr, { hidden: false })
    // }
    // else if(this.settingRoute == AppRouteNames.InventorySettings)
    // {
    //   this.models = where(LookUps.inventory, { hidden: false })
    // }
    // else if(this.settingRoute == AppRouteNames.CrmSettings)
    // {
    //   this.models = where(LookUps.crm, { hidden: false })
    // }
    // else if(this.settingRoute == AppRouteNames.PayrollSettings)
    // {
    //   this.models = where(LookUps.payroll, { hidden: false })
    // }

    //console.log("module " + this.settingRoute,this.models);

  }

  selectedModel:any;

  openLookUp(name: string) {
    // this.router.navigate([`${this.settingRoute}`])
    // this.settingRoute = "settings"
    this.router.navigate([`${this.settingRoute}`])
    setTimeout(() => {
      if (name)
      {
          console.log(this.settingRoute,name,this.models)
        this.selectedModel = findWhere(this.models, { name });
console.log(name,this.selectedModel);
//           this.router.navigate([this.settingRoute, name])

        // if (this.selectedModel.route == AppRouteNames.GenericSettings)
        // {
        //   this.router.navigate([this.settingRoute, name])
        // }
        // else
        // {
          this.router.navigate([`${this.settingRoute}/${this.selectedModel.route}`])
        // }
      }
    }, 10);
  }


}
