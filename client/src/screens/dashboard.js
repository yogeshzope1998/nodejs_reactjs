import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = React.useState('');
    
    useEffect(() => {
        fetchDashBoardData();
    },[])

    const fetchDashBoardData = async () => {
        try {
            const response = await fetch("http://localhost:3001/user/dashboard", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include' // Include cookies in the request
            });
            
            if (response.status === 200) {
                const data = await response.json();
                setDashboardData(data.content);
            } else if (response.status === 401) {
                // Unauthorized - redirect to signin
                navigate('/signin');
            } else {
                console.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            navigate('/signin');
        }
    }
    
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{dashboardData}</p>
    </div>
  );
}
export default Dashboard;