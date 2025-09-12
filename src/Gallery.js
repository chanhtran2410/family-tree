import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spin } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    CloseOutlined,
    PlusOutlined,
    MinusOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import './Gallery.css';

// Get image paths without importing them immediately
const getImagePaths = () => {
    const context = require.context(
        './assets/images',
        false,
        /\.(png|jpe?g|svg)$/
    );
    return context.keys().map((item) => ({
        key: item.replace('./', ''),
        path: context(item),
        title: item.replace('./', '').replace(/\.(png|jpe?g|svg)$/, ''),
    }));
};

function Gallery() {
    const [visibleItems, setVisibleItems] = useState(12);
    const [loading, setLoading] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Zoom state management
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    // Pinch zoom state
    const [initialPinchDistance, setInitialPinchDistance] = useState(0);
    const [initialZoomLevel, setInitialZoomLevel] = useState(1);
    const observerRef = useRef();
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const imageRef = useRef();
    const BATCH_SIZE = 12;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;

    const allImages = getImagePaths();

    // Load more items when scrolling
    const loadMoreItems = useCallback(() => {
        if (loading) return;

        setLoading(true);
        setTimeout(() => {
            setVisibleItems((prev) =>
                Math.min(prev + BATCH_SIZE, allImages.length)
            );
            setLoading(false);
        }, 100);
    }, [loading, allImages.length, BATCH_SIZE]);

    // Intersection observer for infinite scroll
    const lastImageRef = useCallback(
        (node) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    visibleItems < allImages.length
                ) {
                    loadMoreItems();
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [loading, loadMoreItems, visibleItems, allImages.length]
    );

    // Image viewer functions
    const openViewer = (index) => {
        setCurrentImageIndex(index);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
    };

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length
        );
    }, [allImages.length]);

    // Touch handlers for pinch zoom and pan
    const handleTouchStart = useCallback(
        (e) => {
            // Helper function to calculate distance between two touch points
            const getTouchDistance = (touches) => {
                const touch1 = touches[0];
                const touch2 = touches[1];
                return Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            };

            if (e.touches.length === 1) {
                // Single touch - check if for navigation or panning
                touchStartX.current = e.touches[0].clientX;
                if (zoomLevel > 1) {
                    setIsDragging(true);
                    setDragStart({
                        x: e.touches[0].clientX - zoomPosition.x,
                        y: e.touches[0].clientY - zoomPosition.y,
                    });
                }
            } else if (e.touches.length === 2) {
                // Two finger pinch - start zoom gesture
                e.preventDefault();
                const distance = getTouchDistance(e.touches);
                setInitialPinchDistance(distance);
                setInitialZoomLevel(zoomLevel);
                setIsDragging(false); // Stop any ongoing drag
            }
        },
        [zoomLevel, zoomPosition]
    );

    const handleTouchMove = useCallback(
        (e) => {
            // Helper function to calculate distance between two touch points
            const getTouchDistance = (touches) => {
                const touch1 = touches[0];
                const touch2 = touches[1];
                return Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            };

            if (e.touches.length === 1) {
                if (zoomLevel > 1 && isDragging) {
                    // Panning when zoomed
                    e.preventDefault();
                    setZoomPosition({
                        x: e.touches[0].clientX - dragStart.x,
                        y: e.touches[0].clientY - dragStart.y,
                    });
                } else {
                    // Navigation swipe
                    touchEndX.current = e.touches[0].clientX;
                }
            } else if (e.touches.length === 2 && initialPinchDistance > 0) {
                // Two finger pinch - zoom gesture
                e.preventDefault();
                const currentDistance = getTouchDistance(e.touches);
                const scaleChange = currentDistance / initialPinchDistance;
                // Apply some smoothing to make zoom feel more natural
                const smoothedScale = Math.pow(scaleChange, 0.8);
                const newZoomLevel = Math.max(
                    MIN_ZOOM,
                    Math.min(MAX_ZOOM, initialZoomLevel * smoothedScale)
                );
                setZoomLevel(newZoomLevel);
            }
        },
        [zoomLevel, isDragging, dragStart, initialPinchDistance, initialZoomLevel, MIN_ZOOM, MAX_ZOOM]
    );

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        
        // Reset pinch zoom state
        setInitialPinchDistance(0);
        setInitialZoomLevel(1);

        if (!touchStartX.current || !touchEndX.current || zoomLevel > 1) {
            touchStartX.current = 0;
            touchEndX.current = 0;
            return;
        }

        const distance = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum distance for swipe

        if (distance > threshold) {
            nextImage(); // swipe left - next image
        } else if (distance < -threshold) {
            prevImage(); // swipe right - previous image
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [nextImage, prevImage, zoomLevel]);

    // Zoom handlers
    const resetZoom = useCallback(() => {
        setZoomLevel(1);
        setZoomPosition({ x: 0, y: 0 });
    }, []);

    const zoomIn = useCallback(() => {
        setZoomLevel((prev) => Math.min(prev + 0.2, MAX_ZOOM));
    }, [MAX_ZOOM]);

    const zoomOut = useCallback(() => {
        setZoomLevel((prev) => Math.max(prev - 0.2, MIN_ZOOM));
    }, [MIN_ZOOM]);

    const handleWheel = useCallback(
        (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoomLevel((prev) =>
                Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta))
            );
        },
        [MIN_ZOOM, MAX_ZOOM]
    );

    const handleDoubleClick = useCallback(
        (e) => {
            e.stopPropagation();
            if (zoomLevel === 1) {
                setZoomLevel(2);
            } else {
                resetZoom();
            }
        },
        [zoomLevel, resetZoom]
    );

    // Mouse drag handlers for panning
    const handleMouseDown = useCallback(
        (e) => {
            if (zoomLevel > 1) {
                setIsDragging(true);
                setDragStart({
                    x: e.clientX - zoomPosition.x,
                    y: e.clientY - zoomPosition.y,
                });
            }
        },
        [zoomLevel, zoomPosition]
    );

    // Reset zoom when changing images
    useEffect(() => {
        resetZoom();
    }, [currentImageIndex, resetZoom]);

    // Mouse event listeners for drag functionality
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging && zoomLevel > 1) {
                setZoomPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, zoomLevel, dragStart]);

    // Keyboard navigation
    useEffect(() => {
        const nextImage = () => {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        };

        const prevImage = () => {
            setCurrentImageIndex(
                (prev) => (prev - 1 + allImages.length) % allImages.length
            );
        };

        const handleKeyDown = (e) => {
            if (!isViewerOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    if (zoomLevel === 1) {
                        prevImage();
                    }
                    break;
                case 'ArrowRight':
                    if (zoomLevel === 1) {
                        nextImage();
                    }
                    break;
                case 'Escape':
                    closeViewer();
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                case '_':
                    zoomOut();
                    break;
                case '0':
                    resetZoom();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isViewerOpen, allImages.length, zoomLevel, zoomIn, zoomOut, resetZoom]);

    // Get currently visible images for rendering
    const visibleImages = allImages.slice(0, visibleItems);

    return (
        <div className="gallery-container">
            <div className="introduction-header">
                <h1 className="introduction-title">Bút Tích</h1>
                <p className="introduction-subtitle">Trần Thị Thế Phổ</p>
            </div>

            <div className="gallery-grid">
                {visibleImages.map((image, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        ref={
                            index === visibleImages.length - 1
                                ? lastImageRef
                                : null
                        }
                        onClick={() => openViewer(index)}
                    >
                        <LazyImage
                            src={image.path}
                            alt={image.title}
                            className="gallery-image"
                            title={image.title}
                        />
                    </div>
                ))}

                {loading && (
                    <div className="loading-indicator">
                        <Spin size="large" />
                        <p>Đang tải thêm ảnh...</p>
                    </div>
                )}
            </div>

            {/* Custom Image Viewer with Swipe Support */}
            {isViewerOpen && (
                <div className="image-viewer-overlay" onClick={closeViewer}>
                    <div className="image-viewer-container">
                        <button
                            className="viewer-close-btn"
                            onClick={closeViewer}
                        >
                            <CloseOutlined />
                        </button>

                        <button
                            className="viewer-nav-btn prev-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                        >
                            <LeftOutlined />
                        </button>

                        <div
                            className="viewer-image-container"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onWheel={handleWheel}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                ref={imageRef}
                                src={allImages[currentImageIndex]?.path}
                                alt={allImages[currentImageIndex]?.title}
                                className={`viewer-image ${
                                    zoomLevel > 1 ? 'zoomed' : ''
                                }`}
                                onDoubleClick={handleDoubleClick}
                                onMouseDown={handleMouseDown}
                                style={{
                                    transform: `scale(${zoomLevel}) translate(${
                                        zoomPosition.x / zoomLevel
                                    }px, ${zoomPosition.y / zoomLevel}px)`,
                                    cursor:
                                        zoomLevel > 1
                                            ? isDragging
                                                ? 'grabbing'
                                                : 'grab'
                                            : 'zoom-in',
                                }}
                            />
                            <div className="viewer-image-info">
                                <p>{allImages[currentImageIndex]?.title}</p>
                                <span>
                                    {currentImageIndex + 1} / {allImages.length}
                                </span>
                            </div>
                        </div>

                        {/* Zoom Controls */}
                        <div
                            className="zoom-controls"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="zoom-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    zoomOut();
                                }}
                                disabled={zoomLevel <= MIN_ZOOM}
                                title="Zoom Out"
                            >
                                <MinusOutlined />
                            </button>
                            <div className="zoom-level-display">
                                {Math.round(zoomLevel * 100)}%
                            </div>
                            <button
                                className="zoom-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    zoomIn();
                                }}
                                disabled={zoomLevel >= MAX_ZOOM}
                                title="Zoom In"
                            >
                                <PlusOutlined />
                            </button>
                            <button
                                className="zoom-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetZoom();
                                }}
                                disabled={zoomLevel === 1}
                                title="Reset Zoom"
                            >
                                <HomeOutlined />
                            </button>
                        </div>

                        <button
                            className="viewer-nav-btn next-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                        >
                            <RightOutlined />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Lazy loading image component
const LazyImage = ({ src, alt, className, title }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={className}>
            {isInView ? (
                <>
                    <img
                        src={src}
                        alt={alt}
                        className="gallery-image"
                        onLoad={() => setIsLoaded(true)}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                    <div className="image-title">{title}</div>
                </>
            ) : (
                <div className="image-placeholder">
                    <Spin />
                </div>
            )}
        </div>
    );
};

export default Gallery;
