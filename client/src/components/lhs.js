import React, { use } from 'react';
import '../stylesheets/lhs.sass';
import { IoHome } from 'react-icons/io5';
import { FaPlusCircle, FaShoppingBag, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { LiaStoreSolid } from "react-icons/lia";
import { BiCategory } from "react-icons/bi";
import { MdAttachMoney } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const LhsView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = React.useState(location.pathname);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    
    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        // Check initial size
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Update active state when location changes
    React.useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);
    
    const handleClick = (path) => {
        setActive(path);
        navigate(path);
        // Close sidebar on mobile after navigation
        if (isMobile) {
            setIsCollapsed(true);
        }
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleClickCategory = async() => {
        try{
            const response = await fetch('http://localhost:3001/categories/get-categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // This tells fetch to include cookies
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 200) {
                const data = response.json();
                setActive('/user/category');
                navigate('/user/category');
                // Close sidebar on mobile after navigation
                if (isMobile) {
                    setIsCollapsed(true);
                }
            }
        }catch(err){
            console.log(err);
        }
    };
    
    const bottomItems = [
        { name: 'Add product', icon: <FaPlusCircle />, action: () => console.log('Add product clicked') },
        { name: 'Log out', icon: <FaSignOutAlt />, action: () => console.log('Log out clicked') },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            
            if (response.ok) {
                navigate('/signin');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {/* Hamburger menu button for mobile */}
            {isMobile && (
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <FaBars /> : <FaTimes />}
                </button>
            )}
            
            {/* Overlay for mobile when sidebar is open */}
            {isMobile && !isCollapsed && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}
            
            <div className={`lhs w-200 h-100 ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
                <div className='lhs_list_menu_wrapper'>
                    <ul className='lhs_list_menu'>
                        <li className={active === '/user/dashboard' ? 'active' : ''} onClick={() => handleClick('/user/dashboard')}>
                            <IoHome className="home_icon" />
                            <span className="title left-10">Home</span>
                        </li>
                        <li className={active === '/user/product' ? 'active' : ''} onClick={() => handleClick('/user/product')}>
                            <FaShoppingBag className="add_icon" />
                            <span className="title left-10">Products</span>
                        </li>
                        <li className={active === '/user/category' ? 'active' : ''} onClick={handleClickCategory}>
                            <BiCategory className="category_icon" />
                            <span className="title left-10">Categories</span>
                        </li>
                        <li className={active === '/user/store' ? 'active' : ''} onClick={() => handleClick('/user/store')}>
                            <a href="#">
                                <LiaStoreSolid className="store_icon" />
                                <span className="title left-10">Stores</span>
                            </a>
                        </li>
                        <li className=''>
                            <a href="#">
                                <MdAttachMoney className="finance_icon" />
                                <span className="title left-10">Finances</span>
                            </a>
                        </li>
                        <li className=''>
                            <a href="#">
                                <IoSettings className="settings_icon" />
                                <span className="title left-10">Settings</span>
                            </a>
                        </li>
                    </ul>
                    <div className="sidebar-bottom">
                        <ul>
                            {bottomItems.map(item => (
                                <li key={item.name} onClick={item.action}>
                                    {item.icon}
                                    <span className="title left-10" onClick={item.name === 'Log out' ? handleLogout : null}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};