
import { useState } from "react";
import CustomButton from "../../../../Buttons/CustomButton";

interface LeaveGroupModalProps {
    isOpen:boolean,
    onClose: () => void;
    onLeave: () => void;
    groupName: string
};

const LeaveGroupModal = ({
    isOpen,
    groupName,
    onLeave,
    onClose
}: LeaveGroupModalProps) => {

    if(!isOpen) return null;

    const handleLeave = () => {
        onLeave();
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Leave Group
            </h2>

            <div className="mb-6">
                <p className="text-gray-700 mb-2">
                    Are you sure you want to leave <strong className="text-blue-600">"{groupName}"</strong>?
                </p>
                <p className="text-sm text-gray-500">
                    You will lose access to all group expenses and data. This action cannot be undone.
                </p>
            </div>

            <div className="flex gap-2 justify-end">
                <CustomButton
                    color='red'
                    size='sm'
                    onClick={onClose}
                >   
                    Cancel
                </CustomButton>

                <CustomButton
                    color="gray"
                    size="sm"
                    onClick={handleLeave}
                >
                    Leave Group
                </CustomButton>
            </div>

        </div>
    </div>
  )
}

export default LeaveGroupModal;