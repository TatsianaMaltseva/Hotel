import { Component, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { Facility } from 'src/app/Dtos/facility';
import { Hotel } from 'src/app/Dtos/hotel';
import { Room } from 'src/app/Dtos/room';
import { FacilityService } from '../../facility.service';

@Component({
  selector: 'app-choose-facilities-for-admin',
  templateUrl: './choose-facilities-for-admin.component.html',
  styleUrls: ['./choose-facilities-for-admin.component.css']
})
export class ChooseFacilitiesForAdminComponent {
  public hotel?: Hotel;
  public room?: Room;
  public facilitiesForm: FormGroup;
  public seeOtherClicked = false;

  public get facilities(): FormArray {
    return this.facilitiesForm.get('facilities') as FormArray;
  }

  private get emptyFacilityForm(): FormGroup {
    const facilityGroup = this.formBuilder.group(
      {
        id: [],
        name: [],
        checked: [],
        price: [null, [Validators.required]]
      }
    );
    return facilityGroup;
  }

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: FacilititesDialogData,
    private readonly facilityService: FacilityService,
    private readonly formBuilder: FormBuilder,
    private readonly matDialogRef: MatDialogRef<ChooseFacilitiesForAdminComponent>
  ) {
    this.hotel = data.hotel;
    this.room = data.room;
    this.facilitiesForm = this.formBuilder.group(
      {
        facilities: this.formBuilder.array([])
      }
    );

    if (this.data.facilities) {
      this.data.facilities
        .forEach(facility => facility.checked = true);
      this.data.facilities
        .forEach(facility => this.addFacilityToForm(facility));
    }
  }

  public changeFacilitiesStatus(): void {
    if (!this.hotel) {
      return;
    }

    const checkedFacilitites = (this.facilities.value as Facility[])
      .filter(facility => facility.checked);

    this.facilityService
      .changeFacilities(this.hotel.id, checkedFacilitites, this.room?.id)
      .subscribe(
        () => {
          if (this.room) {
            this.room.facilities = checkedFacilitites;
          } else if (this.hotel) {
            this.hotel.facilities = checkedFacilitites;
          }
          this.matDialogRef.close();
        }
      );
  }

  public fetchAvilableFacilities(): void {
    this.seeOtherClicked = true;
    if (!this.hotel) {
      return;
    }
    this.facilityService
      .getCheckedFacilities(this.hotel.id, this.room?.id)
      .subscribe(
        (facilities) => {
          facilities.forEach(newFacility => {
            if((this.facilities.value as Facility[])
                .every(hotelFacility => hotelFacility.id !== newFacility.id)) {
              this.addFacilityToForm(newFacility);
            }
          });
        }
      );
  }

  private addFacilityToForm(facility: Facility): void {
    const facilityForm = this.emptyFacilityForm;
    facilityForm.patchValue(facility);
    this.facilities.push(facilityForm);
  }
}
