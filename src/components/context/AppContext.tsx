
import { 
    createContext, 
    useState, 
    useContext, 
    useMemo, 
    useEffect 
} from "react";
import {Expense, GroupData, Group } from '../../types/types'
import { 
    fetchGroupData,
    upsertGroupData,
    fetchExpenses,
    fetchExpensesByGroup,
    addExpenseToDB,
    deleteExpenseFromDB,
    clearAllExpensesFromDB,
    clearExpensesByGroupFromDB,
    fetchGroups, 
    createGroup, 
    updateGroupDataFromGroup,
    joinGroup,
} from "../../services/supabaseService";

export interface AppContextType {
    expenses:Expense[];
    groupData:GroupData;
    balance:number;
    userBalance:number;
    groups: Group[];
    selectedGroup: Group | null; 
    addExpense: (amount: string, description: string, category: string) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
    clearExpenses: () => Promise<void>;
    checkExpense: (id: number) => Promise<void>;
    updateGroupData: (data: Partial<GroupData>) => void;
    resetAll: () => Promise<void>;
    settleBalance: () => Promise<void>;
    createNewGroup: (groupName: string, activeUsers: number) => Promise<void>; 
    selectGroup: (groupId: string) => void;
    loadGroups: () => Promise<void>;
    joinGroup: (groupPassword: string) => Promise<void>;
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

    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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

                // Φόρτωσε τα groups
                const loadedGroups = await fetchGroups();
                setGroups(loadedGroups);

                // Αν υπάρχει groupName στο groupData, βρες το αντίστοιχο group
                let matchingGroup: Group | null = null;
                if (loadedGroupData?.groupName) {
                    matchingGroup = loadedGroups.find((g: Group) => g.name === loadedGroupData.groupName) || null;
                    if (matchingGroup) {
                        setSelectedGroup(matchingGroup);
                        // Φόρτωσε τα expenses του επιλεγμένου group
                        const groupExpenses = await fetchExpensesByGroup(matchingGroup.id);
                        setExpenses(groupExpenses);
                    } else {
                        // Αν δεν βρέθηκε group, φόρτωσε όλα τα expenses (fallback)
                        const loadedExpenses = await fetchExpenses();
                        setExpenses(loadedExpenses);
                    }
                } else {
                    // Αν δεν υπάρχει groupName, φόρτωσε όλα τα expenses (fallback)
                    const loadedExpenses = await fetchExpenses();
                    setExpenses(loadedExpenses);
                }

            } catch (error) {
                console.error('error loading data:', error);

            } finally {
                setLoading(false);
            };
        };
        
        loadData();

    },[]);

     // ========== GROUP OPERATIONS ==========
     const createNewGroup = async (groupName: string, activeUsers: number) => {
        try {
            console.log('Creating group:', { groupName, activeUsers });
            
            const MAX_GROUPS = 5;
        
            // Έλεγχος πριν δημιουργήσει
            if (groups.length >= MAX_GROUPS) {
                alert(`You have reached the maximum limit of ${MAX_GROUPS} groups. Please delete a group before creating a new one.`);
                return;
            };

            // Δημιούργησε το group στη βάση
            const newGroupData = await createGroup(groupName, activeUsers);
            
            if (!newGroupData) {
                console.error('createGroup returned null');
                // Το error message έχει ήδη εμφανιστεί από το createGroup
                return;
            };

            console.log('Group created successfully:', newGroupData);

            // Ενημέρωσε το groupData με το όνομα και τον αριθμό
            updateGroupData({
                groupName: groupName,
                activeUsers: activeUsers,
            });

            // Ενημέρωσε το groupData στη βάση
            await updateGroupDataFromGroup(groupName, activeUsers, newGroupData.groupPassword);

            // Φόρτωσε ξανά τα groups
            await loadGroups();

            // Επιλέξτε το νέο group ως active
            const updatedGroups = await fetchGroups();
            const newGroup = updatedGroups.find((g: Group) => g.groupPassword === newGroupData.groupPassword);
            if (newGroup) {
                setSelectedGroup(newGroup);
            } else {
                console.warn('New group not found in updated groups list');
            };

        } catch (error) {

            console.error('Error in createNewGroup:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error creating group: ${errorMessage}`);
        }
    };

    /**
     * Επιλέγει ένα group και ενημερώνει το groupData
     */
    const selectGroup = async (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        setSelectedGroup(group);
        
        // Φόρτωσε τα expenses του group
        const groupExpenses = await fetchExpensesByGroup(groupId);
        setExpenses(groupExpenses);

        // Υπολόγισε τα totals από τα expenses
        const totals = groupExpenses.reduce((acc: { totalGroupExpenses: number; userExpenses: number }, exp: Expense) => {
            const amount = parseFloat(exp.amount.replace(',', '.')) || 0;
            return {
                totalGroupExpenses: acc.totalGroupExpenses + amount,
                userExpenses: acc.userExpenses + (exp.userName === (groupData.nicknameUser || groupData.userName) ? amount : 0)
            };
        }, { totalGroupExpenses: 0, userExpenses: 0 });
        
        // Ενημέρωσε το groupData με τα στοιχεία του επιλεγμένου group
        updateGroupData({
            groupName: group.name,
            activeUsers: group.members,
            totalGroupExpenses: totals.totalGroupExpenses,
            userExpenses: totals.userExpenses
        });

        // Αποθήκευσε στη βάση
        if (group.groupPassword) {
            await updateGroupDataFromGroup(group.name, group.members, group.groupPassword);
        };
    };

     /**
     * Φορτώνει τα groups από τη βάση
     */
    const loadGroups = async () => {
        try {
            const loadedGroups = await fetchGroups();
            setGroups(loadedGroups);
        } catch (error) {
            console.error('Error loading groups:', error);
        };
    };

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
            date: new Date(),
            groupId: selectedGroup?.id || undefined // Προσθήκη groupId
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
            };
        } catch (error) {
            console.error('Error saving expense:', error);
            // Rollback αν αποτύχει
            setExpenses(prev => prev.filter(exp => exp.id !== newExpense.id));
            setGroupData(prev => ({
                ...prev,
                totalGroupExpenses: prev.totalGroupExpenses - amountNumber,
                userExpenses: prev.userExpenses - amountNumber
            }));
        };
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
        };
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
        };
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

    /**
     * Join group με password
     */
    const joinGroupHandler = async (groupPassword: string): Promise<void> => {
        try {
            const joinedGroup = await joinGroup(groupPassword);
            
            if (!joinedGroup) {
                // Error message έχει ήδη εμφανιστεί από το joinGroup
                return;
            }

            // Φόρτωσε ξανά τα groups για να ενημερωθεί η λίστα
            await loadGroups();

            // Επιλέξτε το joined group
            setSelectedGroup(joinedGroup);
            
            // Φόρτωσε τα expenses του group
            const groupExpenses = await fetchExpensesByGroup(joinedGroup.id);
            setExpenses(groupExpenses);

            // Υπολόγισε τα totals από τα expenses
            const totals = groupExpenses.reduce((acc: { totalGroupExpenses: number; userExpenses: number }, exp: Expense) => {
                const amount = parseFloat(exp.amount.replace(',', '.')) || 0;
                return {
                    totalGroupExpenses: acc.totalGroupExpenses + amount,
                    userExpenses: acc.userExpenses + (exp.userName === (groupData.nicknameUser || groupData.userName) ? amount : 0)
                };
            }, { totalGroupExpenses: 0, userExpenses: 0 });

            // Ενημέρωσε το groupData με τα στοιχεία του joined group
            setGroupData(prev => ({
                ...prev,
                groupName: joinedGroup.name,
                activeUsers: joinedGroup.members,
                totalGroupExpenses: totals.totalGroupExpenses,
                userExpenses: totals.userExpenses
            }));

        } catch (error) {
            console.error('Error in joinGroupHandler:', error);
            alert('An error occurred while joining the group. Please try again.');
        }
    };

    const value: AppContextType = {
        expenses,
        groupData,
        balance,
        userBalance,
        groups, 
        selectedGroup, 
        addExpense,
        deleteExpense,
        clearExpenses,
        checkExpense,
        updateGroupData,
        resetAll,
        settleBalance,
         createNewGroup, 
        selectGroup, 
        loadGroups, 
        joinGroup: joinGroupHandler,
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

