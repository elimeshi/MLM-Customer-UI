import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Component for a nicer look
const CustomNode = ({ data }) => {
    return (
        <div className="px-4 py-2 shadow-xl rounded-lg bg-gray-800 border-2 border-indigo-500 min-w-[150px] text-center">
            <div className="font-bold text-gray-200">{data.label}</div>
            <div className="text-xs text-gray-400">{data.status}</div>
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

const initialNodes = [
    // Root
    { id: '1', type: 'custom', position: { x: 400, y: 0 }, data: { label: 'You (Root)', status: 'Active' } },

    // Level 1
    { id: '2', type: 'custom', position: { x: 200, y: 150 }, data: { label: 'User A', status: 'Active' } },
    { id: '3', type: 'custom', position: { x: 600, y: 150 }, data: { label: 'User B', status: 'Inactive' } },

    // Level 2 (from A)
    { id: '4', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'User A1', status: 'Active' } },
    { id: '5', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'User A2', status: 'Active' } },

    // Level 2 (from B)
    { id: '6', type: 'custom', position: { x: 500, y: 300 }, data: { label: 'User B1', status: 'Active' } },
    { id: '7', type: 'custom', position: { x: 700, y: 300 }, data: { label: 'User B2', status: 'Active' } },

    // Level 3 (Just a few to show depth)
    { id: '8', type: 'custom', position: { x: 50, y: 450 }, data: { label: 'User A1-a', status: 'Active' } },
    { id: '9', type: 'custom', position: { x: 150, y: 450 }, data: { label: 'User A1-b', status: 'Inactive' } },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#6366f1' } },

    { id: 'e2-4', source: '2', target: '4', style: { stroke: '#4b5563' } },
    { id: 'e2-5', source: '2', target: '5', style: { stroke: '#4b5563' } },

    { id: 'e3-6', source: '3', target: '6', style: { stroke: '#4b5563' } },
    { id: 'e3-7', source: '3', target: '7', style: { stroke: '#4b5563' } },

    { id: 'e4-8', source: '4', target: '8', style: { stroke: '#4b5563' } },
    { id: 'e4-9', source: '4', target: '9', style: { stroke: '#4b5563' } },
];

const TreeVisualization = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="h-[500px] w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 left-4 z-10 bg-gray-800/80 px-3 py-1 rounded backdrop-blur">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Network Tree
                </h3>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
            >
                <Background gap={16} color="#374151" />
                <Controls className="bg-gray-800 border-gray-700 fill-white text-white" />
                <MiniMap
                    nodeColor="#6366f1"
                    maskColor="rgba(0,0,0, 0.6)"
                    className="bg-gray-800 border border-gray-700"
                />
            </ReactFlow>
        </div>
    );
};

export default TreeVisualization;
