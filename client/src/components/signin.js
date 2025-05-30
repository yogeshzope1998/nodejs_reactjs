import React, { useEffect, useState } from 'react';
import '../stylesheets/signin.sass'; // Import the SCSS file
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        try {
            const response = await fetch("http://localhost:3001/user/signin", { // Corrected URL
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: 'include' // This tells fetch to include cookies
            });

            if (!response.ok) {
                // If the server returns an error status code
                const errorText = await response.text(); // Get the error message from the server
                setErrorMessage(`Sign-in failed: ${errorText}`); // Display the server's error message
                console.error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                return; // Stop further processing
            }

            const data = await response.json();
            navigate('/user/dashboard'); // Redirect to dashboard on successful sign-in
            window.location.reload();
        } catch (error) {
            // If there's a network error or other client-side error
            setErrorMessage("Failed to connect to the server. Please try again later.");
            console.error('Error during sign-in:', error);
        }
    };
    
    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2>Sign In</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Sign In</button>
                </form>
                <div className="forgot-password-link">
                    <p><Link to="/forgot-password">Forgot Password?</Link></p>
                </div>
                <div className="signup-link">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signin;