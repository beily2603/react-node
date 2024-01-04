
export enum Role {
    User = 'user',
    Admin = 'admin'
}

export class User {
    id: number;
    name: string;
    password: string;
    role: Role;
}

    // constructor(id: number, name: string, password: string, role: Role) {
    //     this.id = id;
    //     this.name = name;
    //     this.password = password;
    //     this.role = role;
    // }
