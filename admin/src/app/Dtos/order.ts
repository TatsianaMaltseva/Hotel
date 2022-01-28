import { OrderDateParams } from '../Core/order-date-params';
import { Facility } from './facility';
import { Hotel } from './hotel';
import { Room } from './room';

export interface Order {
    room: Room;
    hotel: Hotel;
    orderDateParams: OrderDateParams;
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
