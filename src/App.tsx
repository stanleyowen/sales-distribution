import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Items from './components/items.component';
import Setup from './components/setup.component';
import AppLayout from './components/app.component';
import Navbar from './components/navbar.component';
import Invoices from './components/invoices.component';
import Customers from './components/customers.component';
import EditInvoice from './components/edit-invoice.component';

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
                <Route path="/setup" element={<Setup />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/:id" element={<EditInvoice />} />
                <Route path="/items" element={<Items />} />
            </Routes>
        </HashRouter>
    );
}
