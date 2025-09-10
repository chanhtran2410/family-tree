import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import './Gallery.css';

// Import all images from assets/images folder
const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
        images[item.replace('./', '')] = r(item);
        return null;
    });
    return images;
};

// Import all images dynamically
const images = importAll(
    require.context('./assets/images', false, /\.(png|jpe?g|svg)$/)
);

function Gallery() {
    const navigate = useNavigate();

    // Convert images object to array for easier handling
    const imageList = Object.entries(images).map(([key, src]) => ({
        key,
        src,
        title: key.replace(/\.(png|jpe?g|svg)$/, ''),
    }));

    const goBack = () => {
        navigate('/');
    };

    return (
        <div className="gallery-container">
            <button className="back-btn" onClick={goBack}>
                Quay lại
            </button>

            <div className="gallery-grid">
                <Image.PreviewGroup>
                    {imageList.map((image, index) => (
                        <div key={index} className="gallery-item">
                            <Image
                                src={image.src}
                                alt={image.title}
                                className="gallery-image"
                                preview={{
                                    mask: (
                                        <div className="preview-mask">Xem</div>
                                    ),
                                }}
                            />
                            <div className="image-title">{image.title}</div>
                        </div>
                    ))}
                </Image.PreviewGroup>
            </div>
        </div>
    );
}

export default Gallery;
