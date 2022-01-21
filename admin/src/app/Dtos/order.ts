import { OrderDateParams } from '../Core/order-date-params';
import { Room } from './room';

export interface Order {
    room: Room;
    orderDateParams: OrderDateParams;
    price?: number;
}
