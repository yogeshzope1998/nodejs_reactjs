import React from 'react';
import "../stylesheets/rhs.sass";
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../screens/dashboard';
import Product from '../screens/product';
import Category from '../screens/category';
export const RhsView = () => {
    return (
        <div className="rhs">
           <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/product" element={<Product />} />
                <Route path="/settings" element={<h1>Settings</h1>} />
                <Route path="/category" element={<Category />} />
                <Route path="/messages" element={<h1>Messages</h1>} />
           </Routes>
        </div>
    )
}