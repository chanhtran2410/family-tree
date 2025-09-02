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
                        GIA PHẢ
                        <br />
                        TRẦN TỘC
                    </span>
                </div>

                <img src={dragon_right} alt="Logo" className="dragon" />
            </Flex>

            <Link className="home-menu" to="/family-4gen">
                Xem gia phả
            </Link>
        </div>
    );
}

export default Home;
