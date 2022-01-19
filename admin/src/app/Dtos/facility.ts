export interface Facility {
    id: number;
    name: string;
    realm: string;
    price: number;
    checked: boolean;
}

export const realm = {
    hotel: 'hotel',
    room: 'room'
};
