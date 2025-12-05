
import { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import CustomButton from "../../Buttons/CustomButton";


const GroupDetails = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        groupData, 
        selectedGroup,
        updateGroupData,
        resetAll,
        groups
    } = useAppContext();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

     // Function για να μπεις σε edit mode
    const handleChange = () => {
        setIsEditMode(true);
    };

    // Function για να αποθηκεύσεις τις αλλαγές
    const handleSave = () => {
        // Εδώ κάνεις validation
        if(!groupData.userName || groupData.userName.length === 0){
            alert('Please enter user name');
            return;
        }

        if(groupData.userName.length>28){
            alert('User name must be max 28 characters!');
            return;
        };
        if ( groupData.nicknameUser.length>12) {
            alert('Nick name must be max 12 characters!');
            return;
        };

        if (groupData.groupName.length>18){
            alert('Group name must be max 18 characters!');
            return;
        };

    
        // ✅ Validation για activeUsers - convert to number
        const activeUsersNum = typeof groupData.activeUsers === 'string' 
            ? parseInt(groupData.activeUsers) 
            : groupData.activeUsers;
        
        if(!groupData.activeUsers || isNaN(activeUsersNum) || activeUsersNum < 2 || activeUsersNum > 10){
            alert('The number of active users must be between 2 up to 10');
            return;
        }
        
        if(
            groupData.totalGroupExpenses <0.00 ||
            groupData.totalPaid<0.00 ||
            groupData.userExpenses< 0.00
        ) {
            alert('Expenses or Paid cant be negatives');
            return;
        }

        // και να στείλεις στο backend αν χρειάζεται

        updateGroupData(groupData);  // Αποθήκευσε όλα τα δεδομένα
        setIsEditMode(false);
        // Μπορείς να προσθέσεις alert ή notification
        alert("Changes saved!");
    };

    // Function για να ακυρωσεις
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Changes will be lost.')) {
            setIsEditMode(false);

        };
    };

    // Function για να αλλάζεις τα values
    const handleInputChange = (field: string, value: string) => {

        let newValue: any;
        if(field === 'activeUsers') {
            const num = parseInt(value) || 2;
            newValue = num;
        } else if (
            field === 'totalGroupExpenses' ||
            field === 'totalPaid' ||
            field === 'userExpenses'
        ) {
            if(
                value === '' ||
                value === '.' ||
                value === ','
            ){
                newValue = value;
            } else {
                let normalizedValue = value.replace(',', '.');
                const parts = normalizedValue.split('.');
                
                if (parts.length > 1) {
                    if (parts[1].length > 2) {
                        normalizedValue = parts[0] + '.' + parts[1].substring(0, 2);
                    }
                }
            
                const num = parseFloat(normalizedValue) || 0;
                newValue = num;
            }
        } else {
            // για Strings
            newValue = value;
        }     

        // Χρησιμοποίησε το updateGroupData
        updateGroupData({ [field]: newValue });
    };

    // Function για να κανεις Reset All
    const handleResetAll = async () => {
        if (window.confirm('Are you sure you want to reset all data ?')) {
            await resetAll();
            setIsEditMode(false);
        }; 
    };

    // Έλεγχος αν υπάρχει valid group
    const hasValidGroup = selectedGroup !== null && groupData.groupName !== '' && 
                          groups.some(g => g.id === selectedGroup.id);

  return (
    <div className="container mx-auto p-6">

            {/* Top section Group Details */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                
                {/* Header title with icon */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Group Details</h1>
                    
                    <CustomButton 
                        color="gray"
                        size="sm"
                        onClick={toggleVisibility}
                    >
                        {isVisible ? "↑ Hide" : "↓ Show" }
                    </CustomButton>

                </div>

                {/* Group details grid */}
                {isVisible && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-700">

                        {/* Name of User */}
                        <div>
                            <h1 className="font-semibold">👤 Name of User:</h1>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={groupData.userName}
                                    onChange={(e)=> handleInputChange('userName',e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                                    placeholder='John Doe'
                                />
                            ) : (
                                <p className="text-gray-600">{groupData.userName}</p>
                            )}
                        </div>

                        {/* Nickname of User */}
                        <div>
                            <h1 className="font-semibold">🏷️ Nickname of User:</h1>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={groupData.nicknameUser}
                                    onChange={(e)=> handleInputChange('nicknameUser',e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                                    placeholder="Iron Man"
                                />
                            ) : (
                                <p className="text-gray-600">{groupData.nicknameUser}</p>
                            )}
                        </div>

                        {/* Group Name */}
                        <div>
                            <h1 className="font-semibold">🏷️ Group Name:</h1>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={groupData.groupName}
                                    onChange={(e)=> handleInputChange('groupName',e.target.value)}
                                    className={`w-full border border-gray-300 rounded-lg p-2 mt-1 ${!hasValidGroup ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Team Alpha"
                                    disabled={!hasValidGroup}
                                />
                            ) : (
                                <p className="text-gray-600">{groupData.groupName || 'No group selected'}</p>
                            )}
                        </div>

                        {/* Group Password */}
                        <div>
                            <h1 className="font-semibold">🔑 Group Password:</h1>
                            <p className="text-gray-600">
                                {selectedGroup?.groupPassword || 'N/A'}
                            </p>
                        </div>

                        {/* Active Users */}
                        <div>
                            <h1 className="font-semibold">👥 Active Users:</h1>
                            {isEditMode ? (
                                <input
                                    type="number"
                                    min='2'
                                    max='10'
                                    value={groupData.activeUsers}
                                    onChange={(e)=> handleInputChange('activeUsers',e.target.value)}
                                    className={`w-full border border-gray-300 rounded-lg p-2 mt-1 ${!hasValidGroup ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="10"
                                    disabled={!hasValidGroup}
                                />
                            ) : (
                                <p className="text-gray-600">{groupData.activeUsers}</p>
                            )}
                        </div>

                        <div>
                            <h1 className="font-semibold">📅 Current Date:</h1>
                            <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                        </div>
                        
                        {/* Total Group Expenses */}
                        <div>
                            <h1 className="font-semibold">💰 Total Group Expenses:</h1>
                            <p className="text-gray-600">{groupData.totalGroupExpenses.toFixed(2)} €</p>
                        </div>

                        {/* Total Paid of User */}
                        <div>
                            <h1 className="font-semibold">💰 Total Paid:</h1>
                            <p className="text-gray-600">{groupData.totalPaid.toFixed(2)} €</p>
                        </div>

                        {/* User Expenses */}
                        <div>
                            <h1 className="font-semibold">💰 User Expenses:</h1>
                            <p className="text-gray-600">{groupData.userExpenses.toFixed(2)} €</p>
                        </div>
                        
                        {/* Buttons */}
                        <div className="col-span-2 mt-4 flex space-x-2 justify-end">
                            {isEditMode ? (
                                    <>
                                        <CustomButton
                                            color='red'
                                            size='sm'
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </CustomButton>

                                        <CustomButton
                                            color='green'
                                            size='sm'
                                            onClick={handleSave}
                                        >
                                            Save
                                        </CustomButton>
                                    </>
                                ) : (
                                    <>
                                        <CustomButton 
                                            color="red"
                                            size="sm"
                                            onClick={handleResetAll}  
                                        >
                                            Reset All
                                        </CustomButton>
                                            
                                        <CustomButton
                                            color="blue"
                                            size="sm"
                                            onClick={handleChange}
                                        >
                                            Change
                                        </CustomButton>
                                    </>
                            )}    
        
                        </div>
                    </div>
                )}
            </div>
    </div>
  )
}

export default GroupDetails