
import { 
    createContext, 
    useState, 
    useContext, 
    useMemo, 
    useEffect 
} from "react";
import {Expense, GroupData } from '../../types/types'
import { 
    fetchGroupData,
    upsertGroupData,
    fetchExpenses,
    addExpenseToDB,
    deleteExpenseFromDB,
    clearAllExpensesFromDB,
} from "../../services/supabaseService";

export interface AppContextType {
    expenses:Expense[];
    groupData:GroupData;
    balance:number;
    userBalance:number;
    addExpense: (amount: string, description: string, category: string) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
    clearExpenses: () => Promise<void>;
    checkExpense: (id: number) => Promise<void>;
    updateGroupData: (data: Partial<GroupData>) => void;
    resetAll: () => Promise<void>;
    settleBalance: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {

    const [loading, setLoading]= useState(true);

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

    // ========== LOAD DATA ON MOUNT ==========
    useEffect(() => {
        const loadData= async () => {
            setLoading(true);
            try{
                const loadedGroupData = await fetchGroupData();
                if(loadedGroupData) {
                    setGroupData(loadedGroupData);
                };

                const loadedExpenses= await fetchExpenses();
                setExpenses(loadedExpenses);

            } catch (error) {
                console.error('error loading data:', error);

            } finally {
                setLoading(false);
            };
        };
        
        loadData();

    },[]);

    // ========== AUTO-SAVE GROUP DATA ==========
    // Αποθήκευση στο Supabase κάθε φορά που αλλάζει το groupData
    useEffect(() => { 
        if (!loading && groupData.userName) {
            const saveGroupData = async () => {
                await upsertGroupData(groupData);
            };
            
            // Debounce για να μην κάνει πολλά requests
            const timeoutId = setTimeout(saveGroupData, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [groupData, loading]);

    const addExpense = async (
        amount: string,
        description: string,
        category: string,
    ) => {
        const amountNumber = parseFloat(amount.replace(',', '.')) || 0;

        const newExpense: Expense = {
            id: Date.now(), // Temporary ID
            amount: amount,
            description: description,
            category: category,
            userName: groupData.nicknameUser || groupData.userName || '',
            date: new Date()
        };

        // Προσθήκη στο local state (optimistic update)
        setExpenses(prev => [newExpense, ...prev]);

        // Ενημέρωση groupData
        setGroupData(prev => ({
            ...prev,
            totalGroupExpenses: prev.totalGroupExpenses + amountNumber,
            userExpenses: prev.userExpenses + amountNumber
        }));

        // Αποθήκευση στο Supabase
        try {
            const dbId = await addExpenseToDB(newExpense);
            if (dbId) {
                // Ενημέρωσε το ID με το πραγματικό ID από τη βάση
                setExpenses(prev => 
                    prev.map(exp => 
                        exp.id === newExpense.id ? { ...exp, id: dbId } : exp
                    )
                );
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            // Rollback αν αποτύχει
            setExpenses(prev => prev.filter(exp => exp.id !== newExpense.id));
            setGroupData(prev => ({
                ...prev,
                totalGroupExpenses: prev.totalGroupExpenses - amountNumber,
                userExpenses: prev.userExpenses - amountNumber
            }));
        }
    };

    const deleteExpense = async (id: number) => {
        const expense = expenses.find(exp => exp.id === id);
        if (!expense) return;

        const amountNumber = parseFloat(expense.amount.replace(',', '.')) || 0;

        // Optimistic update
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        setGroupData(prev => ({
            ...prev,
            totalGroupExpenses: Math.max(0, prev.totalGroupExpenses - amountNumber),
            userExpenses: Math.max(0, prev.userExpenses - amountNumber)
        }));

        // Delete από Supabase
        try {
            await deleteExpenseFromDB(id);
        } catch (error) {
            console.error('Error deleting expense:', error);
            // Rollback
            setExpenses(prev => [...prev, expense]);
            setGroupData(prev => ({
                ...prev,
                totalGroupExpenses: prev.totalGroupExpenses + amountNumber,
                userExpenses: prev.userExpenses + amountNumber
            }));
        }
    };

    const clearExpenses = async () => {
        // Optimistic update
        setExpenses([]);
        setGroupData(prev => ({
            ...prev,
            totalGroupExpenses: 0.00,
            userExpenses: 0.00
        }));

        // Clear από Supabase
        try {
            await clearAllExpensesFromDB();
        } catch (error) {
            console.error('Error clearing expenses:', error);
        }
    };

    const checkExpense = async (id: number) => {
        const expense = expenses.find(exp => exp.id === id);
        if (!expense) return;

        const amountNumber = parseFloat(expense.amount.replace(',', '.')) || 0;

        // Update groupData
        setGroupData(prev => ({
            ...prev,
            totalPaid: prev.totalPaid + amountNumber,
            totalGroupExpenses: prev.totalGroupExpenses + amountNumber,
            userExpenses: prev.userExpenses + amountNumber
        }));

        // Delete expense
        await deleteExpense(id);
    };

    const updateGroupData = (data: Partial<GroupData>) => {
        setGroupData(prev => ({ ...prev, ...data }));
    };

    // Προσθήκη resetAll function που τα καθαρίζει ΟΛΑ
    const resetAll = async () => {
        setExpenses([]);
        setGroupData({
            userName: '',
            nicknameUser: '',
            groupName: '',
            activeUsers: 10,
            totalGroupExpenses: 0.00,
            totalPaid: 0.00,
            userExpenses: 0.00
        });

        // Clear από Supabase
        await clearAllExpensesFromDB();
        await upsertGroupData({
            userName: '',
            nicknameUser: '',
            groupName: '',
            activeUsers: 10,
            totalGroupExpenses: 0.00,
            totalPaid: 0.00,
            userExpenses: 0.00
        });
    };

    // Function για settle balance - μεταφέρει userExpenses στο totalPaid και μηδενίζει όλα
    const settleBalance = async () => {
        const currentUserExpenses = groupData.userExpenses;
        
        setGroupData(prev => ({
            ...prev,
            totalPaid: prev.totalPaid + currentUserExpenses,
            totalGroupExpenses: 0.00,
            userExpenses: 0.00
        }));
        
        setExpenses([]);
        await clearAllExpensesFromDB();
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

    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <img 
                    src="/assets/spinner.gif"
                    alt="Spinner"
                    className="w-20 h-20 mb-6"
                />
                <div className="text-xl font-semibold text-gray-700 animate-pulse">
                    Loading...
                </div>
            </div>
            
        );
    }

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

