import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { Facility } from 'src/app/Dtos/facility';
import { FacilityService } from '../facility.service';

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
        name: [''],
        checked: [false]
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
    if (this.hotelId === undefined) {
      return;
    }
    this.facilityService
      .getFacilitiesFull(this.hotelId, this.roomId)
      .subscribe(
        (facilities) => {
          facilities.forEach(facility => this.addFacilityToForm(facility));
        }
      );
  }

  public changeFacilityStatus(event: MatCheckboxChange, facility: Facility): void {
    if (this.hotelId === undefined) {
      return;
    }

    if (event.checked) {
      this.facilityService
        .setFacility(this.hotelId, facility.id, this.roomId)
        .subscribe();
    } else {
      this.facilityService
        .deleteFacilityForHotel(this.hotelId, facility.id)
        .subscribe();
    }
  }

  private addFacilityToForm(facility: Facility): void {
    const facilityForm = this.emptyFacilityForm;
    facilityForm.patchValue(facility);
    this.facilities.push(facilityForm);
  }
}
