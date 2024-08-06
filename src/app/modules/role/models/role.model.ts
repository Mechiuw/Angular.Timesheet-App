import { User } from "../../user/models/user.model";

export interface Role{
    id?: string;
    roleName: string;
    accounts: User[];
}