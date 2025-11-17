
import { createContext, useState, useContext, useMemo } from "react";
import {Expense, GroupData } from '../../types/types'

export interface AppContextType {
    expenses:Expense[];
    groupData:GroupData;
    balance:number;
    userBalance:number;
    addExpense: (amount: string, description: string, category: string) => void;
    deleteExpense: (id: number) => void;
    clearExpenses: () => void;
    checkExpense: (id: number) => void;
    updateGroupData: (data: Partial<GroupData>) => void;
    resetAll: () => void;
    settleBalance: () => void;  // Προσθήκη εδώ
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

    // Υπολογισμός balance με προστασία από division by zero - memoized για σωστό hot reload
    const balance = useMemo(() => {
        return groupData.activeUsers >= 2 
            ? groupData.totalGroupExpenses / groupData.activeUsers 
            : 0;
    }, [groupData.activeUsers, groupData.totalGroupExpenses]);

    const userBalance = useMemo(() => {
        return groupData.userExpenses - balance;
    }, [groupData.userExpenses, balance]);

    const addExpense = (
        amount: string,
        description:string,
        category:string,
    ) => {

         // Μετατρέψε το amount σε number
        const amountNumber = parseFloat(amount.replace(',', '.')) || 0;

        const newExpense: Expense = {
            id: Date.now(),
            amount:amount,
            description:description,
            category:category,
            userName:groupData.nicknameUser || groupData.userName || '',
            date: new Date()
        };

        setExpenses([newExpense, ...expenses]);

        // Ενημέρωση totalGroupExpenses και userExpenses
        setGroupData(prev => ({
            ...prev,
            totalGroupExpenses: prev.totalGroupExpenses + amountNumber,
            userExpenses: prev.userExpenses + amountNumber
        }));
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
            
            // Ενημέρωσε το groupData - προσθήκη userExpenses
            setGroupData(prev => ({
                ...prev,
                totalPaid: prev.totalPaid + amountNumber,
                totalGroupExpenses: prev.totalGroupExpenses + amountNumber,
                userExpenses: prev.userExpenses + amountNumber  // Ενημέρωση userExpenses
            }));
            
            // Διέγραψε το expense
            deleteExpense(id);
        }
    };

    const updateGroupData = (data: Partial<GroupData>) => {
        setGroupData(prev => ({ ...prev, ...data }));
    };

    // Προσθήκη resetAll function που τα καθαρίζει ΟΛΑ
    const resetAll = () => {
        setExpenses([]);  // Καθαρίζει τη λίστα expenses
        setGroupData({
            userName: '',
            nicknameUser: '',
            groupName: '',
            activeUsers: 10,
            totalGroupExpenses: 0.00,
            totalPaid: 0.00,
            userExpenses: 0.00
            // Το balance και userBalance θα γίνουν 0 αυτόματα γιατί totalGroupExpenses = 0
        });
    };

    // Function για settle balance - μεταφέρει userExpenses στο totalPaid και μηδενίζει όλα
    const settleBalance = () => {
        const currentUserExpenses = groupData.userExpenses;
        
        setGroupData(prev => ({
            ...prev,
            totalPaid: prev.totalPaid + currentUserExpenses,  // Προσθήκη στο totalPaid
            totalGroupExpenses: 0.00,  // Μηδενισμός
            userExpenses: 0.00  // Μηδενισμός
        }));
        
        setExpenses([]);  // Καθαρισμός όλων των expenses
    };

    const value: AppContextType = {
        expenses,
        groupData,
        balance,
        userBalance,
        addExpense,
        deleteExpense,
        clearExpenses,
        checkExpense,
        updateGroupData,
        resetAll,
        settleBalance
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

