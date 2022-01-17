export interface Facility {
    id: number;
    name: string;
    realm: 'hotel' | 'room';
    price?: number;
}
