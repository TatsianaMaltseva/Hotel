import * as dayjs from 'dayjs';

export class OrderDateParams {
    public get dateParams(): object {
        return {
            checkInDate: dayjs(new Date(this.checkInDate)).format(),
            checkOutDate: dayjs(new Date(this.checkOutDate)).format()
        };  
    }

    public get dateParamsFormatted(): object {
        const format = 'YYYY-MM-DD';
        return {
            checkInDate: dayjs(new Date(this.checkInDate)).format(format),
            checkOutDate: dayjs(new Date(this.checkOutDate)).format(format)
        }; 
    }

    public constructor(
        private readonly checkInDate: string,
        private readonly checkOutDate: string
    ) {
    }
}
