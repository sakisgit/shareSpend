
import { supabase } from '../supabaseClient/supabaseClient';
import { Expense, GroupData, Group, GroupSpecificData } from '../types/types';

// ========== GROUP DATA OPERATIONS ==========

/**
 * Φορτώνει τα group data του logged-in user
 * @returns GroupData object ή null αν δεν υπάρχει user ή error
 */
export const fetchGroupData = async (): Promise<GroupData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found');
      return null;
    }

    const { data, error } = await supabase
      .from('group_data')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // Αν δεν υπάρχει record, δεν είναι error - είναι πρώτη φορά
      if (error.code === 'PGRST116') {
        console.log('No group data found for user - first time setup');
        return null;
      }
      console.error('Error fetching group data:', error);
      return null;
    }

    if (!data) return null;

    // Μετατροπή από database format (snake_case) σε app format (camelCase)
    return {
      userName: data.user_name || '',
      nicknameUser: data.nickname_user || '',
      groupName: data.group_name || '',
      activeUsers: data.active_users || 10,
      totalGroupExpenses: parseFloat(data.total_group_expenses) || 0.00,
      totalPaid: parseFloat(data.total_paid) || 0.00,
      userExpenses: parseFloat(data.user_expenses) || 0.00,
    };
  } catch (error) {
    console.error('Unexpected error in fetchGroupData:', error);
    return null;
  }
};

/**
 * Φορτώνει τα group-specific data από JSON στη βάση
 * @returns Record<string, GroupSpecificData> με τα group-specific data, ή empty object αν error
 */
export const fetchGroupSpecificData = async (): Promise<Record<string, GroupSpecificData>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found for fetchGroupSpecificData');
      return {};
    }

    const { data, error } = await supabase
      .from('group_data')
      .select('group_specific_data_json')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No record found - first time
        return {};
      }
      // Αν το column δεν υπάρχει (error code 42703), return empty object
      if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.warn('group_specific_data_json column does not exist yet. Please run the migration. Falling back to localStorage.');
        return {};
      }
      console.error('Error fetching group-specific data:', error);
      return {};
    }

    if (!data || !data.group_specific_data_json) {
      return {};
    }

    // Parse JSON string to object
    try {
      const parsed = typeof data.group_specific_data_json === 'string' 
        ? JSON.parse(data.group_specific_data_json)
        : data.group_specific_data_json;
      return parsed || {};
    } catch (parseError) {
      console.error('Error parsing group-specific data JSON:', parseError);
      return {};
    }
  } catch (error) {
    console.error('Unexpected error in fetchGroupSpecificData:', error);
    return {};
  }
};

/**
 * Αποθηκεύει τα group-specific data ως JSON στη βάση
 * @param groupSpecificDataMap - Record με τα group-specific data
 * @returns true αν επιτυχής, false αν error
 */
export const upsertGroupSpecificData = async (
  groupSpecificDataMap: Record<string, GroupSpecificData>
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for upsertGroupSpecificData');
      return false;
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(groupSpecificDataMap);

    const { error } = await supabase
      .from('group_data')
      .upsert({
        user_id: user.id,
        group_specific_data_json: jsonString,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      // Αν το column δεν υπάρχει (error code 42703), log warning αλλά continue
      if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.warn('group_specific_data_json column does not exist yet. Please run the migration. Data will be stored in localStorage only.');
        return false;
      }
      console.error('Error upserting group-specific data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in upsertGroupSpecificData:', error);
    return false;
  }
};

/**
 * Δημιουργεί ή ενημερώνει τα group data (upsert)
 * @param groupData - Το GroupData object προς αποθήκευση
 * @returns true αν επιτυχής, false αν error
 */
export const upsertGroupData = async (groupData: GroupData): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for upsertGroupData');
      return false;
    }

    const { error } = await supabase
      .from('group_data')
      .upsert({
        user_id: user.id,
        user_name: groupData.userName,
        nickname_user: groupData.nicknameUser,
        group_name: groupData.groupName,
        active_users: groupData.activeUsers,
        total_group_expenses: groupData.totalGroupExpenses,
        total_paid: groupData.totalPaid,
        user_expenses: groupData.userExpenses,
        updated_at: new Date().toISOString(),
        // Note: group_specific_data_json is updated separately via upsertGroupSpecificData
      }, {
        onConflict: 'user_id' // Αν υπάρχει ήδη, κάνε update
      });

    if (error) {
      console.error('Error upserting group data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in upsertGroupData:', error);
    return false;
  }
};

// ========== EXPENSES OPERATIONS ==========

/**
 * Φορτώνει όλα τα expenses του logged-in user
 * @returns Array με Expense objects, ή empty array αν error
 */
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found for fetchExpenses');
      return [];
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false }); // Νεότερα πρώτα

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Μετατροπή από database format σε app format
    return data.map(exp => ({
      id: exp.id,
      amount: exp.amount,
      description: exp.description,
      category: exp.category,
      userName: exp.user_name || '',
      date: new Date(exp.date),
    }));
  } catch (error) {
    console.error('Unexpected error in fetchExpenses:', error);
    return [];
  }
};

/**
 * Φορτώνει τα expenses ενός συγκεκριμένου group
 * @param groupId - Το ID του group
 * @returns Array με Expense objects, ή empty array αν error
 */
export const fetchExpensesByGroup = async (groupId: string): Promise<Expense[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found for fetchExpensesByGroup');
      return [];
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('group_id', groupId) // Φόρτωσε expenses βάσει group_id
      .order('date', { ascending: false }); // Νεότερα πρώτα

    if (error) {
      console.error('Error fetching expenses by group:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Μετατροπή από database format σε app format
    return data.map(exp => ({
      id: exp.id,
      amount: exp.amount,
      description: exp.description,
      category: exp.category,
      userName: exp.user_name || '',
      date: new Date(exp.date),
      groupId: exp.group_id?.toString() || groupId,
    }));
  } catch (error) {
    console.error('Unexpected error in fetchExpensesByGroup:', error);
    return [];
  }
};

/**
 * Προσθέτει ένα expense στη βάση
 * @param expense - Το Expense object προς αποθήκευση
 * @returns Το ID του expense από τη βάση, ή null αν error
 */
export const addExpenseToDB = async (expense: Expense, groupId?: string): Promise<number | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for addExpenseToDB');
      return null;
    }

    // Πάρε το group_data_id για το foreign key
    const { data: groupData, error: groupDataError } = await supabase
      .from('group_data')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (groupDataError || !groupData) {
      console.error('Error fetching group_data_id:', groupDataError);
      // Προσπάθησε να δημιουργήσεις group_data αν δεν υπάρχει
      const defaultGroupData: GroupData = {
        userName: user.email?.split('@')[0] || '',
        nicknameUser: '',
        groupName: '',
        activeUsers: 10,
        totalGroupExpenses: 0.00,
        totalPaid: 0.00,
        userExpenses: 0.00,
      };
      await upsertGroupData(defaultGroupData);
      
      // Retry
      const { data: retryGroupData } = await supabase
        .from('group_data')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!retryGroupData) {
        return null;
      }
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        group_data_id: groupData?.id,
        group_id: groupId || expense.groupId || null, // Προσθήκη group_id
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        user_name: expense.userName,
        date: expense.date.toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Unexpected error in addExpenseToDB:', error);
    return null;
  }
};

/**
 * Διαγράφει ένα expense από τη βάση
 * @param expenseId - Το ID του expense προς διαγραφή
 * @returns true αν επιτυχής, false αν error
 */
export const deleteExpenseFromDB = async (expenseId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteExpenseFromDB:', error);
    return false;
  }
};

/**
 * Διαγράφει όλα τα expenses του logged-in user
 * @returns true αν επιτυχής, false αν error
 */
export const clearAllExpensesFromDB = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for clearAllExpensesFromDB');
      return false;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing expenses:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in clearAllExpensesFromDB:', error);
    return false;
  }
};

/**
 * Διαγράφει όλα τα expenses ενός συγκεκριμένου group
 * @param groupId - Το ID του group
 * @returns true αν επιτυχής, false αν error
 */
export const clearExpensesByGroupFromDB = async (groupId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for clearExpensesByGroupFromDB');
      return false;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id); // Μόνο expenses του logged-in user

    if (error) {
      console.error('Error clearing expenses by group:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in clearExpensesByGroupFromDB:', error);
    return false;
  }
};

// ========== GROUPS OPERATIONS ==========

/**
 * Δημιουργεί ένα νέο group στη βάση
 * @param groupName - Το όνομα του group
 * @param activeUsers - Ο αριθμός των active users
 * @returns Το Group object με ID, ή null αν error
 */
export const createGroup = async (
    groupName: string, 
    activeUsers: number
): Promise<{ id: string; groupPassword: string } | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No user found for createGroup');
            return null;
        }

        // ΕΛΕΓΧΟΣ: Πόσα groups έχει ήδη ο χρήστης
        const { count, error: countError } = await supabase
            .from('groups')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const MAX_GROUPS = 5; // Περιορισμός
        const currentCount = count || 0;

        if (currentCount >= MAX_GROUPS) {
            alert(`You have reached the maximum limit of ${MAX_GROUPS} groups. Please delete a group before creating a new one.`);
            return null;
        }

        // Πάρε το userName από το group_data
        const groupData = await fetchGroupData();
        const creatorName = groupData?.userName || user.email?.split('@')[0] || 'Unknown';

        // Function για να δημιουργήσεις το group password
        const generateGroupPassword = (name: string): string => {
            // 1. Εξάγει μόνο τα γράμματα από το όνομα (uppercase, χωρίς spaces/symbols)
            const lettersOnly = name.replace(/[^A-Za-z]/g, '').toUpperCase();
            
            // Αν δεν υπάρχουν αρκετά γράμματα, χρησιμοποίησε defaults
            const availableLetters = lettersOnly.length >= 3 
                ? lettersOnly 
                : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            // 2. Επιλέγει 3 τυχαία γράμματα
            const getRandomLetters = (str: string, count: number): string => {
                const letters: string[] = [];
                const strArray = str.split('');
                for (let i = 0; i < count; i++) {
                    const randomIndex = Math.floor(Math.random() * strArray.length);
                    letters.push(strArray[randomIndex]);
                    strArray.splice(randomIndex, 1); // Αφαίρεσε το γράμμα για να μην επαναληφθεί
                }
                return letters.join('');
            };
            
            const threeLetters = getRandomLetters(availableLetters, 3);
            
            // 3. Δημιούργησε 6 τυχαία νούμερα
            const sixNumbers = Array.from({ length: 6 }, () => 
                Math.floor(Math.random() * 10)
            ).join('');
            
            // 4. Δημιούργησε 3 τυχαία σύμβολα
            const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const threeSymbols = Array.from({ length: 3 }, () => 
                symbols[Math.floor(Math.random() * symbols.length)]
            ).join('');
            
            // 5. Συνδύασε όλα: 3 γράμματα + 6 νούμερα + 3 σύμβολα = 12 χαρακτήρες
            const allChars = (threeLetters + sixNumbers + threeSymbols).split('');
            
            // 6. Ανακατέψε σε τυχαία σειρά (Fisher-Yates shuffle)
            for (let i = allChars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
            }
            
            // 7. Προσθέτει # στην αρχή
            return '#' + allChars.join('');
        };

        // Δημιούργησε το group password
        const groupPassword = generateGroupPassword(groupName);

        const { data, error } = await supabase
            .from('groups')
            .insert({
                user_id: user.id,
                name: groupName,
                members: activeUsers,
                group_password: groupPassword,
                created_at: new Date().toISOString(),
                creator_name: creatorName,
            })
            .select('id, group_password')
            .single();

        if (error) {
            console.error('Error creating group:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            alert(`Error creating group: ${error.message || 'Unknown error'}`);
            return null;
        }

        if (!data) {
            console.error('No data returned from createGroup');
            alert('Error: No data returned when creating group');
            return null;
        }

        return {
            id: data.id.toString(),
            groupPassword: data.group_password
        };
    } catch (error) {
        console.error('Unexpected error in createGroup:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Unexpected error: ${errorMessage}`);
        return null;
    }
};

/**
 * Φορτώνει όλα τα groups του logged-in user
 * @returns Array με Group objects
 */
export const fetchGroups = async (): Promise<Group[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('No user found for fetchGroups');
            return [];
        }

        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching groups:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data.map((g: any) => ({
            id: g.id.toString(),
            name: g.name,
            members: g.members,
            isActive: g.is_active || false,
            groupPassword: g.group_password,
            createdAt: new Date(g.created_at),
            createdBy: g.creator_name || 'Unknown',
        }));
    } catch (error) {
        console.error('Unexpected error in fetchGroups:', error);
        return [];
    }
};

/**
 * Ενημερώνει το group_data με τα στοιχεία του επιλεγμένου group
 * @param groupName - Το όνομα του group
 * @param activeUsers - Ο αριθμός των active users
 * @param groupPassword - Ο κωδικός/password του group
 * @returns true αν επιτυχής
 */
export const updateGroupDataFromGroup = async (
    groupName: string,
    activeUsers: number,
    groupPassword: string
): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No user found for updateGroupDataFromGroup');
            return false;
        }

        // Πάρε το τρέχον group_data
        const currentGroupData = await fetchGroupData();
        
        // Ενημέρωσε με τα νέα στοιχεία
        const updatedGroupData: GroupData = {
            ...(currentGroupData || {
                userName: user.email?.split('@')[0] || '',
                nicknameUser: '',
                groupName: '',
                activeUsers: 10,
                totalGroupExpenses: 0.00,
                totalPaid: 0.00,
                userExpenses: 0.00,
            }),
            groupName: groupName,
            activeUsers: activeUsers,
        };

        return await upsertGroupData(updatedGroupData);
    } catch (error) {
        console.error('Unexpected error in updateGroupDataFromGroup:', error);
        return false;
    }
};