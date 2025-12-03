

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
                       
                        {/* Div 1: Average Expense Per Person */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800 mb-1">💰 Average Per Person</h2>
                            <p className="text-xs text-gray-500 mb-2">Total expenses divided by {groupData.activeUsers} members</p>
                            <p className="text-2xl font-bold text-gray-800">{balance.toFixed(2)} €</p>
                            <p className="text-xs text-gray-500 mt-1">in {groupData.groupName}</p>
                        </div>

                        {/* Div 2: Your Total Expenses */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h2 className="font-semibold text-gray-800 mb-1">📊 Your Total Expenses</h2>
                            <p className="text-xs text-gray-500 mb-2">Sum of all expenses you added</p>
                            <p className="text-2xl font-bold text-gray-800">{groupData.userExpenses.toFixed(2)} €</p>
                            <p className="text-xs text-gray-500 mt-1">by {groupData.nicknameUser || 'You'}</p>
                        </div>
                        

                        {/* Div 3: Your Balance με Check Button */}
                        <div  className={`p-4 rounded-lg shadow-inner col-span-1 sm:col-span-2 ${userBalance < 0 ? 'bg-red-50 border-2 border-red-200' : userBalance > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                           <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h2 className="font-semibold text-gray-800 mb-1">
                                        {userBalance < 0 ? '🔴 You Owe' : userBalance > 0 ? '🟢 You Are Owed' : '⚪ Balanced'}
                                    </h2>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {userBalance < 0 
                                            ? `You need to pay ${Math.abs(userBalance).toFixed(2)} € to balance expenses`
                                            : userBalance > 0
                                            ? `Others owe you ${userBalance.toFixed(2)} €`
                                            : 'Your expenses match the group average'}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {userBalance > 0 ? '+' : ''}{userBalance.toFixed(2)} €
                                    </p>
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
