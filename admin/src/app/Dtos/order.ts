import { Facility } from './facility';
import { Hotel } from './hotel';
import { Room } from './room';

export interface Order {
    room: Room;
    hotel: Hotel;
    checkInDate: string;
    checkOutDate: string;
    facilities: Facility[];
    price: number;
}

export interface OrderToAdd {
    hotelId: number;
    roomId: number;
    facilities: Facility[];
    checkInDate: string;
    checkOutDate: string;
}
