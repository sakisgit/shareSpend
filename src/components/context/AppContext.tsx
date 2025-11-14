
import { createContext, useState, useContext } from "react";
import {Expense, GroupData } from '../../types/types'

export interface AppContextType {
    expenses:Expense[];
    groupData:GroupData;
    addExpense: (amount: string, description: string, category: string) => void;
    deleteExpense: (id: number) => void;
    clearExpenses: () => void;
    checkExpense: (id: number) => void;
    updateGroupData: (data: Partial<GroupData>) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {
    const [expenses, setExpenses]=useState<Expense[]>([]);

    const [groupData, setGroupData] = useState<GroupData>({
        userName: '',
        nicknameUser: '',
        groupName: '',
        activeUsers: 10,
        totalGroupExpenses: 0.00,
        totalPaid: 0.00,
        userExpenses: 0.00
    });

    const addExpense = (
        amount: string,
        description:string,
        category:string,
    ) => {
        const newExpense: Expense = {
            id: Date.now(),
            amount:amount,
            description:description,
            category:category,
            userName:groupData.nicknameUser || groupData.userName || '',
            date: new Date()
        };

        setExpenses([newExpense, ...expenses]);
    };

    const deleteExpense = (id: number) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const clearExpenses = () => {
        setExpenses([]);
    };

    const checkExpense = (id: number) => {
        // Βρες το expense
        const expense = expenses.find(exp => exp.id === id);
        
        if (expense) {
            // Μετατρέψε το amount σε number
            const amountNumber = parseFloat(expense.amount);
            
            // Ενημέρωσε το groupData
            setGroupData(prev => ({
            ...prev,
            totalPaid: prev.totalPaid + amountNumber,
            totalGroupExpenses: prev.totalGroupExpenses + amountNumber  // Προσθήκη στο totalExpenses επίσης
            }));
            
            // Διέγραψε το expense
            deleteExpense(id);
        }
    };

    const updateGroupData = (data: Partial<GroupData>) => {
        setGroupData(prev => ({ ...prev, ...data }));
    };

    const value: AppContextType = {
        expenses,
        groupData,
        addExpense,
        deleteExpense,
        clearExpenses,
        checkExpense,
        updateGroupData
    };

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error ('useAppContext must be used within AppContextProvider');
    };

    return context;
};

