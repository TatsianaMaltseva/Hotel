import { OrderDateParams } from '../Core/order-date-params';
import { Facility } from './facility';
import { Room } from './room';

export interface Order {
    room: Room;
    orderDateParams: OrderDateParams;
    price?: number;
}

export interface OrderToShow {
    hotelName: string;
    country: string;
    city: string;
    address: string;
    roomName: string;
    sleeps: number;
    price: number;
    facilities: Facility[];
    checkInDate: string;
    checkOutDate: string; // as OderDateParams
}
