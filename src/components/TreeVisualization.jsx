import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { X, User, DollarSign, TrendingUp } from 'lucide-react';
import { useCommission } from '../context/SpendCapContext';

// Custom Node Component (Unchanged visual)
const CustomNode = ({ data, selected }) => {
    return (
        <div className={`px-4 py-3 shadow-xl rounded-xl transition-all duration-300 min-w-[160px] text-center border-2 ${selected
            ? 'bg-indigo-900/90 border-indigo-400 scale-105 shadow-indigo-500/50'
            : 'bg-gray-800 border-gray-600 hover:border-gray-500'
            }`}>
            <div className="flex justify-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(data.spend) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                    <User size={16} />
                </div>
            </div>
            <div className="font-bold text-gray-100 text-sm mb-0.5">{data.label}</div>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${Number(data.spend) > 0 ? 'text-green-400' : 'text-gray-500'
                }`}>{Number(data.spend) > 0 ? 'Active' : 'Inactive'}</div>
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

const edgeStyle = {
    stroke: '#818cf8',
    strokeWidth: 2,
};

const TreeVisualization = () => {
    const { userId } = useCommission();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const fetchTree = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/user/${userId}/descendants?depth=5`);
            const treeData = await res.json();

            // Transform Recursive Tree to Nodes/Edges with Layout
            const newNodes = [];
            const newEdges = [];

            // Simple manual layout helpers
            const levelHeight = 150;
            const siblingGap = 200;

            // Flatten the tree for React Flow
            const traverse = (node, x, y, parentId) => {
                // Add Node
                const nodeId = String(node.id);
                newNodes.push({
                    id: nodeId,
                    type: 'custom',
                    position: { x, y },
                    data: {
                        label: node.username,
                        spend: Number(node.total_spent),
                        commission: Number(node.total_earned),
                        // Add other stats if available
                    }
                });

                // Add Edge from Parent
                if (parentId) {
                    newEdges.push({
                        id: `e${parentId}-${nodeId}`,
                        source: parentId,
                        target: nodeId,
                        type: 'smoothstep',
                        animated: false,
                        style: edgeStyle,
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' }
                    });
                }

                // Recurse children
                if (node.children && node.children.length > 0) {
                    const totalWidth = node.children.length * siblingGap;
                    let startX = x - (totalWidth / 2) + (siblingGap / 2);

                    node.children.forEach((child, index) => {
                        traverse(child, startX + (index * siblingGap), y + levelHeight, nodeId);
                    });
                }
            };

            if (treeData && treeData.length > 0) {
                // Assuming endpoint returns array of root nodes (for this user, usually just one logic root or their direct children if we query differently, 
                // but the verification script shows it returns the user as root if we query descendants correctly? 
                // Actually, querying descendants of X normally returns children. 
                // Let's assume the first item is the root context or handle multiple roots.
                // Based on app.js: "SELECT * FROM subordinates" and "buildTree(minLevel)". 
                // If I query /user/ROOT/descendants, the helper builds a tree starting from minLevel (which is level 1 relative to root, i.e., children).
                // So we need to visualize "You" (Root) and then attach these children.

                // Allow "You" node manually
                const rootNodeId = "root_me";
                newNodes.push({
                    id: rootNodeId,
                    type: 'custom',
                    position: { x: 0, y: 0 },
                    data: { label: 'You', spend: 0, commission: 0 } // Context already has this info really
                });

                treeData.forEach((subTree, index) => {
                    traverse(subTree, (index * 300), 150, rootNodeId);
                });
            }

            setNodes(newNodes);
            setEdges(newEdges);

        } catch (err) {
            console.error("Failed to fetch tree:", err);
        }
    }, [userId, setNodes, setEdges]);

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    const onNodeClick = (_, node) => {
        setSelectedNode(node);
    };

    const closePanel = () => setSelectedNode(null);

    if (!userId) return (
        <div className="h-[600px] w-full bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
            Please log in to view network tree.
        </div>
    );

    return (
        <div className="h-[600px] w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative flex">
            {/* ... Header and ReactFlow (Same struct) ... */}
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

            {/* Details Panel (Same struct with dynamic data) */}
            <div className={`w - 80 bg - gray - 800 border - l border - gray - 700 transition - all duration - 300 transform absolute right - 0 top - 0 h - full p - 6 shadow - 2xl ${selectedNode ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {selectedNode && (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-xl font-bold text-white max-w-[200px] truncate">{selectedNode.data.label}</h4>
                                <span className={`text - xs px - 2 py - 0.5 rounded - full border ${Number(selectedNode.data.spend) > 0
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-gray-700 text-gray-400 border-gray-600'
                                    }`}>
                                    {Number(selectedNode.data.spend) > 0 ? 'Active' : 'Inactive'}
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
                                    <span className="text-sm font-medium">Total Spent</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    \${Number(selectedNode.data.spend).toFixed(2)}
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-sm font-medium">Earned</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    \${Number(selectedNode.data.commission).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TreeVisualization;
