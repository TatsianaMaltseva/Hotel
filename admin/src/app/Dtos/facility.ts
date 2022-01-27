export interface Facility {
    id: number;
    name: string;
    realm: realm;
    price: number;
    checked: boolean;
}

export enum realm  {
    hotel = 'Hotel',
    room = 'Room'
}
