import React, {useState} from "react";
import {Navigate, useNavigate } from 'react-router-dom';
import '../styles/pages/AuthPage.css';

// Functions:
import {isValidRegistration, trimForm} from '../../utils.js';

// Modules:
import axios from "axios";

// Authentication:
import { useAuth } from '../authentication/AuthContext.jsx';

//Components:
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
// import ResetPassForm from '../components/ResetPassForm.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

function AuthPage () {
    const { setIsAuthenticated } = useAuth();
    const [authMode, setAuthMode] = useState('login');
    const [error, setError] = useState({
        errorStatus: false,
        errorMessage: ''
    });
    const navigate = useNavigate();

    
    async function handleLogin (form) {
        try {
            // Need await for axios call
            const result = await axios.post('/api/login', form, {
                withCredentials: true
            });
            // Check result.data.success (axios wraps response in .data)
            if (result.data.success) {
                setIsAuthenticated(true);
                navigate('/');
            }
            else {
                console.log('Error occurred when verifying login.')
            }
        }
        catch (err) {
            console.log('There was an error making an AXIOS call for: "Login"');
        }
    }
    
    async function handleRegister (form) {
        try {
            if (isValidRegistration(form)) {
                // Process: Trim each entry so no extra spaces exist:
                const trimmedForm = trimForm(form);
    
                // Axios API call to server to save user:
                const result = await axios.post('/api/register', trimmedForm);

                // Process: Take user to the main page:
                setIsAuthenticated(true);
                navigate('/');
            }
            else {
                setError(()=>{
                    return {
                        errorStatus: true,
                        errorMessage: 'All required fields must be entered. The passwords must match, and must have a special character, number, lowercase, and uppercase.'
                    }
                })
            }
        }
        catch (err) {
            console.log('There was an error making an AXIOS call for: "Register"');
            setError(()=>{
                return {
                    errorStatus: true,
                    errorMessage: 'The server is currently not responding. Try again later.'
                }
            })
        }
    }

    // Handle which page to render: 
    function renderAuth () {
        switch(authMode) {
            case 'login':
                return <LoginForm handleLogin={handleLogin}/>
            case 'register':
                return <RegisterForm handleRegister={handleRegister}/>
            case 'reset':
                return <ResetPassForm/>
        }
    }
    
    return (
        <div className="auth-page">
            {/* Load Component */}
            <div className="auth-container">
                {/* Render error if necessary: */}
                {error.errorStatus === true && <ErrorBox ErrorMessage={error.errorMessage} type="error"/>}

                {/* Render current sub page:  */}
                {renderAuth()}

                <div className="auth-links">
                    {/* Navigator back to login form: */}
                    {authMode !== 'login' && (
                        <button onClick={() => setAuthMode('login')}>Back to Login</button>
                    )}
                    
                    {/* Navigator to Register and Forgot Password */}
                    {authMode === 'login' && (
                        <>
                            <button onClick={() => {setAuthMode('register')}}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    ); 
}
export default AuthPage; 