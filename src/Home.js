import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Flex } from 'antd';
import dragon_left from './assets/banner-header-left-default.png';
import dragon_right from './assets/banner-header-right-default.png';

function Home() {
    return (
        <div className="home-container">
            <Flex>
                <img src={dragon_left} alt="Logo" className="dragon" />

                {/* 🔹 Banner div dùng background */}
                <div className="banner-div">
                    <span className="banner-content">
                        TRẦN THỊ
                        <br />
                        THẾ PHỔ
                    </span>
                </div>

                <img src={dragon_right} alt="Logo" className="dragon" />
            </Flex>

            <Flex vertical gap={16}>
                <Link className="home-menu" to="/introduction">
                    Lời mở đầu
                </Link>

                <Link className="home-menu" to="/family-4gen">
                    Xem gia phả
                </Link>

                <Link className="home-menu" to="/gallery">
                    Bút tích
                </Link>
            </Flex>
        </div>
    );
}

export default Home;
