import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from 'src/app/account.service';
import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { Hotel, HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{
  public hotelId: number = 0;
  public hotel: Hotel = {
    id: 0,
    name: '',
    country: '',
    city: '',
    address: '',
    description: null,
    mainImage: null,
    images:  null
  };
  public changeHotelForm: FormGroup;
  
  public get isAdmin(): boolean {
    return this.accountService.isAdmin();
  }

  public get isClient(): boolean {
    return this.accountService.isClient();
  }

  public get newName(): AbstractControl | null {
    return this.changeHotelForm.get('newName');
  }

  public get newCountry(): AbstractControl | null {
    return this.changeHotelForm.get('newCountry');
  }

  public get newCity(): AbstractControl | null {
    return this.changeHotelForm.get('newCity');
  }

  public get newAddress(): AbstractControl | null {
    return this.changeHotelForm.get('newAddress');
  }

  public get newDescription(): AbstractControl | null {
    return this.changeHotelForm.get('newDescription');
  }

  public constructor(
    private readonly hotelService: HotelService,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder
  ) { 
    this.setHotelId();
    this.changeHotelForm = this.formBuilder.group(
      {
        newName: ['', Validators.maxLength(hotelParamsMaxLenght.name)],
        newCountry: ['', Validators.maxLength(hotelParamsMaxLenght.country)],
        newCity: ['', Validators.maxLength(hotelParamsMaxLenght.city)],
        newAddress: ['', Validators.maxLength(hotelParamsMaxLenght.address)],
        newDescription: ['', Validators.maxLength(hotelParamsMaxLenght.desciprion)]
      }
    );
  }

  public ngOnInit(): void {
    this.fetchHotel();
  }

  public editHotel(): void {
    if (this.newName?.touched) this.hotel.name = this.newName?.value;
    if (this.newCountry?.touched) this.hotel.country = this.newCountry?.value;
    this.hotelService
      .editHotel(this.hotelId, this.hotel)
      .subscribe();
  }

  private setHotelId(): void {
    this.route.params.subscribe(params => this.hotelId = params['id']);
  }

  private fetchHotel(): void {
    this.hotelService
      .getHotel(this.hotelId)
      .subscribe(hotel => this.hotel = hotel);
  }
}