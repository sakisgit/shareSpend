

import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import CustomButton from "../../Buttons/CustomButton";

const BalanceSummary = () => {
    const [isVisible, setIsVisible]= useState(false);

    const {groupData, balance, userBalance} = useAppContext();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };


  return (
    <>
        {/* Bottom section for totals */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">
                        Balance Summary
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
                        {/* Total Group Expenses */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800">💰 Total Group Expenses:</h2>
                            <p className="text-gray-600">{groupData.totalGroupExpenses.toFixed(2)}€</p>
                        </div>
                        
                        {/* Overall total */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800">💰 Balance (per user):</h2>
                            <p className="text-gray-600">{balance.toFixed(2)}€</p>
                        </div>
                        

                        {/* Per user totals */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            {userBalance < 0 ? (
                                <>
                                    <h2 className="font-semibold text-gray-800">{groupData.nicknameUser} have to give to others users:</h2>
                                    <p className="text-gray-600">{userBalance.toFixed(2)}€</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="font-semibold text-gray-800">{groupData.nicknameUser} must take from the other users:</h2>
                                    <p className="text-gray-600">{userBalance.toFixed(2)}€</p>
                                </>
                            )}
                        </div>
                        
                    </div>
                )}
            </div>
    </>
  )
}

export default BalanceSummary;
