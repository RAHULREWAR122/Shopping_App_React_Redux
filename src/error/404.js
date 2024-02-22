import React from 'react';
import style from './error.module.css'; 
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate();
  return (
    <div className={style.errorContainer}>
      <h1 className={style.errorHeading}>Oops! Something went wrong.</h1>
      <p className={style.errorMessage}>We apologize for the inconvenience. Please try again later.</p>
      <NavLink to={navigate(-1)}>Go Back</NavLink>
    </div>
  );
}

export default ErrorPage;
