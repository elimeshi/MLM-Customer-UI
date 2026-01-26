import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { X, User, DollarSign, TrendingUp } from 'lucide-react';

// Custom Node Component for a nicer look
const CustomNode = ({ data, selected }) => {
    return (
        <div className={`px-4 py-3 shadow-xl rounded-xl transition-all duration-300 min-w-[160px] text-center border-2 ${selected
                ? 'bg-indigo-900/90 border-indigo-400 scale-105 shadow-indigo-500/50'
                : 'bg-gray-800 border-gray-600 hover:border-gray-500'
            }`}>
            <div className="flex justify-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                    <User size={16} />
                </div>
            </div>
            <div className="font-bold text-gray-100 text-sm mb-0.5">{data.label}</div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${data.status === 'Active' ? 'text-green-400' : 'text-gray-500'
                }`}>{data.status}</div>
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

// Enhanced data with financial info
const initialNodes = [
    // Root
    { id: '1', type: 'custom', position: { x: 400, y: 0 }, data: { label: 'You (Root)', status: 'Active', spend: 4500, commission: 1200 } },

    // Level 1
    { id: '2', type: 'custom', position: { x: 200, y: 150 }, data: { label: 'User A', status: 'Active', spend: 2100, commission: 350 } },
    { id: '3', type: 'custom', position: { x: 600, y: 150 }, data: { label: 'User B', status: 'Inactive', spend: 0, commission: 0 } },

    // Level 2 (from A)
    { id: '4', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'User A1', status: 'Active', spend: 800, commission: 120 } },
    { id: '5', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'User A2', status: 'Active', spend: 1200, commission: 180 } },

    // Level 2 (from B)
    { id: '6', type: 'custom', position: { x: 500, y: 300 }, data: { label: 'User B1', status: 'Active', spend: 300, commission: 45 } },
    { id: '7', type: 'custom', position: { x: 700, y: 300 }, data: { label: 'User B2', status: 'Active', spend: 650, commission: 90 } },

    // Level 3
    { id: '8', type: 'custom', position: { x: 50, y: 450 }, data: { label: 'User A1-a', status: 'Active', spend: 150, commission: 15 } },
    { id: '9', type: 'custom', position: { x: 150, y: 450 }, data: { label: 'User A1-b', status: 'Inactive', spend: 0, commission: 0 } },
];

const edgeStyle = {
    stroke: '#818cf8', // Indigo-400
    strokeWidth: 2,
};

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },

    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-5', source: '2', target: '5' },

    { id: 'e3-6', source: '3', target: '6' },
    { id: 'e3-7', source: '3', target: '7' },

    { id: 'e4-8', source: '4', target: '8' },
    { id: 'e4-9', source: '4', target: '9' },
].map(edge => ({
    ...edge,
    type: 'smoothstep', // Cleaner lines for tree
    animated: false,
    style: edgeStyle,
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#818cf8',
    },
}));

const TreeVisualization = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);

    const onNodeClick = (_, node) => {
        setSelectedNode(node);
    };

    const closePanel = () => setSelectedNode(null);

    return (
        <div className="h-[600px] w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative flex">
            <div className="absolute top-4 left-4 z-10 bg-gray-800/80 px-3 py-1 rounded backdrop-blur">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Network Tree
                </h3>
            </div>

            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                    attributionPosition="bottom-right"
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
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

            {/* Details Slide-over Panel */}
            <div className={`w-80 bg-gray-800 border-l border-gray-700 transition-all duration-300 transform absolute right-0 top-0 h-full p-6 shadow-2xl ${selectedNode ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {selectedNode ? (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-xl font-bold text-white">{selectedNode.data.label}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${selectedNode.data.status === 'Active'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-gray-700 text-gray-400 border-gray-600'
                                    }`}>
                                    {selectedNode.data.status}
                                </span>
                            </div>
                            <button onClick={closePanel} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                    <DollarSign size={18} />
                                    <span className="text-sm font-medium">Total Spend</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${selectedNode.data.spend.toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-sm font-medium">Commission Generated</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${selectedNode.data.commission.toLocaleString()}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Distributor Details</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Join Date</span>
                                        <span className="text-gray-200">Oct 24, 2024</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Level</span>
                                        <span className="text-gray-200">Gold Executive</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Downline Count</span>
                                        <span className="text-gray-200">14 Members</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        Select a node to view details
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeVisualization;
