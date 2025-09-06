import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import FamilyTree from './FamilyTree';
import LimitedFamilyTreePage from './LimitedFamilyTreePage';
import Introduction from './Introduction';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/introduction" element={<Introduction />} />
                <Route path="/family" element={<FamilyTree />} />
                <Route
                    path="/family-4gen"
                    element={<LimitedFamilyTreePage />}
                />
            </Routes>
        </Router>
    );
}

export default App;
