
import React, { useState } from "react";
import CustomButton from "../../../Buttons/CustomButton";
import CreateGroupModal from "./Modals/CreateGroupModal";
import JoinGroupModal from "./Modals/JoinGroupModal";
import LeaveGroupModal from "./Modals/LeaveGroupModal";

interface Group {
    id:string,
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
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedGroup, setSelectedGroup]= useState<Group | null>(null);

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

    const handleJoinGroup = (code: string) => {
        // TODO: Call API

        alert('You joined the group!'); 
    };

    const handleLeaveGroup = () => {
        if (selectedGroup) {
            // TODO: Call API
            setGroups(prev => prev.filter(g => g.id !== selectedGroup.id));
            setSelectedGroup(null);
            alert('You left the group!');
        };
    };

    const handleSelectGroup = (groupId: string) => {
        setGroups(prev => 
            prev.map(g => ({ ...g, isActive: g.id === groupId }))
        );
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
                        onClick={()=>setShowJoinModal(true)}
                    >
                        → Join Group
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
                            onClick={(e) => {
                                if ((e.target as HTMLElement).closest('button')) {
                                    return;
                                }
                                handleSelectGroup(group.id);
                            }} 
                            className={`p-4 rounded-lg cursor-pointer transition-all 
                                ${group.isActive 
                                ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`} 
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
                                <span className="text-xs bg-blue-100 text-green-600 px-2 py-1 rounded-full">
                                    Active
                                </span>
                                )}
                            </div>
                            {group.isActive && (
                                <CustomButton
                                    color="red"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedGroup(group);
                                        setShowLeaveModal(true);
                                    }}
                                >
                                    ← Leave
                                </CustomButton>
                            )}
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

        <JoinGroupModal
            isOpen={showJoinModal}
            onClose={()=> setShowJoinModal(false)}
            onJoin={handleJoinGroup}
        />

        <LeaveGroupModal
            isOpen={showLeaveModal}
            onClose= {()=> {
                setShowLeaveModal(false);
                setSelectedGroup(null);
            }}  
            onLeave={handleLeaveGroup}
            groupName={selectedGroup?.name || ''}
        />
    </div>
  )
}

export default GroupSelector;