
import { useState } from "react";
import CustomButton from "../../../Buttons/CustomButton";
import CreateGroupModal from "./Modals/CreateGroupModal";
import JoinGroupModal from "./Modals/JoinGroupModal";
import LeaveGroupModal from "./Modals/LeaveGroupModal";

interface Group {
    id:Date Now(),
    name:string,
    members:number,
    isActive?: boolean;
};

const GroupSelector = () => {
    const [groups, setGroups] = useState<Group[]>([
    // Mock data για τώρα - θα αντικατασταθεί με real data
    { id: '1', name: 'Trip to Greece', isActive: true,members:2 },
    { id: '2', name: 'Weekend Trip', isActive: false, members:5 },
    { id: '3', name: 'Family Expenses', isActive: false, members:10 },
  ]);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreateGroup = (groupName:string, activeUsers:number) => {
         // TODO: Call API to create group
        console.log('Creating group:', groupName);

        const newGroup: Group = {
            id:Date.now().toString(),
            name:groupName,
            members:activeUsers,
            isActive: false,
        };

        setGroups(prev=> [...prev, newGroup]);
    };
  
  return (
    <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-2xl">

             {/* Header */}
             <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    My Groups
                </h1>

                <div className="flex gap-2">
                    <CustomButton
                        color="green"
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Create Group
                    </CustomButton>

                    <CustomButton
                        color="blue"
                        size="sm"
                    >
                        → Join Group
                    </CustomButton>

                     <CustomButton
                        color="red"
                        size="sm"
                    >
                        ← Leave Group
                    </CustomButton>

                </div>
             </div>

             {/* Groups List */}
             <div className="space-y-2">
                {groups.length===0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <p>No groups yet. Create your first group!</p>
                    </div>
                ) : (
                    groups.map((group)=> (
                        <div
                            key={group.id}
                            className="p-4 rounded-lg cursor-pointer transition-all 
                            ${group.isActive 
                                ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }"
                        >
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`
                                w-3 h-3 rounded-full
                                ${group.isActive ? 'bg-blue-500' : 'bg-gray-300'}
                                `}></div>
                                <span className={`font-semibold ${group.isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                {group.name}
                                </span>
                                <span className={`font-semibold ${group.isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                {group.members}
                                </span>
                                {group.isActive && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    Active
                                </span>
                                )}
                            </div>
                            </div>
                            
                        </div>
                    ))
                )}
             </div>

        </div>

        {/* Modals */}
        <CreateGroupModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateGroup}
        />

        <JoinGroupModal/>

        <LeaveGroupModal/>
    </div>
  )
}

export default GroupSelector;