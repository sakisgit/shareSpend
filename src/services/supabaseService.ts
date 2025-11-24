
import { supabase } from '../supabaseClient/supabaseClient';
import { Expense, GroupData } from '../types/types';

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

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        group_data_id: groupData?.id,
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