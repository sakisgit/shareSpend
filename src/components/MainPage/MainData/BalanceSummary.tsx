

import { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import CustomButton from "../../Buttons/CustomButton";

const BalanceSummary = () => {
    const [isVisible, setIsVisible]= useState(false);

    const {groupData, balance, userBalance, settleBalance} = useAppContext();

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
                       
                        {/* Div 1: Balance of Group */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800">💰 Balance of {groupData.groupName}:</h2>
                            <p className="text-gray-600">{balance.toFixed(2)} €</p>
                        </div>

                        {/* Div 2: Balance Per User (με +/-) */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800">💰 Balance {groupData.nicknameUser}:</h2>
                            <p className="text-gray-600">{balance.toFixed(2)} €</p>
                        </div>
                        

                        {/* Div 3: User Balance με Check Button */}
                        <div  className={`p-4 rounded-lg shadow-inner col-span-1 sm:col-span-2 ${userBalance < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                           <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-gray-800">Your Balance:</h2>
                                    <p className="text-gray-600">{userBalance > 0 ? '+' : ''}{userBalance.toFixed(2)} €</p>
                                </div>

                                {userBalance < 0 ?(
                                        <CustomButton
                                        color="green"
                                        size="sm"
                                        onClick={ async() => {
                                            if(window.confirm('Settle balance? This will clear all expenses and update total paid.')){
                                                 await settleBalance();
                                                alert('Balance settled! All expenses cleared.');
                                            }
                                        }}
                                    >
                                        ✓ Gave Money
                                    </CustomButton>
                                ) : (
                                    <CustomButton
                                        color="green"
                                        size="sm"
                                        onClick={async () => {
                                            if(window.confirm('Settle balance? This will clear all expenses and update total paid.')){
                                                await settleBalance();
                                                alert('Balance settled! All expenses cleared.');
                                            }
                                        }}
                                    >
                                        ✓ Got Money
                                    </CustomButton>
                            )}
                                
                           </div>
                        </div>
                        
                    </div>
                )}
            </div>
    </>
  )
}

export default BalanceSummary;
