
import CustomButton from "../../Buttons/CustomButton"

const GroupDetails = () => {
  return (
    <div className="container mx-auto p-6">

            {/* Top section Group Details */}
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
  )
}

export default GroupDetails