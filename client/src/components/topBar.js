import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../stylesheets/topBar.sass";
import { useUserContext } from "../context";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const {user, isLoading, logout} = useUserContext();
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const notificationRef = useRef(null);
    
    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            
            if (response.ok) {
                logout(); // Clear context and localStorage
                navigate('/signin');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="top_bar">
            <div className="top_bar_left">
                <h1 className="app_title">My Business App</h1>
            </div>
            
            <div className="top_bar_center">
                <div className="search_container">
                    <FaSearch className="search_icon" />
                    <input 
                        type="text" 
                        placeholder="Search products, categories..." 
                        className="search_input"
                    />
                </div>
            </div>
            
            <div className="top_bar_right">
                <div className="notification_container" ref={notificationRef}>
                    <button 
                        className="icon_button notification_btn" 
                        onClick={toggleNotifications}
                    >
                        <FaBell />
                        <span className="notification_badge">3</span>
                    </button>
                    
                    {showNotifications && (
                        <div className="notification_dropdown">
                            <div className="dropdown_header">
                                <h4>Notifications</h4>
                            </div>
                            <div className="notification_item">
                                <p>New order received</p>
                                <span>2 minutes ago</span>
                            </div>
                            <div className="notification_item">
                                <p>Product stock low</p>
                                <span>1 hour ago</span>
                            </div>
                            <div className="notification_item">
                                <p>New customer registered</p>
                                <span>3 hours ago</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="profile_container" ref={profileRef}>
                    <button 
                        className="profile_button" 
                        onClick={toggleProfileMenu}
                    >
                        <div className="profile_avatar">
                            <FaUser />
                        </div>
                        <span className="profile_name">
                            {isLoading ? 'Loading...' : user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                        </span>
                    </button>
                    
                    {showProfileMenu && (
                        <div className="profile_dropdown">
                            <div className="dropdown_header">
                                <div className="profile_info">
                                    <div className="profile_avatar large">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h4>{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</h4>
                                        <p>{user ? user.email : 'Not logged in'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown_menu">
                                <button className="dropdown_item">
                                    <FaCog /> Settings
                                </button>
                                <button className="dropdown_item logout" onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};