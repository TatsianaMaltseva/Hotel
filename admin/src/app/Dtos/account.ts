export interface Account {
    id: number;
    email: string;
    role: string;
}

export interface AccountToEdit {
    email: string;
    role: string;
    password: string;
}
