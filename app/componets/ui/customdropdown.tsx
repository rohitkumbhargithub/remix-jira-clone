import { useState } from 'react';

export const CustomDropdown = ({ workspaces }) => {
    const [selectedWorkspace, setSelectedWorkspace] = useState("");

    const handleSelect = (workspace) => {
        setSelectedWorkspace(workspace);
    };

    return (
        <div className="relative">
            <button className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                {selectedWorkspace.name || "Select a workspace"}
            </button>
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white border border-gray-300 shadow-lg">
                {workspaces.map((workspace) => (
                    <div
                        key={workspace.id}
                        onClick={() => handleSelect(workspace)}
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                    >
                        <img
                            src={workspace.imageUrl}
                            alt={workspace.name}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <h2 className="font-medium text-gray-800">{workspace.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
