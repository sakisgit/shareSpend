
import { useState } from "react";
import CustomButton from "../../Buttons/CustomButton";

const TotalsSummary = () => {
    const [isVisible, setIsVisible]= useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

  return (
    <>
        {/* Bottom section for totals */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">
                        Total Expenses Summary
                    </h1>
                    <CustomButton
                        onClick={toggleVisibility}
                        color="gray"
                        size="sm"
                    >
                        {isVisible ? "↑ Hide" : "↓ Show"}
                    </CustomButton>
                </div>

                {isVisible && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        {/* Overall total */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800">💰 Total Group Expenses:</h2>
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
                )}
            </div>
    </>
  )
}

export default TotalsSummary
