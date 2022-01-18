export interface Room {
  id: number;
  name: string;
  sleeps: number;
  number: number;
  price: number;
  facilities?: string;
  mainImageId?: number;
}
