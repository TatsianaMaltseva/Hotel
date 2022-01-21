import * as dayjs from 'dayjs';

export class OrderDateParams {
    public dateParams: object;

    public constructor(
        public checkInDate: string,
        public checkOutDate: string
    ) {
        this.dateParams = {
            checkInDate: dayjs(new Date(this.checkInDate)).format(),
            checkOutDate: dayjs(new Date(this.checkOutDate)).format()
        };  
    }
}
