import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { Hotel } from 'src/app/Dtos/hotel';
import { HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel-for-admin',
  templateUrl: './hotel-for-admin.component.html',
  styleUrls: ['./hotel-for-admin.component.css']
})
export class HotelForAdminComponent implements OnInit {
  public hotelId: number;
  public changeHotelForm: FormGroup;
  public loading = false;

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder
  ) {
    this.hotelId = this.route.snapshot.paramMap.get('id') as unknown as number;
    this.changeHotelForm = this.formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)],
        country: ['', Validators.maxLength(hotelParamsMaxLenght.country)],
        city: ['', Validators.maxLength(hotelParamsMaxLenght.city)],
        address: ['', Validators.maxLength(hotelParamsMaxLenght.address)],
        description: ['', Validators.maxLength(hotelParamsMaxLenght.desciprion)]
      }
    );
  }

  public ngOnInit(): void {
    this.loading = true;
    this.fetchHotel();
  }

  public editHotel(): void {
    this.hotelService
      .editHotel(this.hotelId, this.changeHotelForm.value as Hotel)
      .subscribe();
  }

  public getMaxLengthValue(controlName: string): number {
    return this.changeHotelForm.get(controlName)?.errors?.maxlength.requiredLength;
  }

  private fetchHotel(): void {
    this.hotelService
      .getHotel(this.hotelId)
      .subscribe(hotel => {
        this.changeHotelForm.patchValue(hotel);
        this.loading = false;
      }
    );
  }
}