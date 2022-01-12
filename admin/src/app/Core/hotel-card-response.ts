import { HotelCard } from '../Dtos/hotelCard';

export interface HotelCardResponse {
    hotelCards: HotelCard[];  
    hotelCount: number;
}