import { Role } from './roles';

export interface AccountFilterParams {
    id: number;
    email: string;
    role: Role;
}
