import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { findWhere, where } from "underscore";
import { CoreModule } from "../../../core/core.module";
import {AppRouteNames, InputType, LookUpField, LookUpModel, LookUps, LookupService} from '../lookup.service';
import {MessageBox} from "../../../message-helper";

@Component({
    selector: 'app-generic-lookup',
    templateUrl: './generic-lookup.component.html',
    styleUrls: ['./generic-lookup.component.scss'],
  imports: [CoreModule],
    standalone: true
})
export class GenericLookupComponent implements OnInit {

  showForm: boolean
  lookupForm: UntypedFormGroup
  lookup: LookUpModel
  records: any[]


  constructor(private fb: UntypedFormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService) { }

  async ngOnInit()
  {
    this.setUpForm();
      const modelName = this.activatedRoute.snapshot.paramMap.get('model');

    this.lookup = findWhere(LookUps.allLookups, { name: modelName })

    if(!this.lookup)
    {
      let settingRoute = AppRouteNames.getModuleSettingRoute(this.router.url);
      this.router.navigate([ settingRoute]);
    }


    this.lookup.fields?.forEach((f) => this.lookupForm.addControl(f.name, this.fb.control('')));
    this.fetchRecords()
    await this.fetchLookUps(this.lookup);
  }

  openForm(record?: any) {
    this.lookupForm.reset()
    this.showForm = true;
    if (record != null) this.lookupForm.patchValue(record)
  }

  closeForm() { this.showForm = false }

  async save(lookup: any) {
    try {
      // this.loading.start(LoadingMessages.Saving);
      let success = await this.lookupService.save(this.lookup.name, lookup);
      if (success) {
        this.closeForm()
        this.fetchRecords()
      }
    } catch (err) { } finally {
      //  this.loading.stop();
    }
  }

  async delete(role: any) {
    try {
      const confirm = await MessageBox.confirm("Delete Record", `Are you sure you want to delete ${role.name} ?`)
      if (!confirm.value) return
      // this.loading.start(LoadingMessages.Deleting)
        const success = await this.lookupService.delete(this.lookup.name, role.id)
      if (success) {
        this.closeForm()
        this.fetchRecords()
      }
    } catch (err) { } finally {
      // this.loading.stop();
    }
  }

  async fetchRecords() {
    try {
      // this.loading.start();
      const result = await this.lookupService.fetchNow(this.lookup.api);
      if(result.success)
      {
        this.records = result.data;
      }
    } catch (error) { } finally {
      //  this.loading.stop();
      }
  }

  private async fetchLookUps(lookupModel: LookUpModel) {
    if (!(lookupModel && lookupModel.fields)) return;
      const selectFields: LookUpField[] = where(lookupModel.fields, { type: InputType.Select });
    //console.log(selectFields);
    selectFields.forEach(async (field) => {


      if(field.store instanceof Object)
      {
        field.source = field.store;
      }
      else {
          const response = (field.enum)
          ? await this.lookupService.fetchEnum(field.store)
          : await this.lookupService.fetchNow(field.store);

        field.source = (field.filter) ? where(response.data, field.filter) : response.data;
      }

    })
  }

  private setUpForm() {
    this.lookupForm = this.fb.group({
      id: '',
      code: '',
      name: '',
      notes: ''
    })
  }

}
// function where(fields: LookUpField[], arg1: { type: string; }): LookUpField[] {
//   throw new Error('Function not implemented.');
// }

