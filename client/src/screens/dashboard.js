import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaUsers, FaDollarSign, FaChartLine, FaPlus, FaEye, FaEdit, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { IoSettings } from 'react-icons/io5';
import '../stylesheets/dashboard.sass';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        summary: {
            totalProducts: 0,
            totalCategories: 0,
            totalRevenue: 0,
            totalOrders: 0
        },
        recentActivity: [],
        quickStats: {
            salesGrowth: 0,
            customerGrowth: 0,
            productViews: 0
        }
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchDashBoardData();
    }, []);

    const fetchDashBoardData = async () => {
        try {
            const response = await fetch("http://localhost:3001/user/dashboard", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include'
            });
            
            if (response.status === 200) {
                const data = await response.json();
                // If backend returns specific dashboard data, use it, otherwise use mock data
                if (data.summary) {
                    setDashboardData(data);
                } else {
                    // Mock data for demonstration
                    setDashboardData({
                        summary: {
                            totalProducts: 156,
                            totalCategories: 12,
                            totalRevenue: 45720,
                            totalOrders: 284
                        },
                        recentActivity: [
                            { id: 1, action: 'New product added', item: 'iPhone 15 Pro', time: '2 hours ago', type: 'product' },
                            { id: 2, action: 'Order completed', item: 'Order #1234', time: '4 hours ago', type: 'order' },
                            { id: 3, action: 'Category updated', item: 'Electronics', time: '1 day ago', type: 'category' },
                            { id: 4, action: 'New customer registered', item: 'john@example.com', time: '2 days ago', type: 'customer' }
                        ],
                        quickStats: {
                            salesGrowth: 12.5,
                            customerGrowth: 8.3,
                            productViews: 1547
                        }
                    });
                }
            } else if (response.status === 401) {
                navigate('/signin');
                return;
            } else {
                console.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Use mock data when backend is not available
            setDashboardData({
                summary: {
                    totalProducts: 156,
                    totalCategories: 12,
                    totalRevenue: 45720,
                    totalOrders: 284
                },
                recentActivity: [
                    { id: 1, action: 'New product added', item: 'iPhone 15 Pro', time: '2 hours ago', type: 'product' },
                    { id: 2, action: 'Order completed', item: 'Order #1234', time: '4 hours ago', type: 'order' },
                    { id: 3, action: 'Category updated', item: 'Electronics', time: '1 day ago', type: 'category' },
                    { id: 4, action: 'New customer registered', item: 'john@example.com', time: '2 days ago', type: 'customer' }
                ],
                quickStats: {
                    salesGrowth: 12.5,
                    customerGrowth: 8.3,
                    productViews: 1547
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'add-product':
                navigate('/user/product');
                break;
            case 'manage-categories':
                navigate('/user/category');
                break;
            case 'view-analytics':
                // Navigate to analytics page when implemented
                console.log('Analytics page not implemented yet');
                break;
            case 'settings':
                // Navigate to settings page when implemented
                console.log('Settings page not implemented yet');
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-grid">
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="card-icon products">
                            <FaShoppingBag />
                        </div>
                        <div className="card-content">
                            <h3>{dashboardData.summary.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <div className="card-icon categories">
                            <BiCategory />
                        </div>
                        <div className="card-content">
                            <h3>{dashboardData.summary.totalCategories}</h3>
                            <p>Categories</p>
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <div className="card-icon revenue">
                            <FaDollarSign />
                        </div>
                        <div className="card-content">
                            <h3>${dashboardData.summary.totalRevenue.toLocaleString()}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <div className="card-icon orders">
                            <FaChartLine />
                        </div>
                        <div className="card-content">
                            <h3>{dashboardData.summary.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <h2>Performance Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-value">
                                <span className="growth positive">
                                    <FaArrowUp />
                                    {dashboardData.quickStats.salesGrowth}%
                                </span>
                            </div>
                            <p>Sales Growth</p>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">
                                <span className="growth positive">
                                    <FaArrowUp />
                                    {dashboardData.quickStats.customerGrowth}%
                                </span>
                            </div>
                            <p>Customer Growth</p>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">
                                {dashboardData.quickStats.productViews.toLocaleString()}
                            </div>
                            <p>Product Views</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button 
                            className="action-btn add-product"
                            onClick={() => handleQuickAction('add-product')}
                        >
                            <FaPlus />
                            Add Product
                        </button>
                        <button 
                            className="action-btn manage-categories"
                            onClick={() => handleQuickAction('manage-categories')}
                        >
                            <BiCategory />
                            Manage Categories
                        </button>
                        <button 
                            className="action-btn view-analytics"
                            onClick={() => handleQuickAction('view-analytics')}
                        >
                            <FaEye />
                            View Analytics
                        </button>
                        <button 
                            className="action-btn settings"
                            onClick={() => handleQuickAction('settings')}
                        >
                            <IoSettings />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        {dashboardData.recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {activity.type === 'product' && <FaShoppingBag />}
                                    {activity.type === 'order' && <FaChartLine />}
                                    {activity.type === 'category' && <BiCategory />}
                                    {activity.type === 'customer' && <FaUsers />}
                                </div>
                                <div className="activity-content">
                                    <p className="activity-action">{activity.action}</p>
                                    <p className="activity-item-name">{activity.item}</p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;