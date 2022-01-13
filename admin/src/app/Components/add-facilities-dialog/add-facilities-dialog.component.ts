import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacilityToAdd } from 'src/app/Dtos/facility-to-add';

@Component({
  selector: 'app-add-facilities-dialog',
  templateUrl: './add-facilities-dialog.component.html',
  styleUrls: ['./add-facilities-dialog.component.css']
})
export class AddFacilitiesDialogComponent implements OnInit {
  public facitiesForm: FormGroup; 

  public get facilities(): FormArray {
    return this.facitiesForm.get('facilities') as FormArray;
  }
  private get emptyFacilityForm(): FormGroup {
    const facilityGroup =  this.formBuilder.group(
      {
        name: ['', Validators.required]
      }
    );
    return facilityGroup;
  }
  public constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.facitiesForm = this.formBuilder.group(
      {
        facilities: this.formBuilder.array([])
      }
    );
  }

  public ngOnInit(): void {

  }

  public addFacility(facility: FacilityToAdd): void {
    
  }

  private addFacilityToForm(facility: FacilityToAdd): void {
    const facilityForm = this.emptyFacilityForm;
    facilityForm.patchValue(facility);
    this.facilities.push(facilityForm);
  }
}
