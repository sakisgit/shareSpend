import CustomButton from "../../Buttons/CustomButton"

const ExpenseList = () => {
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
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                           <span>Name of user1: 50$ - - supermarket date</span>
                            <CustomButton 
                                color="red"
                                size="sm"
                            >
                                x
                            </CustomButton>
                            
                        </div>
                    </div>
                </div>
    </>
  )
}

export default ExpenseList