
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