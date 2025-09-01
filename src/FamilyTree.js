import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    Handle,
    Position,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import { Button, Card, Flex, Input } from 'antd';
import 'reactflow/dist/style.css';
import 'antd/dist/reset.css';
import treeData from './treeData.json';

const { Search } = Input;

// 🔹 Bảng màu cho từng đời
const levelColors = [
    '#ffd666', // đời 1 (vàng nhạt)
    '#ffa39e', // đời 2 (hồng nhạt)
    '#95de64', // đời 3 (xanh lá)
    '#69c0ff', // đời 4 (xanh dương)
    '#d3adf7', // đời 5 (tím nhạt)
    '#ffec3d', // đời 6 (vàng sáng)
];

// --- Node Tùy Chỉnh ---
function CustomNode({ data, selected }) {
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
                width: 150,
                height: 'fit-content',
                background: bgColor,
                minHeight: '120px',
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
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {data.label}
                </div>
                <div style={{ color: '#555', fontSize: 11 }}>
                    {data.description}
                </div>
            </Card>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
// --- Thuật toán sắp xếp cây ---
let globalIndex = 0;
const X_SPACING = 160; // 🔹 khoảng cách ngang
const Y_SPACING = 260; // 🔹 khoảng cách dọc (tùy chỉnh tại đây)

function layoutTree(node, level = 0, parentId = null, nodes = [], edges = []) {
    const id = `${parentId ? parentId + '-' : ''}${globalIndex++}`;
    const nodeData = {
        id,
        type: 'custom',
        position: { x: 0, y: level * Y_SPACING }, // 🔹 dùng Y_SPACING thay vì số cứng
        data: {
            label: node.name,
            description: node.description,
            image: node.image,
            level,
        },
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

    if (node.children && node.children.length > 0) {
        const childPositions = [];
        node.children.forEach((child) => {
            const childPos = layoutTree(child, level + 1, id, nodes, edges);
            childPositions.push(childPos);
        });
        const minX = Math.min(...childPositions.map((c) => c.x));
        const maxX = Math.max(...childPositions.map((c) => c.x));
        nodeData.position.x = (minX + maxX) / 2;
    } else {
        nodeData.position.x = globalIndex * X_SPACING; // 🔹 dùng X_SPACING thay vì số cứng
    }

    return nodeData.position;
}

// --- Hook lấy chiều rộng màn hình ---
function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
}

// --- Component chính ---
function CayGiaPha({ tree }) {
    const nodeTypes = { custom: CustomNode };
    const [activeId, setActiveId] = useState(null);
    const { setCenter } = useReactFlow();
    const width = useWindowWidth();

    const { nodes, edges } = useMemo(() => {
        globalIndex = 0;
        const nodes = [];
        const edges = [];
        layoutTree(tree[0], 0, null, nodes, edges);
        return { nodes, edges };
    }, [tree]);

    // Zoom vào node
    const focusNode = (id) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;
        setActiveId(id);
        setCenter(node.position.x, node.position.y, {
            zoom: 0.9,
            duration: 800,
        });
    };

    const handleSearch = (value) => {
        if (!value) {
            setActiveId(null);
            return;
        }
        const match = nodes.find((n) =>
            n.data.label.toLowerCase().includes(value.toLowerCase())
        );
        if (match) {
            focusNode(match.id);
        } else {
            setActiveId(null);
        }
    };

    const nodesWithSelection = nodes.map((n) => ({
        ...n,
        selected: n.id === activeId,
    }));

    const activeNode = nodes.find((n) => n.id === activeId);

    // Tìm cha + con
    const parent = activeNode
        ? edges.find((e) => e.target === activeNode.id)
        : null;
    const parentNode = parent
        ? nodes.find((n) => n.id === parent.source)
        : null;

    const children = activeNode
        ? edges
              .filter((e) => e.source === activeNode.id)
              .map((e) => nodes.find((n) => n.id === e.target))
        : [];

    // Panel nổi
    const floatingPanelStyle =
        width < 768
            ? {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: 300,
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  borderRadius: 8,
              }
            : {
                  position: 'absolute',
                  top: 70,
                  right: 20,
                  width: 300,
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  borderRadius: 8,
              };

    return (
        <>
            {/* Thanh tìm kiếm */}
            <div
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
            </div>

            {/* Cây gia phả */}
            <ReactFlow
                nodes={nodesWithSelection}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                style={{
                    background: '#fafafa',
                    cursor: 'default',
                }}
                onNodeClick={(_, node) => focusNode(node.id)}
                panOnDrag={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
            >
                <Controls />
                <Background color="#eee" gap={6} />
            </ReactFlow>

            {/* Panel nổi */}
            {activeNode && (
                <Card
                    title={
                        <Flex vertical>
                            <span>{activeNode.data.label}</span>
                            <span>{`(${activeNode.data.description})`}</span>
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
            )}
        </>
    );
}

// --- Component xuất ---
export default function GiaPha() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlowProvider>
                <CayGiaPha tree={treeData} />
            </ReactFlowProvider>
        </div>
    );
}
