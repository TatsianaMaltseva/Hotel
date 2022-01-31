import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { facilityParamsMaxLength } from 'src/app/Core/validation-params';
import { Facility, Realm } from 'src/app/Dtos/facility';
import { FacilityService } from '../../facility.service';

@Component({
  selector: 'app-add-facilities',
  templateUrl: './add-facilities.component.html',
  styleUrls: ['./add-facilities.component.css']
})
export class AddFacilitiesComponent implements OnInit {
  public facilitiesForm: FormGroup; 
  public serverErrorResponse: string = '';
  public readonly realmOptions = [ Realm.hotel, Realm.room ];

  public get facilities(): FormArray {
    return this.facilitiesForm.get('facilities') as FormArray;
  }

  private get emptyFacilityForm(): FormGroup {
    const facilityGroup =  this.formBuilder.group(
      {
        id: [],
        name: [
          '', 
          [
            Validators.required,
            Validators.maxLength(facilityParamsMaxLength.name)
          ]
        ],
        realm: ['', [Validators.required]]
      }
    );
    return facilityGroup;
  }

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly facilityService: FacilityService
  ) {
    this.facilitiesForm = this.formBuilder.group(
      {
        facilities: this.formBuilder.array([])
      }
    );
  }

  public ngOnInit(): void {
    this.facilityService
      .getFacilities()
      .subscribe(
        (facilities) => {
          facilities.forEach(facility => this.addFacilityToForm(facility));
        }
      );
  }

  public facilityExistsInDatabase(facility: Facility): boolean {
    return !!facility.id;
  }

  public addEmptyFacilityCard(): void {
    const facilityForm = this.emptyFacilityForm;
    this.facilities.push(facilityForm);
  }

  public deleteFacility(index: number, facility: Facility): void {
    this.facilityService
      .deleteFacility(facility.id)
      .subscribe(
        () => {
          this.facilities.removeAt(index);
        }
      );
  }

  public deleteEmptyFacilityCard(index: number): void {
    this.facilities.removeAt(index);
  }

  public addFacility(facility: Facility): void {
    this.facilityService
      .addFacility(facility)
      .subscribe(
        (id) => {
          facility.id = id;
          this.serverErrorResponse = '';
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }

  public editFacility(facility: Facility): void {
    this.facilityService
      .editFacility(facility.id, facility)
      .subscribe();
  }

  private addFacilityToForm(facility: Facility): void {
    const facilityForm = this.emptyFacilityForm;
    facilityForm.patchValue(facility);
    this.facilities.push(facilityForm);
  }
}
