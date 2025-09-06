import React, {useState, useEffect} from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import '../styles/components/Header.css';

//Authentication:
import { useAuth } from '../authentication/AuthContext.jsx';

function Header() {
  const {isAuthenticated} = useAuth(); 
  const navigate = useNavigate();
  
  const routes = {
    'account': '/user/account',
    'sign-in': '/sign-in'
  }

  function handleClick (event) {
    const {name} = event.target;
    const route = routes[name];

    if (route) {
      navigate(route);
    } 
    else {
      console.warn(`No route defined for button: ${name}`);
      navigate('/');
    }
  }

  return (
    <header>
      <h1>Keeper</h1>

      <div>
        {isAuthenticated === true && (
          <>
            <h2>Welcome back!</h2>
            <button name='account' onClick={handleClick}>Account</button>
          </>
        )}

        {isAuthenticated === false && (
          <>
            <button name='sign-in' onClick={handleClick}>Sign In</button>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;
