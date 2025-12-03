
import { useState, useEffect } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import CustomButton from "../../../Buttons/CustomButton";
import CreateGroupModal from "./Modals/CreateGroupModal";
import JoinGroupModal from "./Modals/JoinGroupModal";
import LeaveGroupModal from "./Modals/LeaveGroupModal";

const GroupSelector = () => {
    const {
        groups,
        selectedGroup,
        createNewGroup,
        selectGroup,
        loadGroups,
        joinGroup,
        leaveGroup,
    } = useAppContext();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const MAX_GROUPS = 5;

    // Φόρτωσε τα groups όταν mount το component
    useEffect(() => {
        loadGroups();
    }, []);

    const handleCreateGroup = async (groupName: string, activeUsers: number) => {
        await createNewGroup(groupName, activeUsers);
        setShowCreateModal(false);
    };

    const handleJoinGroup = async (code: string) => {
        // ✅ Ενημέρωση: Καλεί το joinGroup από AppContext
        await joinGroup(code);
        setShowJoinModal(false);
    };

    const handleLeaveGroup = async () => {
        if (selectedGroup) {
            await leaveGroup(selectedGroup.id);
            setShowLeaveModal(false);
        };
    };

    const handleSelectGroup = (groupId: string) => {
        selectGroup(groupId);
    };
  
  return (
    <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-2xl">

             {/* Header */}
             <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    My Groups
                </h1>

                <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500">
                        {groups.length} / {MAX_GROUPS} groups
                    </span>
                    <CustomButton
                        color="green"
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                        disabled={groups.length >= MAX_GROUPS}
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
                                ${selectedGroup?.id === group.id
                                ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`} 
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2 flex-1">
                                    {/* Top row: Name and badges */}
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-3 h-3 rounded-full
                                            ${selectedGroup?.id === group.id ? 'bg-blue-500' : 'bg-gray-300'}
                                        `}></div>
                                        <span className={`font-semibold ${selectedGroup?.id === group.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {group.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({group.members} members)
                                        </span>
                                        {selectedGroup?.id === group.id && (
                                            <span className="text-xs bg-blue-100 text-green-600 px-2 py-1 rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Bottom row: Date and Created by */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 ml-6">
                                        {group.createdAt && (
                                            <span className="flex items-center gap-1">
                                                📅 {new Date(group.createdAt).toLocaleDateString('el-GR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                        {group.createdBy && (
                                            <span className="flex items-center gap-1">
                                                👤 Created by: {group.createdBy}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedGroup?.id === group.id && (
                                    <CustomButton
                                        color="red"
                                        size="sm"
                                        onClick={() => {
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
            currentGroupsCount={groups.length}
            maxGroups={5}
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
            }}  
            onLeave={handleLeaveGroup}
            groupName={selectedGroup?.name || ''}
        />
    </div>
  )
}

export default GroupSelector;