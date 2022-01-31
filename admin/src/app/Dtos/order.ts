import { Facility } from './facility';
import { Hotel } from './hotel';
import { Room } from './room';

export interface Order {
    room: Room;
    hotel: Hotel;
    checkInDate: string;
    checkOutDate: string;
    price: number;
}

export interface OrderToShow {
    hotel: Hotel;
    room: Room;
    price: number;
    facilities: Facility[];
    checkInDate: string;
    checkOutDate: string;
}
