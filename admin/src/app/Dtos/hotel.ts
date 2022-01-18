export interface Hotel {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  description?: string;
  mainImageId?: number;
}

export type HotelToEdit = Omit<Hotel, 'id'>;
