
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

    // Φόρτωσε μόνο expenses που ΔΕΝ έχουν group_id (null) - δηλαδή expenses που δεν ανήκουν σε group
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .is('group_id', null) // Μόνο expenses χωρίς group_id
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
 * @param groupId - Το ID του group (ως string)
 * @returns Array με Expense objects, ή empty array αν error
 */
export const fetchExpensesByGroup = async (groupId: string): Promise<Expense[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found for fetchExpensesByGroup');
      return [];
    }

    // Μετατροπή string σε number για το query (γιατί στη βάση είναι BIGINT)
    const groupIdNum = parseInt(groupId, 10);
    if (isNaN(groupIdNum)) {
      console.error('Invalid groupId:', groupId);
      return [];
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('group_id', groupIdNum) // Φόρτωσε expenses βάσει group_id
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
export const addExpenseToDB = async (expense: Expense): Promise<number | null> => {
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

    // Μετατροπή groupId από string σε number (γιατί στη βάση είναι BIGINT)
    const groupIdNum = expense.groupId ? parseInt(expense.groupId, 10) : null;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        group_data_id: groupData?.id,
        group_id: groupIdNum, // Προσθήκη group_id
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
 * Ενημερώνει τα expenses που δεν έχουν group_id με το group_id του joined group
 * @param groupId - Το ID του group (ως string)
 * @returns true αν επιτυχής, false αν error
 */
export const updateExpensesGroupId = async (groupId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for updateExpensesGroupId');
      return false;
    }

    // Μετατροπή string σε number για το query
    const groupIdNum = parseInt(groupId, 10);
    if (isNaN(groupIdNum)) {
      console.error('Invalid groupId:', groupId);
      return false;
    }

    // Ενημέρωσε expenses που δεν έχουν group_id (null) ή έχουν null group_id
    const { error } = await supabase
      .from('expenses')
      .update({ group_id: groupIdNum })
      .eq('user_id', user.id)
      .is('group_id', null);

    if (error) {
      console.error('Error updating expenses group_id:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in updateExpensesGroupId:', error);
    return false;
  }
};

/**
 * Διαγράφει όλα τα expenses ενός συγκεκριμένου group
 * @param groupId - Το ID του group (ως string)
 * @returns true αν επιτυχής, false αν error
 */
export const clearExpensesByGroupFromDB = async (groupId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found for clearExpensesByGroupFromDB');
      return false;
    }

    // Μετατροπή string σε number για το query
    const groupIdNum = parseInt(groupId, 10);
    if (isNaN(groupIdNum)) {
      console.error('Invalid groupId:', groupId);
      return false;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('group_id', groupIdNum)
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
        // 5-10 χαρακτήρες με νούμερα, γράμματα και σύμβολα, ξεκινάει με #
        const generateGroupPassword = (): string => {
            // Τυχαίος αριθμός μεταξύ 5-10 (συνολικά χαρακτήρες, συμπεριλαμβανομένου του #)
            const length = Math.floor(Math.random() * 6) + 5; // 5-10
            
            // Χαρακτήρες που μπορούν να χρησιμοποιηθούν (μετά το #)
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const numbers = '0123456789';
            const symbols = '!@$%^&*()_+-=[]{}|;:,.<>?';
            const allChars = letters + numbers + symbols;
            
            // Δημιούργησε τυχαίους χαρακτήρες (length - 1 γιατί το # μετράει)
            const passwordChars: string[] = [];
            for (let i = 0; i < length - 1; i++) {
                const randomIndex = Math.floor(Math.random() * allChars.length);
                passwordChars.push(allChars[randomIndex]);
            }
            
            // Ανακατέψε τους χαρακτήρες
            for (let i = passwordChars.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
            }
            
            // Προσθέτει # στην αρχή
            return '#' + passwordChars.join('');
        };

        // Δημιούργησε το group password
        const groupPassword = generateGroupPassword();

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
 * Φορτώνει όλα τα groups του logged-in user (που έχει δημιουργήσει ΚΑΙ που έχει join)
 * @returns Array με Group objects
 */
export const fetchGroups = async (): Promise<Group[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('No user found for fetchGroups');
            return [];
        }

        // 1. Φόρτωσε groups που έχει join ο user (μέσω group_members) - μόνο active members
        const { data: memberGroups, error: memberError } = await supabase
            .from('group_members')
            .select(`
                group_id,
                groups (*)
            `)
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (memberError) {
            console.error('Error fetching member groups:', memberError);
        }

        // 2. Φόρτωσε groups που έχει δημιουργήσει ο user (user_id = user.id)
        const { data: createdGroups, error: createdError } = await supabase
            .from('groups')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (createdError) {
            console.error('Error fetching created groups:', createdError);
        }

        // 3. Δημιούργησε Set με τα group IDs που είναι active members
        const activeMemberGroupIds = new Set<string>();
        if (memberGroups) {
            memberGroups.forEach((member: any) => {
                if (member.groups) {
                    activeMemberGroupIds.add(member.groups.id.toString());
                }
            });
        }

        // 4. Ελέγχουμε για ΟΛΑ τα groups αν έχουν κάνει leave (όχι μόνο created)
        // Αν ένα group έχει record στο group_members με is_active=false, 
        // σημαίνει ότι έχει κάνει leave και δεν θα το εμφανίζουμε
        const leftGroupIds = new Set<string>();
        
        // Φόρτωσε ΟΛΑ τα records από group_members με is_active=false για αυτόν τον user
        console.log('fetchGroups: Fetching left groups for user', user.id);
        const { data: leftGroupsData, error: leftGroupsError } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id)
            .eq('is_active', false);

        if (leftGroupsError) {
            console.error('Error fetching left groups:', leftGroupsError);
            console.error('Error details:', {
                message: leftGroupsError.message,
                code: leftGroupsError.code,
                details: leftGroupsError.details
            });
        } else {
            console.log('fetchGroups: Query for left groups successful, returned', leftGroupsData?.length || 0, 'records');
        }

        if (leftGroupsData) {
            console.log('fetchGroups: Found', leftGroupsData.length, 'groups that user has left');
            leftGroupsData.forEach((item: any) => {
                // Βεβαιώσου ότι το group_id είναι string για consistency
                const groupIdStr = typeof item.group_id === 'number' 
                    ? item.group_id.toString() 
                    : item.group_id.toString();
                leftGroupIds.add(groupIdStr);
                console.log('fetchGroups: Added to leftGroupIds:', groupIdStr, '(type:', typeof item.group_id, ')');
            });
        } else {
            console.log('fetchGroups: No left groups found (leftGroupsData is null or empty)');
        }
        
        console.log('fetchGroups: Total leftGroupIds:', leftGroupIds.size, Array.from(leftGroupIds));

        // 5. Συνδύασε τα δύο arrays - μόνο groups όπου ο user είναι active member
        const allGroupsMap = new Map<string, any>();

        // Προσθήκη joined groups (active members) - αλλά ελέγξε πρώτα αν έχουν κάνει leave
        if (memberGroups) {
            memberGroups.forEach((member: any) => {
                if (member.groups) {
                    const g = member.groups;
                    const groupIdStr = g.id.toString();
                    
                    // Ελέγχουμε αν έχει κάνει leave - αν ναι, δεν το προσθέτουμε
                    if (leftGroupIds.has(groupIdStr)) {
                        console.log('fetchGroups: Member group', g.name, '(id:', groupIdStr, ') was left, skipping');
                        return; // Skip this group
                    }
                    
                    console.log('fetchGroups: Adding active member group', g.name, '(id:', groupIdStr, ')');
                    allGroupsMap.set(groupIdStr, g);
                }
            });
        }

        // Προσθήκη created groups - μόνο αν δεν έχουν κάνει leave
        if (createdGroups) {
            createdGroups.forEach((g: any) => {
                const groupIdStr = g.id.toString();
                
                // ΠΡΩΤΑ: Ελέγχουμε αν έχει κάνει leave - αν ναι, δεν το προσθέτουμε
                if (leftGroupIds.has(groupIdStr)) {
                    // Creator που έχει κάνει leave - δεν το προσθέτουμε
                    console.log('fetchGroups: Group', g.name, '(id:', groupIdStr, ') was left, skipping');
                    return; // Skip this group
                }
                
                // ΔΕΥΤΕΡΑ: Αν είναι active member, το προσθέτουμε (ήδη προστέθηκε από memberGroups)
                if (activeMemberGroupIds.has(groupIdStr)) {
                    // Ήδη προστέθηκε από memberGroups
                    console.log('fetchGroups: Group', g.name, '(id:', groupIdStr, ') is active member, already added');
                    return; // Already added, skip
                }
                
                // ΤΡΙΤΑ: Creator που δεν έχει κάνει leave και δεν είναι active member
                // Αυτό σημαίνει ότι είναι creator που δεν έχει join το δικό του group
                // Σε αυτή την περίπτωση, το προσθέτουμε
                console.log('fetchGroups: Group', g.name, '(id:', groupIdStr, ') is created by user and not left, adding');
                allGroupsMap.set(groupIdStr, g);
            });
        }

        // 6. Μετατροπή σε Group array και τελικό φιλτράρισμα
        const groupsArray = Array.from(allGroupsMap.values());
        
        // Τελικό φιλτράρισμα: αφαίρεσε οποιαδήποτε group που έχει κάνει leave
        const finalGroups = groupsArray.filter((g: any) => {
            const groupIdStr = g.id.toString();
            const wasLeft = leftGroupIds.has(groupIdStr);
            if (wasLeft) {
                console.log('fetchGroups: Final filter - removing group', g.name, '(id:', groupIdStr, ') because it was left');
            }
            return !wasLeft;
        });

        console.log('fetchGroups: Final groups count:', finalGroups.length, 'out of', groupsArray.length, 'before filtering');

        if (finalGroups.length === 0) {
            console.log('fetchGroups: No groups to return');
            return [];
        }

        return finalGroups.map((g: any) => ({
            id: g.id.toString(),
            name: g.name,
            members: g.members,
            isActive: g.is_active || false,
            groupPassword: g.group_password,
            groupNumber: g.group_number || g.id, // Use group_number from DB or fallback to id
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

// ========== JOIN GROUP OPERATIONS ==========

/**
 * Βρίσκει ένα group από το group password
 * @param groupPassword - Το password του group
 * @returns Group object ή null αν δεν βρεθεί
 */
export const getGroupByPassword = async (groupPassword: string): Promise<Group | null> => {
    try {
        console.log('getGroupByPassword: Searching for password:', groupPassword);
        
        // Προσπάθησε πρώτα με RPC function (αν υπάρχει)
        try {
            const { data: rpcData, error: rpcError } = await supabase
                .rpc('get_group_by_password', { search_password: groupPassword });

            if (!rpcError && rpcData && rpcData.length > 0) {
                const g = rpcData[0];
                console.log('getGroupByPassword: Found group via RPC:', g.id, g.name);
                return {
                    id: g.id.toString(),
                    name: g.name,
                    members: g.members,
                    isActive: g.is_active || false,
                    groupPassword: g.group_password,
                    createdAt: new Date(g.created_at),
                    createdBy: g.creator_name || 'Unknown',
                };
            }
            
            if (rpcError) {
                console.log('getGroupByPassword: RPC function not available or error:', rpcError.message);
            }
        } catch (rpcErr) {
            console.log('getGroupByPassword: RPC function does not exist, trying direct query...');
        }

        // Fallback 1: Προσπάθησε με direct query
        let { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('group_password', groupPassword)
            .maybeSingle(); // Χρησιμοποίησε maybeSingle αντί για single για να μην throw error αν δεν βρει

        // Αν 406 error (Not Acceptable - RLS issue)
        if (error && (error.message?.includes('406') || error.code === '406' || error.code === 'PGRST301')) {
            console.log('getGroupByPassword: 406 error, trying to fetch all groups and filter...');
            
            // Fallback 2: Φόρτωσε όλα τα groups (αν το RLS το επιτρέπει)
            const { data: allGroups, error: allGroupsError } = await supabase
                .from('groups')
                .select('*');

            if (allGroupsError) {
                console.error('getGroupByPassword: Error fetching all groups:', allGroupsError);
                
                // Fallback 3: Δοκίμασε με ilike (case-insensitive)
                console.log('getGroupByPassword: Trying with ilike...');
                const { data: data2, error: error2 } = await supabase
                    .from('groups')
                    .select('*')
                    .ilike('group_password', groupPassword)
                    .maybeSingle();
                
                if (!error2 && data2) {
                    console.log('getGroupByPassword: Found with ilike!');
                    data = data2;
                    error = null;
                } else {
                    console.error('getGroupByPassword: ilike also failed:', error2);
                    error = error2;
                }
            } else if (allGroups && allGroups.length > 0) {
                // Filter στο client side
                console.log('getGroupByPassword: Filtering', allGroups.length, 'groups on client side...');
                const foundGroup = allGroups.find((g: any) => g.group_password === groupPassword);
                if (foundGroup) {
                    console.log('getGroupByPassword: Found group via client-side filter!');
                    data = foundGroup;
                    error = null;
                } else {
                    console.log('getGroupByPassword: Group not found in', allGroups.length, 'groups');
                    error = { code: 'PGRST116', message: 'No group found' } as any;
                }
            } else {
                console.log('getGroupByPassword: No groups returned from allGroups query');
                error = { code: 'PGRST116', message: 'No groups available' } as any;
            }
        }

        if (error) {
            if (error.code === 'PGRST116') {
                // No group found
                console.log('getGroupByPassword: No group found with password:', groupPassword);
                return null;
            }
            console.error('getGroupByPassword: Error fetching group by password:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return null;
        }

        if (!data) {
            console.log('getGroupByPassword: No data returned');
            return null;
        }

        console.log('getGroupByPassword: Found group:', data.id, data.name);

        return {
            id: data.id.toString(),
            name: data.name,
            members: data.members,
            isActive: data.is_active || false,
            groupPassword: data.group_password,
            createdAt: new Date(data.created_at),
            createdBy: data.creator_name || 'Unknown',
        };
    } catch (error) {
        console.error('Unexpected error in getGroupByPassword:', error);
        return null;
    }
};

/**
 * Ελέγχει αν ο logged-in user είναι μέλος ενός group
 * @param groupId - Το ID του group (ως string)
 * @returns true αν είναι μέλος, false αν όχι
 */
export const checkIfUserInGroup = async (groupId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return false;
        }

        // Μετατροπή string σε number για το query (γιατί στη βάση είναι BIGINT)
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            console.error('Invalid groupId:', groupId);
            return false;
        }

        const { data, error } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupIdNum)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not a member
                return false;
            }
            console.error('Error checking group membership:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('Unexpected error in checkIfUserInGroup:', error);
        return false;
    }
};

/**
 * Προσθέτει τον logged-in user σε ένα group
 * @param groupId - Το ID του group (ως string)
 * @returns true αν επιτυχής, false αν error
 */
export const addUserToGroup = async (groupId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No user found for addUserToGroup');
            return false;
        }

        console.log('addUserToGroup: Adding user', user.id, 'to group', groupId);

        // Έλεγχος αν είναι ήδη μέλος
        const isMember = await checkIfUserInGroup(groupId);
        if (isMember) {
            console.log('addUserToGroup: User is already a member of this group');
            return true; // Δεν είναι error, είναι ήδη μέλος
        }

        // Μετατροπή string σε number για το query
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            console.error('addUserToGroup: Invalid groupId:', groupId);
            return false;
        }

        console.log('addUserToGroup: Inserting into group_members...', {
            group_id: groupIdNum,
            user_id: user.id,
            is_active: true
        });

        const { data, error } = await supabase
            .from('group_members')
            .insert({
                group_id: groupIdNum,
                user_id: user.id,
                is_active: true,
                joined_at: new Date().toISOString(),
            })
            .select();

        if (error) {
            console.error('addUserToGroup: Error adding user to group:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return false;
        }

        console.log('addUserToGroup: Success! Inserted:', data);
        return true;
    } catch (error) {
        console.error('Unexpected error in addUserToGroup:', error);
        return false;
    }
};

/**
 * Join group με password
 * @param groupPassword - Το password του group
 * @returns Group object αν επιτυχής, null αν error
 */
export const joinGroup = async (groupPassword: string): Promise<Group | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No user found for joinGroup');
            alert('No user found. Please log in again.');
            return null;
        }

        console.log('JoinGroup: Looking for group with password:', groupPassword);

        // 1. Βρες το group από το password
        const group = await getGroupByPassword(groupPassword);
        if (!group) {
            console.error('JoinGroup: Group not found with password:', groupPassword);
            alert('Group not found. Please check the code and try again.');
            return null;
        }

        console.log('JoinGroup: Found group:', group.id, group.name);

        // 2. Έλεγχος αν είναι ήδη μέλος
        const isMember = await checkIfUserInGroup(group.id);
        if (isMember) {
            console.log('JoinGroup: User is already a member');
            alert(`You are already a member of "${group.name}"! Loading the group...`);
            return group; // Επιστρέφει το group αλλά δεν είναι error
        }

        // 3. Έλεγχος αν έχει φτάσει το όριο groups
        const { count, error: countError } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (countError) {
            console.error('JoinGroup: Error counting groups:', countError);
        }

        const MAX_GROUPS = 5;
        if ((count || 0) >= MAX_GROUPS) {
            console.log('JoinGroup: User has reached max groups limit:', count);
            alert(`You have reached the maximum limit of ${MAX_GROUPS} groups. Please leave a group before joining a new one.`);
            return null;
        }

        console.log('JoinGroup: Adding user to group...');

        // 4. Προσθήκη του user στο group
        const success = await addUserToGroup(group.id);
        if (!success) {
            console.error('JoinGroup: Failed to add user to group');
            alert('Error joining group. Please try again.');
            return null;
        }

        console.log('JoinGroup: Successfully joined group!');
        alert(`Successfully joined "${group.name}"!`);
        return group;
    } catch (error) {
        console.error('Unexpected error in joinGroup:', error);
        alert('An unexpected error occurred. Please try again.');
        return null;
    }
};

/**
 * Αφαιρεί τον logged-in user από ένα group
 * @param groupId - Το ID του group (ως string)
 * @returns true αν επιτυχής, false αν error
 */
export const leaveGroup = async (groupId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No user found for leaveGroup');
            alert('No user found. Please log in again.');
            return false;
        }

        console.log('leaveGroup: Removing user', user.id, 'from group', groupId);

        // Μετατροπή string σε number για το query
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            console.error('leaveGroup: Invalid groupId:', groupId);
            return false;
        }

        // 1. Ελέγχουμε αν υπάρχει record στο group_members
        const { data: existingMember } = await supabase
            .from('group_members')
            .select('id, is_active')
            .eq('group_id', groupIdNum)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingMember) {
            // Αν υπάρχει record, κάνουμε update το is_active σε false
            console.log('leaveGroup: Found existing member record, updating is_active to false');
            const { error: memberError } = await supabase
                .from('group_members')
                .update({ is_active: false })
                .eq('id', existingMember.id);

            if (memberError) {
                console.error('leaveGroup: Error updating group_members:', memberError);
            } else {
                console.log('leaveGroup: Successfully updated member record to is_active=false');
            }
        } else {
            // Αν δεν υπάρχει record, μπορεί να είναι creator
            // Προσθέτουμε record με is_active=false για να σηματοδοτήσουμε ότι έχει κάνει leave
            console.log('leaveGroup: No existing member record, inserting new record with is_active=false');
            const { error: insertError } = await supabase
                .from('group_members')
                .insert({
                    group_id: groupIdNum,
                    user_id: user.id,
                    is_active: false,
                    joined_at: new Date().toISOString(),
                });

            if (insertError) {
                console.error('leaveGroup: Error inserting group_members record:', insertError);
                // Continue even if this fails
            } else {
                console.log('leaveGroup: Successfully inserted member record with is_active=false');
            }
        }

        // 2. Διαγραφή των expenses του user από αυτό το group
        console.log('leaveGroup: Deleting user expenses from group', groupIdNum);
        const { data: deletedExpenses, error: expensesError } = await supabase
            .from('expenses')
            .delete()
            .eq('user_id', user.id)
            .eq('group_id', groupIdNum)
            .select();

        if (expensesError) {
            console.error('leaveGroup: Error deleting expenses:', expensesError);
            // Continue even if this fails
        } else {
            const deletedCount = deletedExpenses?.length || 0;
            console.log('leaveGroup: Successfully deleted', deletedCount, 'expenses from group');
        }

        // 3. Ενημέρωσε το group_data να μην έχει groupName (αν το group που αφήνει είναι το selected)
        const currentGroupData = await fetchGroupData();
        if (currentGroupData && currentGroupData.groupName) {
            // Βρες το group για να δεις αν είναι το ίδιο
            const { data: groupData } = await supabase
                .from('groups')
                .select('name')
                .eq('id', groupIdNum)
                .single();

            if (groupData && groupData.name === currentGroupData.groupName) {
                // Ενημέρωσε το group_data να καθαρίσει το groupName
                await upsertGroupData({
                    ...currentGroupData,
                    groupName: '',
                    activeUsers: 10,
                    totalGroupExpenses: 0.00,
                    userExpenses: 0.00,
                });
            }
        }

        console.log('leaveGroup: Successfully left group!');
        return true;
    } catch (error) {
        console.error('Unexpected error in leaveGroup:', error);
        alert('An unexpected error occurred while leaving the group. Please try again.');
        return false;
    }
};