
import { useState } from "react";
import CustomButton from "../../Buttons/CustomButton";

interface AddExpenseProps {
    onAddExpense: (
        amount: string, 
        description: string, 
        category: string
    ) =>Promise<void>;
};

const AddExpense = ({onAddExpense}: AddExpenseProps) => {
    const [amount,setAmount]= useState('');
    const [description, setDescription]= useState('');
    const [category, setCategory] = useState('');

    const handleAmountChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        value = value.replace(',', '.');
        
        const parts = value.split('.');
        
        // Αν έχει δεκαδικά (περισσότερα από 1 μέρη)
        if (parts.length > 1) {
            // Κόψε τα δεκαδικά σε 2 ψηφία
            if (parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
            };
        };
        
        setAmount(value);
    };


    const handleAddExpense = async () =>{

        if(
            category.length===0 || 
            description.length===0 ||
            amount.length===0 
        ) {
            alert('You have to coplete all fields.')
            return;
        } else if(description.length>30){
            alert('The description field must be up to 30 character.');
            return;
        } else if (category.length>20){
            alert('The text of category must to have up to 20 characters.');
            return;
        } else {

            // Κάνε normalize το amount (αν έχει κόμμα)
            const normalizedAmount = amount.replace(',', '.');
            const amountNumber = Number(normalizedAmount);
            
            if(amountNumber <= 0 || isNaN(amountNumber)){
                alert('The amount must be grater than 0.00');
                return;
            };
        };

        await onAddExpense(amount, description, category);
        alert('Expense added to list !');
        
        setAmount('');
        setDescription('');
        setCategory('');
    };
  return (
    <>
                {/* Left div - Add Expenses */}
                <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-2xl">
                    <h1 className="text-xl font-bold mb-4">
                        Add Expenses
                    </h1>
                    <div className="mb-4 text-left">
                        <label 
                            className="block mb-1 font-semibold" 
                            htmlFor="Amount"
                        >
                            Amount
                        </label>
                        <input
                            type='text'
                            id="Amount"
                            value={amount}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                            placeholder="Enter the amount"
                            onChange={handleAmountChange}
                        />

                        <label 
                            className="block mb-1 font-semibold" 
                            htmlFor="Description"
                        >
                            Description
                        </label>
                        <input
                            type="text"
                            id="Description"
                            value={description}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                            placeholder="Enter some words"
                            onChange={(e)=> setDescription(e.target.value)}
                        />

                        <label 
                            className="block mb-1 font-semibold" 
                            htmlFor="Category"
                        >
                            Category
                        </label>
                        <input
                            type="text"
                            id="Category"
                            value={category}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            placeholder="Enter category"
                            onChange={(e)=> setCategory(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <CustomButton  
                            color="blue"
                            size='md'
                            onClick={handleAddExpense}
                        >
                            + Add Expense
                        </CustomButton>
                    </div>

                        
                </div>
    </>
  )
}

export default AddExpense