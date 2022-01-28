import { Hotel } from './hotel';
import { Room } from './room';

export interface OrderDetails{
    room: Room;
    hotel: Hotel;
}
