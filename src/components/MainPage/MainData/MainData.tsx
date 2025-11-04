
const MainData = () => {
  return (
    <>   
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
                </div>

                {/* Right div - Expenses List */}
                <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-2xl">
                    <h1 className="text-xl font-bold mb-4">Expenses List</h1>
                    {/* Εδώ μπορείς να βάλεις table ή list */}
                </div>
            </div>
        </div>

        <div className="container mx-auto p-6">
            {/* Bottom section for totals */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                <h1 className="text-lg font-semibold mb-2">
                Total Expenses:
                </h1>
                <h1 className="text-lg font-semibold">
                User Expenses:
                </h1>
            </div>
        </div>

    </>

  );
};

export default MainData;
