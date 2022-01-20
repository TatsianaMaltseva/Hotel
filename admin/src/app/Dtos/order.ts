import { Room } from './room';

export interface Order {
    room: Room;
    price?: number;
}
