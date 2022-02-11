import { Facility } from '../Dtos/facility';
import { Hotel } from '../Dtos/hotel';
import { Room } from '../Dtos/room';

export interface FacilititesDialogData {
    hotel: Hotel;
    room?: Room;
    facilities: Facility[];
}
