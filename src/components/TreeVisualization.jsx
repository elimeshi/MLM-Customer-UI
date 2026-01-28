import React, { useState, useEffect, useCallback } from 'react';
import { X, User, DollarSign, TrendingUp } from 'lucide-react';
import { useCommission } from '../context/SpendCapContext';

// --- Styles ---
// We'll use inline styles or Tailwind classes for the tree structure.
// The "Org Chart" look relies on ::before and ::after pseudo elements for lines usually,
// but for simplicity and clear React code, we can use simple divs and borders.

const TreeNode = ({ node, onNodeClick, selectedNodeId, depth = 0 }) => {
    const isSelected = String(node.id) === String(selectedNodeId);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center relative">
            {/* Connector Line from Parent (only if not root/depth 0) */}
            {/* We handle top connectors in the parent mapping to avoid gap issues */}

            {/* Node Card */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onNodeClick(node);
                }}
                className={`
            relative z-10 
            px-4 py-3 
            min-w-[140px] 
            bg-gray-800 
            rounded-xl 
            border-2 
            transition-all duration-200 
            cursor-pointer 
            flex flex-col items-center gap-1
            shadow-xl
            ${isSelected
                        ? 'border-indigo-500 bg-indigo-900/40 shadow-indigo-500/20 scale-105'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-750'
                    }
        `}
            >
                {/* Status indicator circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${Number(node.total_spent) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                    <User size={16} />
                </div>

                <div className="text-sm font-bold text-gray-200">{node.username}</div>

                <div className={`text-[10px] uppercase tracking-wider font-semibold ${Number(node.total_spent) > 0 ? 'text-green-400' : 'text-gray-500'
                    }`}>
                    {Number(node.total_spent) > 0 ? 'פעיל' : 'לא פעיל'}
                </div>

                {/* Bottom vertical line for Children (Connects node to the horizontal bar) */}
                {hasChildren && (
                    <div className="absolute top-full left-1/2 w-0.5 h-6 bg-indigo-400/50 -translate-x-1/2"></div>
                )}
            </div>

            {/* Children Container */}
            {hasChildren && (
                <div className="mt-6 flex gap-8 relative items-start">
                    {node.children.length > 1 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-400/50" style={{
                            left: 'calc(140px / 2)', // Half of min-width roughly
                            right: 'calc(140px / 2)',
                            top: '-1px' // Align with vertical connector end
                        }}></div>
                    )}

                    {node.children.map((child, index) => (
                        <div key={child.id} className="flex flex-col items-center relative">
                            {/* Vertical Line Up from Child to Bar */}
                            <div className="w-0.5 h-6 bg-indigo-400/50 mb-0"></div>

                            <TreeNode
                                node={child}
                                onNodeClick={onNodeClick}
                                selectedNodeId={selectedNodeId}
                                depth={depth + 1}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// -- Better CSS-only Tree for Variable Widths --
// Using a ul/li approach is robust.
const CssTreeNode = ({ node, onNodeClick, selectedNodeId }) => {
    if (!node) return null;
    const isSelected = String(node.id) === String(selectedNodeId);

    return (
        <li className="relative p-4 pt-8 text-center list-none flex flex-col items-center">
            {/* Connectors */}
            <div className="tree-connector absolute top-0 left-1/2 -ml-[1px] w-[2px] h-8 bg-indigo-500/30"></div>

            <div
                onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
                className={`
                    tree-card relative z-10 inline-block px-4 py-3 min-w-[120px] 
                    bg-gray-800 rounded-xl border-2 cursor-pointer transition-all shadow-xl
                    ${isSelected
                        ? 'border-indigo-500 bg-indigo-900/40 shadow-indigo-500/20 scale-105'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-750'
                    }
                `}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${Number(node.total_spent) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                    <User size={16} />
                </div>
                <div className="text-sm font-bold text-gray-200">{node.username}</div>
                <div className={`text-[10px] uppercase tracking-wider font-semibold ${Number(node.total_spent) > 0 ? 'text-green-400' : 'text-gray-500'
                    }`}>
                    {Number(node.total_spent) > 0 ? 'פעיל' : 'לא פעיל'}
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <ul className="flex justify-center p-0 m-0 pt-8 relative">
                    {node.children.map(child => (
                        <CssTreeNode key={child.id} node={child} onNodeClick={onNodeClick} selectedNodeId={selectedNodeId} />
                    ))}
                </ul>
            )}
        </li>
    );
};

const TreeVisualization = () => {
    const { userId } = useCommission();
    const [treeData, setTreeData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const fetchTree = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/user/${userId}/descendants?depth=5`);
            const data = await res.json();
            // data should be an array of root nodes.
            // We will visualize "You" as the supreme root.
            const myRoot = {
                id: 'root_me',
                username: 'אתה',
                total_spent: 0,
                total_earned: 0,
                children: data // The API result children become children of "You"
            };
            setTreeData([myRoot]);

        } catch (err) {
            console.error("Failed to fetch tree:", err);
        }
    }, [userId]);

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    const onNodeClick = (node) => {
        // If root_me is clicked, just ignore or show something basic
        if (node.id === 'root_me') return;
        setSelectedNode(node);
    };

    const closePanel = () => setSelectedNode(null);

    if (!userId) return (
        <div className="h-[600px] w-full bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
            אנא התחבר כדי לצפות בעץ הרשת.
        </div>
    );

    return (
        <div className="h-[600px] w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative flex">
            {/* CSS for Tree Structure */}
            <style>{`
            /* Remove default ul/li styles */
            .tree-container ul {
                display: flex;
                padding-top: 20px; 
                position: relative;
                transition: all 0.5s;
            }
            .tree-container li {
                float: left; text-align: center;
                list-style-type: none;
                position: relative;
                padding: 20px 5px 0 5px;
                transition: all 0.5s;
            }
            /* Connectors */
            /* We use ::before and ::after to draw the connector lines on the li */
            .tree-container li::before, .tree-container li::after {
                content: '';
                position: absolute; top: 0; right: 50%;
                border-top: 2px solid rgba(99, 102, 241, 0.3); /* Indigo-ish */
                width: 50%; height: 20px;
            }
            .tree-container li::after {
                right: auto; left: 50%;
                border-left: 2px solid rgba(99, 102, 241, 0.3);
            }
            /* Remove left-connector from first child and right-connector from last child */
            /* RTL SWAP: first-child is Rightmost (needs LTR last-child logic), last-child is Leftmost (needs LTR first-child logic) */
            
            /* Rightmost (First Child in RTL): Needs __| (Left arm + Vertical Right) */
            /* So we HIDE the Right arm (::after). matching LTR last-child hide rule */
            .tree-container li:first-child::after {
                border: 0 none;
            }
            
            /* Leftmost (Last Child in RTL): Needs |__ (Vertical Left + Right arm) */
            /* So we HIDE the Left arm (::before). matching LTR first-child hide rule */
            .tree-container li:last-child::before {
                border: 0 none;
            }

            /* Adding back the vertical line and curves */
            
            /* Leftmost (Last Child): Needs |__ . Has ::after (Right arm). Needs Curve. */
            .tree-container li:last-child::after {
                border-radius: 5px 0 0 0;
            }
            
            /* Rightmost (First Child): Needs __| . Has ::before (Left arm). Needs Vertical + Curve. */
            .tree-container li:first-child::before {
                 border-right: 2px solid rgba(99, 102, 241, 0.3);
                 border-radius: 0 5px 0 0;
            }
            
            .tree-container li:only-child::after, .tree-container li:only-child::before {
                display: none;
            }
            .tree-container li:only-child { 
                padding-top: 0;
            }
            /* Downward connector from parent */
            .tree-container ul::before {
                content: '';
                position: absolute; top: 0; left: 50%;
                border-left: 2px solid rgba(99, 102, 241, 0.3);
                width: 0; height: 20px;
            }
            /* Root specific */
            .root-ul {
                padding-top: 0 !important;
            }
            .root-ul::before {
                display: none;
            }
        `}</style>

            {/* Header */}
            <div className="absolute top-4 right-4 z-10 bg-gray-800/80 px-3 py-1 rounded backdrop-blur">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    עץ הרשת
                </h3>
            </div>

            {/* Tree Usage */}
            <div className="flex-1 overflow-auto p-10 flex justify-center tree-container bg-dots">
                <ul className="flex root-ul">
                    {treeData.map(root => (
                        <CssTreeNode key={root.id} node={root} onNodeClick={onNodeClick} selectedNodeId={selectedNode?.id} />
                    ))}
                </ul>
            </div>

            {/* Details Panel */}
            <div className={`w-80 bg-gray-800 border-r border-gray-700 transition-all duration-300 transform absolute left-0 top-0 h-full p-6 shadow-2xl z-20 ${selectedNode ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {selectedNode && (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-xl font-bold text-white max-w-[200px] truncate">{selectedNode.username}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${Number(selectedNode.total_spent) > 0
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-gray-700 text-gray-400 border-gray-600'
                                    }`}>
                                    {Number(selectedNode.total_spent) > 0 ? 'פעיל' : 'לא פעיל'}
                                </span>
                            </div>
                            <button onClick={closePanel} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                    <DollarSign size={18} />
                                    <span className="text-sm font-medium">סך הוצאות</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${Number(selectedNode.total_spent).toFixed(2)}
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-sm font-medium">רווחים</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${Number(selectedNode.total_earned).toFixed(2)}
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
