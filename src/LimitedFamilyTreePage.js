import React, { useState } from 'react';
import FamilyTree from './FamilyTree';

function LimitedFamilyTreePage() {
    // rootNodePath is an array of indices to traverse treeData
    const [rootNodePath, setRootNodePath] = useState([]);

    const handleBack = () => {
        if (rootNodePath.length > 0) {
            setRootNodePath(rootNodePath.slice(0, -1));
        }
    };

    return (
        <div>
            <button
                className="back-btn"
                onClick={handleBack}
                disabled={rootNodePath.length === 0}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                Trở về trang trước
            </button>
            <FamilyTree
                rootNodePath={rootNodePath}
                maxGenerations={3}
                onNodeClick={setRootNodePath}
                centerRootOnChange
            />
        </div>
    );
}

export default LimitedFamilyTreePage;
