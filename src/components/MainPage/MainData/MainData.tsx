
import { useAppContext } from "../../context/AppContext";
import GroupDetails from "./GroupDetails";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import TotalsSummary from "./TotalsSummary";

const MainData = () => {
  const { addExpense } = useAppContext();

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
                <ExpenseList />
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
