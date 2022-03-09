import { Account } from '../Dtos/account';

export interface AccountsResponse {
    accounts: Account[];
    accountCount: number;
}
