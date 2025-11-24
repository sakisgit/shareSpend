
import { useState } from "react";
import CustomButton from "../../../../Buttons/CustomButton";

interface CreateGroupModalProps {
    isOpen:boolean,
    onClose: () => void,
    onCreate: (groupName: string, activeUsers: number) => void;
};

const CreateGroupModal = ({
    isOpen,
    onClose,
    onCreate
}: CreateGroupModalProps) => {
    const [groupName, setGroupName] = useState('');
    const [activeUsers, setActiveUsers] = useState(2); 

    if(!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(groupName.trim()) {
            onCreate(groupName.trim(),activeUsers);
            setGroupName('');
            setActiveUsers(2);
            onClose();
        };
    };

    // Handle button click (όταν κάνει click στο Create button)
    const handleButtonClick = () => {
        if (groupName.trim() && activeUsers >= 2 && activeUsers <= 10) {
            onCreate(groupName.trim(), activeUsers);
            setGroupName('');
            setActiveUsers(2);
            onClose();
        };
    };

    const handleClose = () => {
        if(window.confirm('Are you sure?')){
            setGroupName('');
            setActiveUsers(2);
            onClose();
        };
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Create New Group
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Group Name
                    </label>

                    <input
                        type="text"
                        value={groupName}
                        placeholder="Enter group name"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e)=> setGroupName(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Number of Members
                    </label>
                    <input
                        type="number"
                        min="2"
                        max="10"
                        value={activeUsers}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 2;
                            if (value >= 2 && value <= 10) {
                            setActiveUsers(value);
                            }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Between 2 and 10 members
                    </p>
                </div>

                <div className="flex gap-2 justify-end">
                    <CustomButton
                        color='red'
                        size="sm"
                        onClick={handleClose}
                    >
                       Cancel
                    </CustomButton>

                    <CustomButton
                        color='blue'
                        size="sm"
                        onClick={handleButtonClick}
                    >
                       Create
                    </CustomButton>
                </div>

            </form>
        </div>
    </div>
  )
}

export default CreateGroupModal;