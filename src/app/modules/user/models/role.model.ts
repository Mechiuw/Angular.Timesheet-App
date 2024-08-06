import { User } from "./user.model";

export interface Role{
    id?: string;
    roleName: string;
    accounts: User[];
}