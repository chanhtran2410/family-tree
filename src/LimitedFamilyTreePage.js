import React, { useState } from 'react';
import FamilyTree from './FamilyTree';
// import { useNavigate } from 'react-router-dom';
import { Flex, Input } from 'antd';
import treeData from './treeData.json';

const { Search } = Input;

function LimitedFamilyTreePage() {
    const [rootNodePath, setRootNodePath] = useState([]);
    // const navigate = useNavigate();

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

    // Recursively find path to node whose name includes keyword
    function findPath(node, keyword, path = []) {
        if (!node) return null;
        if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
            return path;
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const result = findPath(node.children[i], keyword, [
                    ...path,
                    i,
                ]);
                if (result) return result;
            }
        }
        return null;
    }

    // Only set as root if node has children
    const handleNodeClick = (path) => {
        const node = getNodeByPath(treeData, path);
        if (node && node.children && node.children.length > 0) {
            setRootNodePath(path);
        }
    };

    // 🔹 Handle search
    const handleSearch = (value) => {
        if (!value) {
            setRootNodePath([]); // reset to root
            return;
        }
        const path = findPath(treeData[0], value);
        if (path) {
            setRootNodePath(path); // re-root at found node
        } else {
            alert('Không tìm thấy tên trong gia phả!');
        }
    };

    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    zIndex: 1000,
                    width: '100%',
                    height: '100%',
                    padding: 16,
                }}
            >
                <Flex gap={32} justify="space-between">
                    <Search
                        placeholder="Tìm tên..."
                        onSearch={handleSearch}
                        enterButton="Tìm kiếm"
                        allowClear
                    />
                    <button
                        className="back-btn"
                        onClick={handleBack}
                        disabled={rootNodePath.length === 0}
                        // style={{
                        //     position: 'absolute',
                        //     top: 56,
                        //     right: 24,
                        //     zIndex: 1000,
                        // }}
                    >
                        Trở về đời trước
                    </button>
                </Flex>
            </div>

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
