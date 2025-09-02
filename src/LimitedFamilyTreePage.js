import React, { useState } from 'react';
import FamilyTree from './FamilyTree';
import { useNavigate } from 'react-router-dom';

function LimitedFamilyTreePage() {
    // rootNodePath is an array of indices to traverse treeData
    const [rootNodePath, setRootNodePath] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        if (rootNodePath.length > 0) {
            setRootNodePath(rootNodePath.slice(0, -1));
        }
    };

    // Helper to get node by path
    function getNodeByPath(tree, path) {
        let node = tree[0];
        for (const idx of path) {
            if (!node.children || !node.children[idx]) return null;
            node = node.children[idx];
        }
        return node;
    }

    // Only set as root if node has children
    const handleNodeClick = (path) => {
        const node = getNodeByPath(require('./treeData.json'), path);
        if (node && node.children && node.children.length > 0) {
            setRootNodePath(path);
        }
    };

    return (
        <div>
            <button
                className="back-btn"
                onClick={() => {
                    navigate('/');
                }}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                Quay về trang chủ
            </button>
            <button
                className="back-btn"
                onClick={handleBack}
                disabled={rootNodePath.length === 0}
                style={{
                    position: 'absolute',
                    top: 56,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                Trở về đời trước
            </button>
            <FamilyTree
                rootNodePath={rootNodePath}
                maxGenerations={3}
                onNodeClick={handleNodeClick}
                centerRootOnChange
            />
        </div>
    );
}

export default LimitedFamilyTreePage;
