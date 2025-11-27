
import { 
    createContext, 
    useState, 
    useContext, 
    useMemo, 
    useEffect 
} from "react";
import {Expense, GroupData, Group, GroupSpecificData } from '../../types/types'
import { 
    fetchGroupData,
    upsertGroupData,
    fetchExpenses,
    addExpenseToDB,
    deleteExpenseFromDB,
    clearAllExpensesFromDB,
    fetchGroups, 
    createGroup, 
    updateGroupDataFromGroup,
    fetchGroupSpecificData,
    upsertGroupSpecificData,
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
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {

    const [loading, setLoading]= useState(true);

    const [expenses, setExpenses]=useState<Expense[]>([]);

    // Global user data (shared across all groups)
    const [userName, setUserName] = useState<string>('');
    const [nicknameUser, setNicknameUser] = useState<string>('');

    // Group-specific data stored per groupId
    const [groupSpecificDataMap, setGroupSpecificDataMap] = useState<Record<string, GroupSpecificData>>({});

    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    // Computed groupData that combines global user data with selected group's specific data
    const groupData: GroupData = useMemo(() => {
        if (!selectedGroup) {
            return {
                userName,
                nicknameUser,
                groupName: '',
                activeUsers: 10,
                totalGroupExpenses: 0.00,
                totalPaid: 0.00,
                userExpenses: 0.00
            };
        };

        const groupSpecific = groupSpecificDataMap[selectedGroup.id] || {
            groupName: selectedGroup.name,
            activeUsers: selectedGroup.members,
            totalGroupExpenses: 0.00,
            totalPaid: 0.00,
            userExpenses: 0.00
        };

        return {
            userName,
            nicknameUser,
            ...groupSpecific
        };
    }, [userName, nicknameUser, selectedGroup, groupSpecificDataMap]);

    // Υπολογισμός balance με προστασία από division by zero - memoized για σωστό hot reload
    const balance = useMemo(() => {
        return groupData.activeUsers >= 2 
            ? groupData.totalGroupExpenses / groupData.activeUsers 
            : 0;
    }, [groupData.activeUsers, groupData.totalGroupExpenses]);

    const userBalance = useMemo(() => {
        return groupData.userExpenses - balance;
    }, [groupData.userExpenses, balance]);

    // Load group-specific data from localStorage
    const loadGroupSpecificDataFromStorage = (): Record<string, GroupSpecificData> => {
        try {
            const stored = localStorage.getItem('groupSpecificData');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading group-specific data from localStorage:', error);
        }
        return {};
    };

    // Save group-specific data to localStorage
    const saveGroupSpecificDataToStorage = (data: Record<string, GroupSpecificData>) => {
        try {
            localStorage.setItem('groupSpecificData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving group-specific data to localStorage:', error);
        }
    };

    // ========== LOAD DATA ON MOUNT ==========
    useEffect(() => {
        const loadData= async () => {
            setLoading(true);
            try{
                const loadedGroupData = await fetchGroupData();
                if(loadedGroupData) {
                    // Set global user data
                    setUserName(loadedGroupData.userName || '');
                    setNicknameUser(loadedGroupData.nicknameUser || '');
                }

                // Load group-specific data from database (primary source)
                const dbGroupSpecificData = await fetchGroupSpecificData();
                
                // Load from localStorage as fallback/backup
                const storedGroupData = loadGroupSpecificDataFromStorage();
                
                // Merge: database data takes priority, localStorage as fallback
                const mergedData = { ...storedGroupData, ...dbGroupSpecificData };
                setGroupSpecificDataMap(mergedData);
                
                // If database had data, sync it to localStorage as backup
                if (Object.keys(dbGroupSpecificData).length > 0) {
                    saveGroupSpecificDataToStorage(mergedData);
                }

                const loadedExpenses= await fetchExpenses();
                setExpenses(loadedExpenses);

                // Φόρτωσε τα groups
                const loadedGroups = await fetchGroups();
                setGroups(loadedGroups);

                // Αν υπάρχει groupName στο loadedGroupData, βρες το αντίστοιχο group
                if (loadedGroupData?.groupName) {
                    const matchingGroup = loadedGroups.find((g: Group) => g.name === loadedGroupData.groupName);
                    if (matchingGroup) {
                        setSelectedGroup(matchingGroup);
                    };
                };

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

            // Φόρτωσε ξανά τα groups
            await loadGroups();

            // Επιλέξτε το νέο group ως active
            const updatedGroups = await fetchGroups();
            const newGroup = updatedGroups.find((g: Group) => g.groupPassword === newGroupData.groupPassword);
            if (newGroup) {
                // Initialize group-specific data for the new group
                const newGroupSpecificData: GroupSpecificData = {
                    groupName: groupName,
                    activeUsers: activeUsers,
                    totalGroupExpenses: 0.00,
                    totalPaid: 0.00,
                    userExpenses: 0.00
                };
                
                setGroupSpecificDataMap(prev => {
                    const updated = { ...prev, [newGroup.id]: newGroupSpecificData };
                    saveGroupSpecificDataToStorage(updated);
                    return updated;
                });
                
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
     * Επιλέγει ένα group και φορτώνει τα group-specific data
     */
    const selectGroup = async (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        setSelectedGroup(group);
        
        // Αν δεν υπάρχουν group-specific data για αυτό το group, δημιούργησε default
        if (!groupSpecificDataMap[groupId]) {
            const defaultGroupData: GroupSpecificData = {
                groupName: group.name,
                activeUsers: group.members,
                totalGroupExpenses: 0.00,
                totalPaid: 0.00,
                userExpenses: 0.00
            };
            setGroupSpecificDataMap(prev => {
                const updated = { ...prev, [groupId]: defaultGroupData };
                saveGroupSpecificDataToStorage(updated);
                return updated;
            });
        }
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
    // Αποθήκευση global user data στο Supabase
    useEffect(() => { 
        if (!loading && userName) {
            const saveUserData = async () => {
                // Save only global user data to database
                await upsertGroupData({
                    userName,
                    nicknameUser,
                    groupName: selectedGroup?.name || '',
                    activeUsers: selectedGroup?.members || 10,
                    totalGroupExpenses: 0.00,
                    totalPaid: 0.00,
                    userExpenses: 0.00
                });
            };
            
            // Debounce για να μην κάνει πολλά requests
            const timeoutId = setTimeout(saveUserData, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [userName, nicknameUser, loading, selectedGroup]);

    // Auto-save group-specific data to database and localStorage
    useEffect(() => {
        if (selectedGroup && Object.keys(groupSpecificDataMap).length > 0) {
            // Save to database (primary storage)
            const saveToDatabase = async () => {
                await upsertGroupSpecificData(groupSpecificDataMap);
            };
            
            // Debounce για να μην κάνει πολλά requests
            const timeoutId = setTimeout(saveToDatabase, 500);
            
            // Also save to localStorage as backup
            saveGroupSpecificDataToStorage(groupSpecificDataMap);
            
            return () => clearTimeout(timeoutId);
        }
    }, [groupSpecificDataMap, selectedGroup]);

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

        // Ενημέρωση group-specific data
        if (selectedGroup) {
            setGroupSpecificDataMap(prev => {
                const current = prev[selectedGroup.id] || {
                    groupName: selectedGroup.name,
                    activeUsers: selectedGroup.members,
                    totalGroupExpenses: 0.00,
                    totalPaid: 0.00,
                    userExpenses: 0.00
                };
                return {
                    ...prev,
                    [selectedGroup.id]: {
                        ...current,
                        totalGroupExpenses: current.totalGroupExpenses + amountNumber,
                        userExpenses: current.userExpenses + amountNumber
                    }
                };
            });
        }

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
            if (selectedGroup) {
                setGroupSpecificDataMap(prev => {
                    const current = prev[selectedGroup.id];
                    if (!current) return prev;
                    return {
                        ...prev,
                        [selectedGroup.id]: {
                            ...current,
                            totalGroupExpenses: current.totalGroupExpenses - amountNumber,
                            userExpenses: current.userExpenses - amountNumber
                        }
                    };
                });
            }
        };
    };

    const deleteExpense = async (id: number) => {
        const expense = expenses.find(exp => exp.id === id);
        if (!expense) return;

        const amountNumber = parseFloat(expense.amount.replace(',', '.')) || 0;

        // Optimistic update
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        if (selectedGroup) {
            setGroupSpecificDataMap(prev => {
                const current = prev[selectedGroup.id];
                if (!current) return prev;
                return {
                    ...prev,
                    [selectedGroup.id]: {
                        ...current,
                        totalGroupExpenses: Math.max(0, current.totalGroupExpenses - amountNumber),
                        userExpenses: Math.max(0, current.userExpenses - amountNumber)
                    }
                };
            });
        }

        // Delete από Supabase
        try {
            await deleteExpenseFromDB(id);
        } catch (error) {
            console.error('Error deleting expense:', error);
            // Rollback
            setExpenses(prev => [...prev, expense]);
            if (selectedGroup) {
                setGroupSpecificDataMap(prev => {
                    const current = prev[selectedGroup.id];
                    if (!current) return prev;
                    return {
                        ...prev,
                        [selectedGroup.id]: {
                            ...current,
                            totalGroupExpenses: current.totalGroupExpenses + amountNumber,
                            userExpenses: current.userExpenses + amountNumber
                        }
                    };
                });
            }
        };
    };

    const clearExpenses = async () => {
        // Optimistic update
        setExpenses([]);
        if (selectedGroup) {
            setGroupSpecificDataMap(prev => {
                const current = prev[selectedGroup.id];
                if (!current) return prev;
                return {
                    ...prev,
                    [selectedGroup.id]: {
                        ...current,
                        totalGroupExpenses: 0.00,
                        userExpenses: 0.00
                    }
                };
            });
        }

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

        // Update group-specific data
        if (selectedGroup) {
            setGroupSpecificDataMap(prev => {
                const current = prev[selectedGroup.id];
                if (!current) return prev;
                return {
                    ...prev,
                    [selectedGroup.id]: {
                        ...current,
                        totalPaid: current.totalPaid + amountNumber,
                        totalGroupExpenses: current.totalGroupExpenses + amountNumber,
                        userExpenses: current.userExpenses + amountNumber
                    }
                };
            });
        }

        // Delete expense
        await deleteExpense(id);
    };

    const updateGroupData = (data: Partial<GroupData>) => {
        // Update global user data if provided
        if (data.userName !== undefined) {
            setUserName(data.userName);
        }
        if (data.nicknameUser !== undefined) {
            setNicknameUser(data.nicknameUser);
        }

        // Update group-specific data if provided and a group is selected
        if (selectedGroup && (
            data.groupName !== undefined ||
            data.activeUsers !== undefined ||
            data.totalGroupExpenses !== undefined ||
            data.totalPaid !== undefined ||
            data.userExpenses !== undefined
        )) {
            setGroupSpecificDataMap(prev => {
                const current = prev[selectedGroup.id] || {
                    groupName: selectedGroup.name,
                    activeUsers: selectedGroup.members,
                    totalGroupExpenses: 0.00,
                    totalPaid: 0.00,
                    userExpenses: 0.00
                };
                const updated = {
                    ...prev,
                    [selectedGroup.id]: {
                        ...current,
                        ...(data.groupName !== undefined && { groupName: data.groupName }),
                        ...(data.activeUsers !== undefined && { activeUsers: data.activeUsers }),
                        ...(data.totalGroupExpenses !== undefined && { totalGroupExpenses: data.totalGroupExpenses }),
                        ...(data.totalPaid !== undefined && { totalPaid: data.totalPaid }),
                        ...(data.userExpenses !== undefined && { userExpenses: data.userExpenses })
                    }
                };
                // Save to database and localStorage
                saveGroupSpecificDataToStorage(updated);
                upsertGroupSpecificData(updated).catch(err => 
                    console.error('Error saving group-specific data to database:', err)
                );
                return updated;
            });
        }
    };

    // Προσθήκη resetAll function που τα καθαρίζει ΟΛΑ
    const resetAll = async () => {
        setExpenses([]);
        
        // Reset only the current group's data, keep global user data
        if (selectedGroup) {
            setGroupSpecificDataMap(prev => {
                const updated = {
                    ...prev,
                    [selectedGroup.id]: {
                        groupName: selectedGroup.name,
                        activeUsers: selectedGroup.members,
                        totalGroupExpenses: 0.00,
                        totalPaid: 0.00,
                        userExpenses: 0.00
                    }
                };
                saveGroupSpecificDataToStorage(updated);
                return updated;
            });
        }

        // Clear από Supabase
        await clearAllExpensesFromDB();
    };

    // Function για settle balance - μεταφέρει userExpenses στο totalPaid και μηδενίζει όλα
    const settleBalance = async () => {
        if (!selectedGroup) return;
        
        const currentGroupData = groupSpecificDataMap[selectedGroup.id];
        if (!currentGroupData) return;
        
        const currentUserExpenses = currentGroupData.userExpenses;
        
        setGroupSpecificDataMap(prev => {
            const updated = {
                ...prev,
                [selectedGroup.id]: {
                    ...currentGroupData,
                    totalPaid: currentGroupData.totalPaid + currentUserExpenses,
                    totalGroupExpenses: 0.00,
                    userExpenses: 0.00
                }
            };
            saveGroupSpecificDataToStorage(updated);
            return updated;
        });
        
        setExpenses([]);
        await clearAllExpensesFromDB();
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

