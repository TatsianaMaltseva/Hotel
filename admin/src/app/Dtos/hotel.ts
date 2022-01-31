import { Facility } from './facility';

export interface Hotel {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  description?: string;
  mainImageId?: number;
  facilities: Facility[];
  checkInTime: string;
  checkOutTime: string;
}

export type HotelToEdit = Omit<Hotel, 'id'>;

export type HotelToAdd = Omit<Hotel, 'id' | 'mainImageId' | 'facilities'>;
