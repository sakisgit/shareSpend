

import CustomButton from "../../Buttons/CustomButton";

interface ExpenseListProps {
    expenses: Array<{
        id: number;
        amount: string;
        description: string;
        category: string;
    }>;
    onClearExpenses: () => void;
    onDeleteExpense: (id:number)=> void;
};

const ExpenseList = ({
        expenses,
        onClearExpenses,
        onDeleteExpense,
    }:ExpenseListProps) => {

    const handleClearList=() => {
        if (window.confirm('Are you sure you want to clear all expenses?')) {
            onClearExpenses();
        };
    };

    const handleDelete = (id:number) => {
        if(window.confirm('Are you sure you want to delete that expense?')){
            onDeleteExpense(id);
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
                                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                            >
                                <p>
                                    <h1>userName - <span>Date</span></h1>
                                    <span>  {expense.category} - {expense.amount}€ </span>
                                    <h1>{expense.description}</h1>
                                </p>
                                <div className="flex gap-2">
                                    <CustomButton
                                        color="green"
                                        size="sm"
                                    >
                                        ✓
                                    </CustomButton>
                                    <CustomButton 
                                        color="red"
                                        size="sm"
                                        onClick={() => handleDelete(expense.id)}
                                    >
                                        x
                                    </CustomButton>
                                </div>
                            </div>
                            )
                            )}
                    </div>
                </div>
    </>
  )
}

export default ExpenseList