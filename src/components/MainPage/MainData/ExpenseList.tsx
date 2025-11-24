
import { useAppContext } from "../../context/AppContext";
import CustomButton from "../../Buttons/CustomButton";


const ExpenseList = () => {
    const { 
        expenses, 
        clearExpenses, 
        deleteExpense,
        checkExpense
    } = useAppContext();

    const handleClearList=async () => {
        if (window.confirm('Are you sure you want to clear all expenses?')) {
            await clearExpenses();
        };
    };

    const handleDelete = async (id:number) => {
        if(window.confirm('Are you sure you want to delete that expense?')){
            await deleteExpense(id);
            alert('Expense deleted successfully!');
        }
    };

    const handleCheck = async (id: number) => {
        const expense = expenses.find(exp => exp.id === id);
        if (expense) {
            const amountNumber = parseFloat(expense.amount);
            if(window.confirm(`Did ${expense.userName} pay ${amountNumber}€?`)){
                await checkExpense(id);
                alert(`${expense.userName} gave ${amountNumber}€. Balance updated!`);
            }
        }
    };

  return (
    <>
        {/* Right div - Expenses List */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-2xl flex flex-col max-h-96">
            
                    {/* Header row */}
                    <div className="flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-200 pb-2">
                        <h1 
                            className="text-xl font-bold text-left flex-none"
                        >
                            Expenses List
                        </h1>

                        {/* Center text */}
                        {expenses.length >= 2  && (
                            <div className="flex-1 text-center text-gray-400 animate-bounce text-sm">
                                ↓ Scroll for more
                            </div>
                        )}

                        {/* Right button */}
                        {expenses.length>0 && (
                            <div className="text-right">
                                <CustomButton
                                    color="red" 
                                    size="sm"
                                    onClick={handleClearList}
                                >
                                    Clear List
                                </CustomButton>
                            </div>
                        )}

                    </div>

                    {/* Scrollable items area */}
                    <div className="overflow-y-auto mt-4 space-y-4 pr-2">
                        {expenses.length===0 ? (
                             <div className="text-center text-gray-400 py-8">
                                No expenses yet. Add your first expense!
                            </div>
                        ):
                        (expenses.map((expense)=>
                            <div 
                                key={expense.id}
                                className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Left side - Expense Info */}
                                    <div className="flex-1">
                                        {/* Header row - User and Date */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                    {expense.userName || 'Unknown'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {expense.date ? expense.date.toLocaleDateString('el-GR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Description */}
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {expense.description}
                                        </h3>
                                        
                                        {/* Category and Amount */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                {expense.category}
                                            </span>
                                            <span className="text-lg font-bold text-red-600">
                                                -{expense.amount}€
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Right side - Action Buttons */}
                                    <div className="flex gap-2 ml-4">
                                        <CustomButton
                                            color="green"
                                            size="sm"
                                            onClick={() => handleCheck(expense.id)}
                                        >
                                            ✓
                                        </CustomButton>
                                        <CustomButton 
                                            color="red"
                                            size="sm"
                                            onClick={() => handleDelete(expense.id)}
                                        >
                                            ×
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
        </div>
    </>
  )
};

export default ExpenseList;