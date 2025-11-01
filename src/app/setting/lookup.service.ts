import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { findWhere } from "underscore";
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import {StaticDataService} from "../static-data.service";

;

@Injectable({
  providedIn: 'root'
})
export class LookupService {
http: HttpClient = inject(HttpClient);

  constructor() { }

  fetch(storeName: string) {
    const lookUp = this.getModel(storeName)
    return this.http.get<ApiResponse<any>>(`${environment.baseUrl}/${lookUp.api || lookUp.name}`);
  }

  fetchEnum(name: string) {
    return this.http.get<ApiResponse<any>>(`${environment.baseUrl}/enums/getlist?name=${name}`).toPromise();
  }

  fetchNow(storeName: string) {
    // let lookUp = this.getModel(storeName)
    // return this.http.get<ApiResponse<any>>(`${environment.baseApi}/${lookUp.api || lookUp.name}`).toPromise();
    return this.http.get<ApiResponse<any>>(`${environment.baseUrl}/${storeName}`).toPromise();
  }

  save(name: string, record: any) {
    // const data = WebUtils.refactorObj(record);
    const data = record;

    const lookUpModel = this.getModel(name);
    const path = lookUpModel.api || lookUpModel.name;

    if (record.id) {
      return this.http.put<ApiResponse<any>>(`${environment.baseUrl}/${path}`, data).toPromise();
    }
    else {
      return this.http.post<ApiResponse<any>>(`${environment.baseUrl}/${path}`, data).toPromise();
    }
  }

  delete(name: string, id: number) {
    const lookUpModel = this.getModel(name);
    const path = lookUpModel.api || lookUpModel.name;

    return this.http.delete<ApiResponse<any>>(`${environment.baseUrl}/${path}/${id}`).toPromise();
  }

  private getModel(name: string) {
    return findWhere(LookUps.allLookups, { name })
  }

}

export interface Enum {
  label: string
  value: string
}

export class LookUpModel {
  name: string
  label: string
  description?: string
  route: string
  store?: string
  api: string
  privilege?: string
  hidden: boolean
  fields?: LookUpField[]
  ignoreDefault?: boolean
}

export class LookUpField {
  name: string
  label: string
  type: string
  required?: boolean
  bindLabel?: string
  displayField?: string
  selectDisplayField?: string
  enum?: boolean
  readonly?: boolean
  source?: any
  store?: any
  max?: number
  min?: number
  maxlength?: number
  minlength?: number
  filter?: any

}

export class InputType {
  static get Text() { return "text" }
  static get Date() { return "date" }
  static get DateRange() { return "dateRange" }
  static get Number() { return "number" }
  static get Select() { return "select" }
  static get Search() { return "search" }
  static get Boolean() { return "boolean" }
  static get TextArea() { return "textarea" }
  static get Radio() { return "radio" }
}

export class AppRouteNames {
    public static Settings = "settings";
    public static GenericSettings = ":model";

    public static getModuleSettingRoute(url)
    {
        // if (url.includes(AppRouteNames.AccountSettings) || url.includes(AppRouteNames.AccountSettings_user)) {
        //     return AppRouteNames.AccountSettings;
        // }

        return AppRouteNames.Settings;
    }
}

export class LookUpStores {

    public static Programmes = "data/programmes";

}

export class LookUps
{

    static get ems(): Array<LookUpModel> {
        return [
            {
                label: "Programmes", name: "programmes",
                api: "school-programmes", route: "programmes", hidden: false,
                fields: [
                    { label: "Programme Name", name: "programmeName", type: InputType.Text }
                ]
            },
            {
                label: "Classes", name: "classes",
                api: "school-classes", route: "classes", hidden: false,
                fields: [
                    { label: "Class Name", name: "className", type: InputType.Text },
                    { label: "Education Level", name: "educationalLevel", type: InputType.Select ,displayField:"educationalLevelName", store: StaticDataService.educationLevels(), required: true },
                    { label: "Programme", name: "programmeId", type: InputType.Select , displayField:"programmeName", store: LookUpStores.Programmes, required: true },
                    { label: "View Order", name: "viewOrder", type: InputType.Text },
                    { label: "Active Status", name: "activeStatus", type: InputType.Boolean },
                ]
            },


        ]
    };



  static get allLookups(): Array<LookUpModel> {

    const all:LookUpModel[] = [];
    LookUps.ems.forEach(element => {all.push(element)});
    // LookUps.inventory.forEach(element => {all.push(element)});
    // LookUps.hr.forEach(element => {all.push(element)});
    // LookUps.crm.forEach(element => {all.push(element)});
    // LookUps.payroll.forEach(element => {all.push(element)});

    return all;
  };
}


// { label: "Related Entities", name: LookUpStores.RelatedEntities, store: LookUpStores.RelatedEntities, api: "crm/data/" + LookUpStores.RelatedEntities, route: AppRouteNames.GenericSettings, hidden: true },
      // { label: "Users", name: "user", store: LookUpStores.Users, route: AppRouteNames.GenericSettings, hidden: true },
      // { label: "OpenClose", name: LookUpStores.CloseOpen, store: LookUpStores.Users, route: AppRouteNames.GenericSettings, hidden: true },
