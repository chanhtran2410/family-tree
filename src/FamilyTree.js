import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    Handle,
    Position,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import { Button, Card } from 'antd';
import 'reactflow/dist/style.css';
import 'antd/dist/reset.css';
import treeData from './treeData.json';

// const { Search } = Input;

// 🔹 Bảng màu cho từng đời
const levelColors = [
    '#ffa39e', // đời 2 (hồng nhạt)
    '#95de64', // đời 3 (xanh lá)
    '#69c0ff', // đời 4 (xanh dương)
    '#d3adf7', // đời 5 (tím nhạt)
];

// --- Node Tùy Chỉnh ---
function CustomNode({ data, selected, setActiveId, id }) {
    const bgColor = levelColors[data.level % levelColors.length];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                borderRadius: '8px',
                width: 200,
                background: bgColor,
                height: '150px',
                color: '#333',
                boxShadow: selected
                    ? '0 0 10px rgba(0,0,0,0.4), 0 0 0 2px #ff4d4f'
                    : '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
            }}
        >
            <img
                src={data.image}
                alt={data.label}
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #333',
                }}
            />
            <Card
                style={{ flex: 1, border: 'none', background: 'transparent' }}
                bodyStyle={{ padding: 2 }}
            >
                <div
                    style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        textAlign: 'center',
                    }}
                >
                    {data.label.split('-')[0]}
                    <br />
                    {data.label.split('-')[1]}
                </div>
                <div
                    style={{
                        color: 'black',
                        fontSize: 11,
                        textAlign: 'center',
                    }}
                >
                    {data.description && <div>( {data.description} )</div>}
                </div>
            </Card>
            <Button
                type="link"
                size="small"
                style={{ padding: 0, fontSize: 13 }}
                onClick={() => setActiveId && setActiveId(id)}
            >
                Xem chi tiết
            </Button>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
// --- Thuật toán sắp xếp cây ---
let globalIndex = 0;
const X_SPACING = 220; // 🔹 khoảng cách ngang
const Y_SPACING = 300; // 🔹 khoảng cách dọc (tùy chỉnh tại đây)

// function layoutTree(
//     node,
//     level = 0,
//     parentId = null,
//     nodes = [],
//     edges = [],
//     maxGenerations = Infinity
// ) {
//     const id = `${parentId ? parentId + '-' : ''}${globalIndex++}`;
//     const nodeData = {
//         id,
//         type: 'custom',
//         position: { x: 0, y: level * Y_SPACING },
//         data: {
//             label: node.name,
//             description: node.description,
//             image: node.image,
//             level,
//         },
//         treePath: [...(arguments[6] || [])], // pass treePath for node click
//     };
//     nodes.push(nodeData);

//     if (parentId !== null) {
//         edges.push({
//             id: `e${parentId}-${id}`,
//             source: parentId,
//             target: id,
//             type: 'step',
//             style: { stroke: '#555', strokeWidth: 2 },
//         });
//     }

//     if (
//         level + 1 < maxGenerations &&
//         node.children &&
//         node.children.length > 0
//     ) {
//         const childPositions = [];
//         node.children.forEach((child, idx) => {
//             const childPos = layoutTree(
//                 child,
//                 level + 1,
//                 id,
//                 nodes,
//                 edges,
//                 maxGenerations,
//                 [...(arguments[6] || []), idx]
//             );
//             childPositions.push(childPos);
//         });
//         const minX = Math.min(...childPositions.map((c) => c.x));
//         const maxX = Math.max(...childPositions.map((c) => c.x));
//         nodeData.position.x = (minX + maxX) / 2;
//     } else {
//         nodeData.position.x = globalIndex * X_SPACING;
//     }

//     return nodeData.position;
// }

// --- Component chính ---
function CayGiaPha({
    tree,
    rootNodePath = [],
    maxGenerations = Infinity,
    onNodeClick,
}) {
    const nodeTypes = {
        custom: (props) => <CustomNode {...props} setActiveId={setActiveId} />,
    };
    const [activeId, setActiveId] = useState(null);

    const { setCenter, fitView } = useReactFlow();

    // Traverse tree by rootNodePath
    let rootNode = tree[0];
    for (const idx of rootNodePath) {
        if (rootNode.children && rootNode.children[idx]) {
            rootNode = rootNode.children[idx];
        } else {
            break;
        }
    }
    const { nodes, edges } = useMemo(() => {
        globalIndex = 0;
        const nodes = [];
        const edges = [];
        // Pass rootNodePath as prefix to all treePath
        function layoutTreeWithPrefix(
            node,
            level = 0,
            parentId = null,
            nodes = [],
            edges = [],
            maxGenerations = Infinity,
            treePath = []
        ) {
            const id = `${parentId ? parentId + '-' : ''}${globalIndex++}`;
            const nodeData = {
                id,
                type: 'custom',
                position: { x: 0, y: level * Y_SPACING },
                data: {
                    label: node.name,
                    description: node.description,
                    image: node.image,
                    level,
                },
                treePath: [...rootNodePath, ...treePath],
            };
            nodes.push(nodeData);
            if (parentId !== null) {
                edges.push({
                    id: `e${parentId}-${id}`,
                    source: parentId,
                    target: id,
                    type: 'step',
                    style: { stroke: '#555', strokeWidth: 2 },
                });
            }
            if (
                level + 1 < maxGenerations &&
                node.children &&
                node.children.length > 0
            ) {
                const childPositions = [];
                node.children.forEach((child, idx) => {
                    const childPos = layoutTreeWithPrefix(
                        child,
                        level + 1,
                        id,
                        nodes,
                        edges,
                        maxGenerations,
                        [...treePath, idx]
                    );
                    childPositions.push(childPos);
                });
                const minX = Math.min(...childPositions.map((c) => c.x));
                const maxX = Math.max(...childPositions.map((c) => c.x));
                nodeData.position.x = (minX + maxX) / 2;
            } else {
                nodeData.position.x = globalIndex * X_SPACING;
            }
            return nodeData.position;
        }
        layoutTreeWithPrefix(
            rootNode,
            0,
            null,
            nodes,
            edges,
            maxGenerations,
            []
        );
        return { nodes, edges };
    }, [rootNodePath, rootNode, maxGenerations]);

    // Zoom vào node
    // const focusNode = (id) => {
    //     const node = nodes.find((n) => n.id === id);
    //     if (!node) return;
    //     setActiveId(id);
    //     // Move node higher by subtracting 120 from y position
    //     setCenter(node.position.x, node.position.y + 350, {
    //         zoom: 0.8,
    //         duration: 800,
    //     });
    // };

    // const handleSearch = (value) => {
    //     if (!value) {
    //         setActiveId(null);
    //         return;
    //     }
    //     const match = nodes.find((n) =>
    //         n.data.label.toLowerCase().includes(value.toLowerCase())
    //     );
    //     if (match) {
    //         focusNode(match.id);
    //     } else {
    //         setActiveId(null);
    //     }
    // };

    const nodesWithSelection = nodes.map((n) => ({
        ...n,
        selected: n.id === activeId,
    }));

    // Focus on root node and fit all nodes in view when rootNodePath or nodes change
    useEffect(() => {
        if (nodes.length > 0) {
            // setActiveId(nodes[0].id);
            fitView({ duration: 800, padding: 0.1 });
        }
    }, [rootNodePath, nodes, fitView]);

    // Focus on root node when rootNodePath changes
    useEffect(() => {
        if (nodes.length > 0) {
            // setActiveId(nodes[0].id);
            setCenter(nodes[0].position.x + 90, nodes[0].position.y + 320, {
                zoom: 0.8,
                duration: 800,
            });
        }
    }, [rootNodePath, nodes.length, nodes, setCenter]);

    // const activeNode = nodes.find((n) => n.id === activeId);

    // Tìm cha + con
    // const parent = activeNode
    //     ? edges.find((e) => e.target === activeNode.id)
    //     : null;
    // const parentNode = parent
    //     ? nodes.find((n) => n.id === parent.source)
    //     : null;

    // const children = activeNode
    //     ? edges
    //           .filter((e) => e.source === activeNode.id)
    //           .map((e) => nodes.find((n) => n.id === e.target))
    //     : [];

    // Panel nổi
    // const floatingPanelStyle =
    //     width < 768
    //         ? {
    //               position: 'absolute',
    //               top: '50%',
    //               left: '50%',
    //               transform: 'translate(-50%, -50%)',
    //               width: '90%',
    //               maxWidth: 300,
    //               zIndex: 20,
    //               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    //               borderRadius: 8,
    //           }
    //         : {
    //               position: 'absolute',
    //               top: 70,
    //               right: 20,
    //               width: 300,
    //               zIndex: 20,
    //               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    //               borderRadius: 8,
    //           };

    return (
        <>
            {/* Thanh tìm kiếm */}
            {/* <div
                style={{
                    position: 'absolute',
                    top: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    width: '90%',
                    maxWidth: 400,
                }}
            >
                <Search
                    placeholder="Tìm tên..."
                    onSearch={handleSearch}
                    enterButton="Tìm"
                    allowClear
                />
            </div> */}

            {/* Cây gia phả */}
            <ReactFlow
                nodes={nodesWithSelection}
                edges={edges}
                nodeTypes={nodeTypes}
                style={{
                    background:
                        'linear-gradient(to right, #fff3b0, #ffea94ff, #fff3b0)',
                    cursor: 'auto',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                }}
                onNodeClick={(_, node) => {
                    if (onNodeClick && node.treePath) {
                        onNodeClick(node.treePath);
                    }
                }}
                panOnDrag={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
            >
                <Controls />
                <Background color="#eee" gap={6} />
            </ReactFlow>

            {/* Panel nổi */}
            {/* {activeNode && (
                <Card
                    title={
                        <Flex vertical>
                            <span>{activeNode.data.label}</span>
                            <span>{`${activeNode.data.description}`}</span>
                        </Flex>
                    }
                    style={floatingPanelStyle}
                    extra={
                        <Button
                            type="link"
                            onClick={() => setActiveId(null)}
                            style={{
                                color: '#ff4d4f',
                                background: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                        >
                            X
                        </Button>
                    }
                >
                    {parentNode && (
                        <div style={{ marginBottom: 12 }}>
                            <strong>Cha/Mẹ:</strong>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginTop: 6,
                                }}
                                onClick={() => focusNode(parentNode.id)}
                            >
                                <img
                                    src={parentNode.data.image}
                                    alt={parentNode.data.label}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        marginRight: 6,
                                        border: '1px solid #ccc',
                                    }}
                                />
                                <span>{parentNode.data.label}</span>
                            </div>
                        </div>
                    )}

                    {children.length > 0 && (
                        <div>
                            <strong>Con cái:</strong>
                            <div style={{ marginTop: 6 }}>
                                {children.map((c) => (
                                    <div
                                        key={c.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            marginBottom: 6,
                                        }}
                                        onClick={() => focusNode(c.id)}
                                    >
                                        <img
                                            src={c.data.image}
                                            alt={c.data.label}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                marginRight: 6,
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                        <span>{c.data.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )} */}
        </>
    );
}

// --- Component xuất ---
export default function GiaPha(props) {
    // Support rootNodePath and maxGenerations props for limited view
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* <button
                onClick={() => (window.location.href = '/')}
                style={{
                    position: 'fixed',
                    top: 16,
                    left: 24,
                    zIndex: 3000,
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                }}
            >
                Quay về Menu
            </button> */}
            <ReactFlowProvider>
                <CayGiaPha tree={treeData} {...props} />
            </ReactFlowProvider>
        </div>
    );
}
