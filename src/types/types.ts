
export interface GroupData {
    userName:string,
    nicknameUser:string,
    groupName:string,
    activeUsers:number,
    totalGroupExpenses:number,
    totalPaid:number,
    userExpenses:number,
};

// Group-specific data (without userName and nicknameUser which are global)
export interface GroupSpecificData {
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
    groupId?: string; // Optional group ID
};

export interface Group {
    id: string;
    name: string;
    members: number;
    isActive?: boolean;
    groupPassword?: string; // Group password/code
    groupNumber?: string | number; // Group number
    createdAt?: Date;
    createdBy?: string; 
};