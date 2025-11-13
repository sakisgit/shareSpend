
import { useState } from "react";
import GroupDetails from "./GroupDetails";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import TotalsSummary from "./TotalsSummary";

const MainData = () => {
  const [expenses, setExpenses]= useState<Array<
    {
      id:number,
      amount:string,
      description:string,
      category:string
    }>>([]); 

    const addExpense = (
      amount:string,
      description:string,
       category:string
    ) => {
      const newExpense = {
        id: Date.now(),
        amount: amount,
        description: description,
        category:category
      };

      setExpenses([ newExpense,...expenses]);
    };

    const clearExpenses = () => {
      setExpenses([]);
    };

    const deleteExpense = (id:number) => {
      setExpenses(expenses.filter(expense => expense.id!== id));
    };


  return (
    <>    

        {/* Top section Group Details */}
        <GroupDetails/>

        <div className="container mx-auto p-6">

            {/* Main middle section with two columns */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left div - Add Expenses */}
                <AddExpense onAddExpense={addExpense}/>

                {/* Right div - Expenses List */}
                <ExpenseList 
                  expenses={expenses}
                  onClearExpenses={clearExpenses}
                  onDeleteExpense={deleteExpense}
                />
            </div>
        </div>

        
        <div className="container mx-auto p-6">

            {/* Bottom section for totals */}
            <TotalsSummary/>
        </div>
    </>
  );
};

export default MainData;
