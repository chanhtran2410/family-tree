import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Spin } from 'antd';
import './Gallery.css';

// Get image paths without importing them immediately
const getImagePaths = () => {
    const context = require.context('./assets/images', false, /\.(png|jpe?g|svg)$/);
    return context.keys().map((item) => ({
        key: item.replace('./', ''),
        path: context(item),
        title: item.replace('./', '').replace(/\.(png|jpe?g|svg)$/, ''),
    }));
};

function Gallery() {
    const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState(12); // Number of items to show initially
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();
    const BATCH_SIZE = 12; // Load 12 images at a time
    
    const allImages = getImagePaths();

    // Load more items when scrolling
    const loadMoreItems = useCallback(() => {
        if (loading) return;
        
        setLoading(true);
        setTimeout(() => {
            setVisibleItems(prev => Math.min(prev + BATCH_SIZE, allImages.length));
            setLoading(false);
        }, 100);
    }, [loading, allImages.length, BATCH_SIZE]);

    // Intersection observer for infinite scroll
    const lastImageRef = useCallback((node) => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleItems < allImages.length) {
                loadMoreItems();
            }
        });
        if (node) observerRef.current.observe(node);
    }, [loading, loadMoreItems, visibleItems, allImages.length]);

    const goBack = () => {
        navigate('/');
    };

    // Get currently visible images for rendering
    const visibleImages = allImages.slice(0, visibleItems);

    return (
        <div className="gallery-container">
            <button className="back-btn" onClick={goBack}>
                Quay lại
            </button>

            <div className="gallery-grid">
                <Image.PreviewGroup 
                    items={allImages.map(img => ({
                        src: img.path,
                        alt: img.title,
                    }))}
                >
                    {visibleImages.map((image, index) => (
                        <div 
                            key={index} 
                            className="gallery-item"
                            ref={index === visibleImages.length - 1 ? lastImageRef : null}
                        >
                            <LazyImage
                                src={image.path}
                                alt={image.title}
                                className="gallery-image"
                                title={image.title}
                                previewIndex={index}
                            />
                        </div>
                    ))}
                </Image.PreviewGroup>
                
                {loading && (
                    <div className="loading-indicator">
                        <Spin size="large" />
                        <p>Đang tải thêm ảnh...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Lazy loading image component
const LazyImage = ({ src, alt, className, title, previewIndex }) => {
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
                    <Image
                        src={src}
                        alt={alt}
                        className="gallery-image"
                        preview={{
                            mask: <div className="preview-mask">Xem</div>,
                        }}
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
