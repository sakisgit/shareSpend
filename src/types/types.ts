
export interface GroupData {
    userName:string,
    nicknameUser:string,
    groupName:string,
    activeUsers:number,
    totalGroupExpenses:number,
    totalPaid:number,
    userExpenses:number,
};

export interface Expense {
    id:number,
    amount:string,
    description:string,
    category:string,
    userName:string,
    date:Date,
};

export interface Group {
    id: string;
    name: string;
    members: number;
    isActive?: boolean;
    groupPassword?: string; // Group password/code
    createdAt?: Date;
    createdBy?: string; 
};