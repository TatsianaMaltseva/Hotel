export interface Facility {
    id: number;
    name: string;
    realm: Realm;
    price: number;
    checked: boolean;
}

export enum Realm {
    hotel = 'Hotel',
    room = 'Room'
}
