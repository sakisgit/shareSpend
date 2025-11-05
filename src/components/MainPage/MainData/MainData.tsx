
import CustomButton from "../../Buttons/CustomButton";

const MainData = () => {
  return (
    <>   
        <div className="container mx-auto p-6">

            {/* Top section for details of group */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                
                {/* Header title with icon */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Group Details</h1>
                    
                    {/* Static arrow button */}
                    <CustomButton 
                        color="gray"
                        size="sm"
                    >
                        ↑
                    </CustomButton>

                </div>

                {/* Group details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">
                    <div>
                        <h1 className="font-semibold">👤 Name of User:</h1>
                        <p className="text-gray-600">John Doe</p>
                    </div>

                    <div>
                        <h1 className="font-semibold">👥 Group:</h1>
                        <p className="text-gray-600">10 People</p>
                    </div>

                    <div>
                        <h1 className="font-semibold">🏷️ Nickname:</h1>
                        <p className="text-gray-600">"Team Alpha"</p>
                    </div>

                    <div>
                        <h1 className="font-semibold">📅 Current Date:</h1>
                        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                    </div>

                    <div>
                        <h1 className="font-semibold">💰 Total Paid:</h1>
                        <p className="text-gray-600">$0.00</p>
                    </div>

                    <div className="col-span-2 mt-4 flex space-x-2 justify-end">

                        <CustomButton 
                            color="red"
                            size="sm"    
                        >
                            Reset All
                        </CustomButton>
                            
                        <CustomButton
                            color="blue"
                            size="sm"
                        >
                            Change
                        </CustomButton>
                            
    
                    </div>
                </div>
            </div>
        </div>


        <div className="container mx-auto p-6">

            {/* Main middle section with two columns */}
            <div className="flex flex-col md:flex-row gap-8">

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
                            type="text"
                            id="Amount"
                            className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                            placeholder="Enter the amount"
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
                            className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                            placeholder="Enter some words"
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
                            className="w-full border border-gray-300 rounded-lg p-2"
                            placeholder="Enter category"
                        />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <CustomButton  
                            color="blue"
                        >
                            + Add Expense
                        </CustomButton>
                    </div>

                        
                </div>

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
                        <div className="flex-1 text-center text-gray-400 animate-bounce text-sm">
                            ↓ Scroll for more
                        </div>

                        {/* Right button */}
                        <div className="text-right">
                            <CustomButton
                                color="red" 
                                size="sm"
                            >
                                Clear List
                            </CustomButton>
                        </div>

                    </div>

                    {/* Scrollable items area */}
                    <div className="overflow-y-auto mt-4 space-y-4 pr-2">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user1: 50$ - - supermarket date
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user2: 50$ - - supermarket date
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user3: 50$ - - supermarket date
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user4: 50$ - - supermarket date
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user5: 50$ - - supermarket date
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            Name of user6: 50$ - - supermarket date
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <div className="container mx-auto p-6">

            {/* Bottom section for totals */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                <h1 className="text-xl font-bold mb-4 text-gray-800">
                    Total Expenses Summary
                </h1>

                {/* Totals container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                
                    {/* Overall total */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">💰 Total Expenses:</h2>
                        <p className="text-gray-600">$350.00</p>
                    </div>

                    {/* Per user totals */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User1 Expenses:</h2>
                        <p className="text-gray-600">$120.00</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User2 Expenses:</h2>
                        <p className="text-gray-600">$80.00</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User3 Expenses:</h2>
                        <p className="text-gray-600">$150.00</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default MainData;
