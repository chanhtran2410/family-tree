import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Home() {
    return (
        <div className="home-menu">
            <ul>
                <li>
                    <Link to="/family-4gen">Xem gia phả</Link>
                </li>
                {/* <li>
                    <Link to="/family">Xem toàn bộ cây gia đình</Link>
                </li> */}
            </ul>
        </div>
    );
}

export default Home;
