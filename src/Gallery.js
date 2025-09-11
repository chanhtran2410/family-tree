import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
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
    const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState(12);
    const [loading, setLoading] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const observerRef = useRef();
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const BATCH_SIZE = 12;

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

    const goBack = () => {
        navigate('/');
    };

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

    // Touch handlers for swipe
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum distance for swipe

        if (distance > threshold) {
            nextImage(); // swipe left - next image
        } else if (distance < -threshold) {
            prevImage(); // swipe right - previous image
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [nextImage, prevImage]);

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
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'Escape':
                    closeViewer();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isViewerOpen, allImages.length]);

    // Get currently visible images for rendering
    const visibleImages = allImages.slice(0, visibleItems);

    return (
        <div className="gallery-container">
            <button className="back-btn" onClick={goBack}>
                Quay lại
            </button>

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
                            onClick={prevImage}
                        >
                            <LeftOutlined />
                        </button>

                        <div
                            className="viewer-image-container"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={allImages[currentImageIndex]?.path}
                                alt={allImages[currentImageIndex]?.title}
                                className="viewer-image"
                            />
                            <div className="viewer-image-info">
                                <p>{allImages[currentImageIndex]?.title}</p>
                                <span>
                                    {currentImageIndex + 1} / {allImages.length}
                                </span>
                            </div>
                        </div>

                        <button
                            className="viewer-nav-btn next-btn"
                            onClick={nextImage}
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
