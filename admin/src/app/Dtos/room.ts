import { Facility } from './facility';
import { Hotel } from './hotel';

export interface Room {
  id: number;
  name: string;
  sleeps: number;
  price: number;
  facilities: Facility[];
  mainImageId?: number;
}

export type RoomToReserve = Omit<Hotel, 'id'>;
