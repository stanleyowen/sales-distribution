import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './components/app.component';
import Navbar from './components/navbar.component';
import Customer from './components/customer.component';

process.env.NODE_ENV === 'production'
    ? require('./App.min.css')
    : require('./App.css');

// eslint-disable-next-line
export default function App() {
    return (
        <HashRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<AppLayout />} />
                <Route path="/customer" element={<Customer />} />
            </Routes>
        </HashRouter>
    );
}
