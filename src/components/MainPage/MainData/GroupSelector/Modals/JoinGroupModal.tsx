
import { useState } from "react";
import CustomButton from "../../../../Buttons/CustomButton";

interface JoinGroupModalProps {
    isOpen:boolean;
    onClose: () => void;
    onJoin: (code:string) => void;
};

const JoinGroupModal = ({
    isOpen,
    onClose,
    onJoin
}: JoinGroupModalProps ) => {
    const [joinCode, setJoinCode]= useState('');

    if(!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (joinCode.trim()) {
            onJoin(joinCode.trim().toUpperCase());
            setJoinCode('');
            onClose();
        };
    };  

    const handleButtonClick = () => {
         if (joinCode.trim()) {
            onJoin(joinCode.trim().toUpperCase());
            setJoinCode('');
            onClose();
        };
    };

    const handleClose = () => {
            setJoinCode('');
            onClose();
    };
        

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Join Group
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Enter Group Code
                        </label>

                        <input
                            type="text"
                            value={joinCode}
                            placeholder="Add Code ex 'ABC-1.23'"
                            maxLength={10}
                            autoFocus
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e)=> setJoinCode(e.target.value.toUpperCase())}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Ask the group owner for the invite code
                        </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <CustomButton
                            color="red"
                            size="sm"
                            onClick={handleClose}
                        >
                            Cancel
                        </CustomButton>

                        <CustomButton
                            color="blue"
                            size="sm"
                            onClick={handleButtonClick}
                        >
                            Join Group
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default JoinGroupModal;