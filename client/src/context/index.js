import React, {createContext, useContext, useState, useEffect} from 'react'

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
}

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);
    
    console.log('UserProvider - Current user state:', user);
    
    // Check authentication status on app initialization
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:3001/user/me', {
                    method: 'GET',
                    credentials: 'include', // Include cookies
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData.user);
                    localStorage.setItem('userData', JSON.stringify(userData.user));
                } else {
                    // If auth check fails, clear any stored user data
                    setUser(null);
                    localStorage.removeItem('userData');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
                localStorage.removeItem('userData');
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);
    
    const setUserData = (userData) => {
        console.log('UserProvider - Setting user data:', userData);
        setUser(userData);
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userData');
        }
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userData');
    };
    
    const value = {
        user: user,
        isLoading,
        setUserData,
        logout,
    }
    
   return (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
   )
}