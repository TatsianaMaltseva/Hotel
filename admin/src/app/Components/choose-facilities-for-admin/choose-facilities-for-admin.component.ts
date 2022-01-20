import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { Facility } from 'src/app/Dtos/facility';
import { FacilityService } from '../../facility.service';

@Component({
  selector: 'app-choose-facilities-for-admin',
  templateUrl: './choose-facilities-for-admin.component.html',
  styleUrls: ['./choose-facilities-for-admin.component.css']
})
export class ChooseFacilitiesForAdminComponent implements OnInit {
  public hotelId?: number;
  public roomId?: number;
  public facilitiesForm: FormGroup; 

  public get facilities(): FormArray {
    return this.facilitiesForm.get('facilities') as FormArray;
  }

  private get emptyFacilityForm(): FormGroup {
    const facilityGroup =  this.formBuilder.group(
      {
        id: [],
        name: [],
        checked: [],
        price: []
      }
    );
    return facilityGroup;
  }

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: FacilititesDialogData,
    private readonly facilityService: FacilityService,
    private readonly formBuilder: FormBuilder
  ) { 
    this.hotelId = data.hotelId;
    this.roomId = data.roomId;
    this.facilitiesForm = this.formBuilder.group(
      {
        facilities: this.formBuilder.array([])
      }
    );
  }

  public ngOnInit(): void {
    if (!this.hotelId) {
      return;
    }
    this.facilityService
      .getCheckedFacilities(this.hotelId, this.roomId)
      .subscribe(
        (facilities) => {
          facilities.forEach(facility => this.addFacilityToForm(facility));
        }
      );
  }

  public changeFacilitiesStatus(): void {
    if (!this.hotelId) {
      return;
    }

    const checkedFacilitites = (this.facilities.value as Facility[])
      .filter(facility => facility.checked);
    this.facilityService
      .changeHotelFacilities(this.hotelId, checkedFacilitites, this.roomId)
      .subscribe();
  }

  private addFacilityToForm(facility: Facility): void {
    const facilityForm = this.emptyFacilityForm;
    facilityForm.patchValue(facility);
    this.facilities.push(facilityForm);
  }
}