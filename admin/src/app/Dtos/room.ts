import { Facility } from './facility';

export interface Room {
  id: number;
  name: string;
  sleeps: number;
  number: number;
  price: number;
  facilities: Facility[];
  mainImageId?: number;
}
